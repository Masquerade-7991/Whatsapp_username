import { useState, useRef, useEffect, type ElementType } from 'react'
import { Link } from 'react-router-dom'
import {
  MoreVertical, X, AlertCircle, Search, AlignJustify,
  RefreshCw, SlidersHorizontal, ChevronDown, Plus,
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  LayoutGrid, CheckCircle, TrendingUp, Sparkles, Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { TopNav } from '@/components/layout/TopNav'
import { BID_MIN, BID_MAX, CHANNEL_TABS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  category: string
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  language: string
  isAI: boolean
  templateId: string
  bidAmount?: number
  reason?: string
  lastUpdated: string
}

const INITIAL_TEMPLATES: Template[] = [
  { id: '1', name: 'summer_promo_2024',  category: 'MARKETING',      status: 'APPROVED', language: 'English', isAI: false, templateId: 'summer_promo_2024_a1b2c3',    bidAmount: 0.80, reason: '',              lastUpdated: 'May 1, 2024'  },
  { id: '2', name: 'order_confirmation', category: 'UTILITY',         status: 'APPROVED', language: 'English', isAI: true,  templateId: 'order_confirmation_d4e5f6',                    reason: '',              lastUpdated: 'Apr 20, 2024' },
  { id: '3', name: 'flash_sale_alert',   category: 'MARKETING',       status: 'APPROVED', language: 'English', isAI: false, templateId: 'flash_sale_alert_g7h8i9',    bidAmount: 1.20, reason: '',              lastUpdated: 'Apr 15, 2024' },
  { id: '4', name: 'account_otp',        category: 'AUTHENTICATION',  status: 'APPROVED', language: 'English', isAI: true,  templateId: 'account_otp_j1k2l3',                           reason: '',              lastUpdated: 'Mar 10, 2024' },
  { id: '5', name: 'loyalty_rewards',    category: 'MARKETING',       status: 'PENDING',  language: 'English', isAI: false, templateId: 'loyalty_rewards_m4n5o6',     bidAmount: 0.60, reason: 'Under review',  lastUpdated: 'May 3, 2024'  },
  { id: '6', name: 'shipping_update',    category: 'UTILITY',         status: 'APPROVED', language: 'English', isAI: false, templateId: 'shipping_update_p7q8r9',                        reason: '',              lastUpdated: 'Feb 28, 2024' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Template['status'] }) {
  const map = {
    APPROVED: { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
    PENDING:  { bg: '#fefce8', text: '#a16207', dot: '#eab308' },
    REJECTED: { bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444' },
  }
  const s = map[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
      style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', background: s.bg, color: s.text }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0, display: 'inline-block' }} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}

function RowActions({ onUpdateBid }: { onUpdateBid: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded hover:bg-muted transition-colors"
        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}
        aria-label="Row actions"
      >
        <MoreVertical style={{ width: 16, height: 16 }} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border bg-background shadow-md py-1"
          style={{ minWidth: 160 }}
        >
          <button
            onClick={() => { setOpen(false); onUpdateBid() }}
            className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Update bid
          </button>
        </div>
      )}
    </div>
  )
}

function UpdateBidModal({
  template,
  onSave,
  onClose,
}: {
  template: Template
  onSave: (amount: number) => void
  onClose: () => void
}) {
  const [value, setValue] = useState<number | ''>(template.bidAmount ?? BID_MIN)
  const [touched, setTouched] = useState(false)

  const numericValue = typeof value === 'number' ? value : NaN
  const per1000 = !isNaN(numericValue) && numericValue >= BID_MIN ? numericValue * 1000 : null
  const hasError = touched && (value === '' || (typeof value === 'number' && (value < BID_MIN || value > BID_MAX)))

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '') { setValue(''); return }
    const parsed = parseFloat(parseFloat(raw).toFixed(2))
    if (!isNaN(parsed)) setValue(parsed)
  }

  function handleSave() {
    setTouched(true)
    if (value === '' || (typeof value === 'number' && (value < BID_MIN || value > BID_MAX))) return
    onSave(value as number)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-background rounded-xl shadow-xl w-full mx-4" style={{ maxWidth: 440 }}>
        <div className="flex items-start justify-between px-6 py-4 border-b border-border">
          <div>
            <div className="flex items-center gap-1.5">
              <p style={{ fontSize: '1rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Update bid</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span style={{ display: 'flex', alignItems: 'center', cursor: 'default' }}>
                      <Info style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" style={{ maxWidth: 220 }}>
                    Set a new custom bid value for the template. Only 100 attempts allowed per hour.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 2 }}>{template.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div style={{ width: 120 }}>
              <Input
                type="number"
                step="0.01"
                min={BID_MIN}
                max={BID_MAX}
                placeholder="0.00"
                value={value}
                onChange={handleChange}
                onBlur={() => setTouched(true)}
                className={hasError ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
            </div>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)', flexShrink: 0 }}>INR</span>
            {per1000 !== null && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted flex-1">
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Cost per 1,000:</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                  ₹{per1000.toFixed(2)} INR
                </span>
              </div>
            )}
          </div>
          {hasError && (
            <div className="flex items-center gap-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--destructive)' }}>
              <AlertCircle style={{ width: 12, height: 12 }} />
              Bid must be between ₹{BID_MIN.toFixed(2)} and ₹{BID_MAX.toFixed(2)}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </div>
    </div>
  )
}

function StatsCard({
  icon: Icon,
  label,
  mainValue,
  sections,
}: {
  icon: ElementType
  label: string
  mainValue: string
  sections: { label: string; icon?: ElementType; value: string }[]
}) {
  return (
    <div className="rounded-lg border border-border bg-background px-5 py-4 flex items-stretch">
      <div className="flex flex-col justify-center gap-1 pr-5 shrink-0">
        <div className="flex items-center gap-1.5">
          <Icon style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
          <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)' }}>{label}</span>
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', lineHeight: 1.2 }}>
          {mainValue}
        </span>
      </div>
      {sections.map((section, i) => {
        const SectionIcon = section.icon
        return (
          <div key={i} className="flex items-stretch">
            <div className="w-px bg-border mx-4" />
            <div className="flex flex-col justify-center gap-0.5 min-w-[80px]">
              <div className="flex items-center gap-1">
                {SectionIcon && <SectionIcon style={{ width: 11, height: 11, color: '#a855f7' }} />}
                <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                  {section.label}
                </span>
              </div>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
                {section.value}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABLE_COLS = ['Template Name', 'Category', 'Template ID', 'Language', 'Status', 'Reason', 'Last Updated', 'Action'] as const

export function TemplateList() {
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)
  const [updatingTemplate, setUpdatingTemplate] = useState<Template | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  function handleSaveBid(id: string, amount: number) {
    setTemplates(ts => ts.map(t => t.id === id ? { ...t, bidAmount: amount } : t))
    setUpdatingTemplate(null)
  }

  // Derived stats
  const total        = templates.length
  const aiCount      = templates.filter(t => t.isAI).length
  const nonAiCount   = total - aiCount
  const approved     = templates.filter(t => t.status === 'APPROVED').length
  const aiApproved   = templates.filter(t => t.isAI && t.status === 'APPROVED').length
  const nonAiApproved = approved - aiApproved

  const pct = (n: number, d: number) =>
    `${d > 0 ? (n / d * 100).toFixed(2) : '0.00'} %`

  // Search + pagination
  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.templateId.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)
  const rangeStart = filtered.length > 0 ? (page - 1) * perPage + 1 : 0
  const rangeEnd   = Math.min(page * perPage, filtered.length)

  // Channel tabs: strip 'Templates' — it's the page heading in this layout
  const channelTabs = CHANNEL_TABS.filter(t => t !== 'Templates')

  return (
    <div className="flex flex-col h-full">
      <TopNav
        crumbs={[{ label: 'Templates' }, { label: 'WhatsApp Templates' }]}
        actions={
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50">
            <span style={{ fontSize: 13 }}>🪙</span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: '#92400e' }}>14,127</span>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto bg-muted/20">
        <div className="bg-background px-6 py-4 border-b border-border">
          {/* Title + channel tabs */}
          <div className="flex items-center gap-4 mb-4">
            <h1 style={{ fontSize: '1.375rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
              Templates
            </h1>
            <div className="flex items-center gap-2">
              {channelTabs.map(tab => (
                <button
                  key={tab}
                  className={cn(
                    'px-3 py-1 rounded text-sm transition-colors',
                    tab === 'WHATSAPP'
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1">
            {(['Profiles', 'Templates'] as const).map(tab => (
              <button
                key={tab}
                className={cn(
                  'px-5 py-2 rounded-md text-sm font-medium transition-colors',
                  tab === 'Templates'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:bg-muted bg-background'
                )}
                style={{ cursor: 'pointer' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4">
            <StatsCard
              icon={LayoutGrid}
              label="Templates"
              mainValue={String(total)}
              sections={[
                { label: 'AI',     icon: Sparkles, value: `${aiCount} ( ${pct(aiCount, total)} )` },
                { label: 'Non-AI',                 value: `${nonAiCount} ( ${pct(nonAiCount, total)} )` },
              ]}
            />
            <StatsCard
              icon={CheckCircle}
              label="Approved"
              mainValue={String(approved)}
              sections={[
                { label: 'AI',     icon: Sparkles, value: `${aiApproved} ( ${pct(aiApproved, approved)} )` },
                { label: 'Non-AI',                 value: `${nonAiApproved} ( ${pct(nonAiApproved, approved)} )` },
              ]}
            />
            <StatsCard
              icon={TrendingUp}
              label="Engagement"
              mainValue="72.04 %"
              sections={[
                { label: 'AI',     icon: Sparkles, value: '85.00 %' },
                { label: 'Non-AI',                 value: '65.32 %' },
              ]}
            />
          </div>

          {/* Search + toolbar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2" style={{ minWidth: 280 }}>
              <Search style={{ width: 14, height: 14, color: 'var(--muted-foreground)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by Template Name"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                }}
              />
              <AlignJustify style={{ width: 14, height: 14, color: 'var(--muted-foreground)', flexShrink: 0 }} />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer', border: '1px solid var(--border)' }}
              >
                <ChevronDown style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
              </button>
              <button
                className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                style={{ cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}
                title="Filter"
              >
                <SlidersHorizontal style={{ width: 16, height: 16 }} />
              </button>
              <button
                className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                style={{ cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}
                title="Refresh"
                onClick={() => { setSearch(''); setPage(1) }}
              >
                <RefreshCw style={{ width: 16, height: 16 }} />
              </button>
              <Link to="/templates/new">
                <Button size="sm" className="flex items-center gap-1.5">
                  <Plus style={{ width: 14, height: 14 }} />
                  Create Template
                </Button>
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden bg-background">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
                    {TABLE_COLS.map(col => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left whitespace-nowrap"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-semi-bold)',
                          color: 'var(--foreground)',
                          width: col === 'Action' ? 72 : undefined,
                        }}
                      >
                        {col === 'Last Updated' ? (
                          <span className="flex items-center gap-1">
                            Last Updated
                            <span style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>↑↓</span>
                          </span>
                        ) : col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td
                        colSpan={TABLE_COLS.length}
                        className="px-4 py-12 text-center"
                        style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}
                      >
                        No data found
                      </td>
                    </tr>
                  ) : (
                    paginated.map((t, i) => (
                      <tr
                        key={t.id}
                        className="hover:bg-muted/20 transition-colors"
                        style={{ borderBottom: i < paginated.length - 1 ? '1px solid var(--border)' : undefined }}
                      >
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
                              {t.name}
                            </span>
                            {t.category === 'MARKETING' && t.bidAmount !== undefined && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span
                                      style={{ color: 'var(--primary)', fontSize: 11, lineHeight: 1, cursor: 'default', userSelect: 'none' }}
                                      aria-label="Custom bid value is applied"
                                    >
                                      ✦
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    Custom bid value is applied
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                            {t.category.charAt(0) + t.category.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>
                            {t.templateId}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{t.language}</span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                            {t.reason || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{t.lastUpdated}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <RowActions onUpdateBid={() => setUpdatingTemplate(t)} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className="flex items-center justify-end gap-3 px-4 py-2.5 border-t border-border"
              style={{ background: 'var(--background)' }}
            >
              <div className="flex items-center gap-0.5">
                {[
                  { icon: ChevronsLeft,  action: () => setPage(1),                            disabled: page === 1          },
                  { icon: ChevronLeft,   action: () => setPage(p => Math.max(1, p - 1)),      disabled: page === 1          },
                  { icon: ChevronRight,  action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page >= totalPages },
                  { icon: ChevronsRight, action: () => setPage(totalPages || 1),               disabled: page >= totalPages  },
                ].map(({ icon: Icon, action, disabled }, i) => (
                  <button
                    key={i}
                    onClick={action}
                    disabled={disabled}
                    className={cn(
                      'p-1.5 rounded transition-colors',
                      disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'
                    )}
                    style={{ border: 'none', background: 'none', color: 'var(--foreground)', display: 'flex', alignItems: 'center' }}
                  >
                    <Icon style={{ width: 15, height: 15 }} />
                  </button>
                ))}
              </div>

              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                {filtered.length > 0 ? `${rangeStart} - ${rangeEnd} of ${filtered.length}` : '0 - 0 of 0'}
              </span>

              <div className="flex items-center gap-1 px-2 py-1 rounded border border-border" style={{ cursor: 'default' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{perPage}</span>
                <ChevronDown style={{ width: 12, height: 12, color: 'var(--muted-foreground)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {updatingTemplate && (
        <UpdateBidModal
          template={updatingTemplate}
          onSave={amount => handleSaveBid(updatingTemplate.id, amount)}
          onClose={() => setUpdatingTemplate(null)}
        />
      )}
    </div>
  )
}
