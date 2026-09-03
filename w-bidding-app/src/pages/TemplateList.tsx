import { useState, useRef, useEffect, type ElementType } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MoreVertical, X, AlertCircle, Search, AlignJustify,
  RefreshCw, SlidersHorizontal, ChevronDown, Plus, Download,
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  LayoutGrid, CheckCircle, TrendingUp, Sparkles, Info,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { TopNav } from '@/components/layout/TopNav'
import { WhatsAppPhoneMockup } from '@/components/layout/WhatsAppPhoneMockup'
import { MultiplierCard } from '@/components/bidding/MultiplierCard'
import { BID_MIN, BID_MAX, CHANNEL_TABS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { maskPhone } from '@/lib/format'
import { useDownloads } from '@/context/DownloadsContext'

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

function RowActions({ onUpdateBid, onPreview }: { onUpdateBid: () => void; onPreview: () => void }) {
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
            onClick={() => { setOpen(false); onPreview() }}
            className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Preview template
          </button>
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

function PreviewTemplateModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-background rounded-xl shadow-xl w-full mx-4" style={{ maxWidth: 480 }}>
        <div className="flex items-start justify-between px-6 py-4 border-b border-border">
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
              Template Name: <span style={{ color: 'var(--primary)' }}>{template.name}</span>
            </p>
            {template.bidAmount !== undefined && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 2 }}>
                Current bid: ₹{template.bidAmount.toFixed(2)} INR
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div className="px-6 py-6 flex justify-center">
          <WhatsAppPhoneMockup
            body={`Dear Customer, this is a ${template.category.toLowerCase()} message from Helo Ai.`}
            footer="T&C"
            buttons={['Visit Now']}
          />
        </div>
      </div>
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
  const [multiplier, setMultiplier] = useState(1.0)

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
          {per1000 !== null && (
            <MultiplierCard
              baseBid={numericValue}
              multiplier={multiplier}
              onChange={setMultiplier}
              helpText="Adjusts this template's bid. 1.0× applies the base bid with no change."
            />
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

// ─── Profiles ────────────────────────────────────────────────────────────────

interface ProfileRow {
  id: string
  businessName: string
  businessNumber: string
  quality: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'Connected' | 'Disconnected'
  lastUpdated: string
}

const PROFILES_MOCK: ProfileRow[] = [
  { id: '1', businessName: 'Test - Helo.ai',  businessNumber: '15557836045', quality: 'HIGH', status: 'Connected', lastUpdated: 'Apr 2, 2026, 11:22:00 AM' },
  { id: '2', businessName: 'VCPL - Test1',    businessNumber: '15557836046', quality: 'HIGH', status: 'Connected', lastUpdated: 'NA' },
]

const QUALITY_COLOR: Record<string, string> = {
  HIGH: '#22c55e', MEDIUM: '#f59e0b', LOW: '#ef4444',
}

function ProfileRowActions({ onEdit }: { onEdit: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
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
        <div className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border bg-background shadow-md py-1" style={{ minWidth: 140 }}>
          <button
            onClick={() => { setOpen(false); onEdit() }}
            className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  )
}

function ProfilesView() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = PROFILES_MOCK.filter(p => {
    const matchSearch = p.businessName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-0">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2" style={{ minWidth: 240 }}>
          <input
            type="text"
            placeholder="Search by Business Name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}
          />
          <AlignJustify style={{ width: 14, height: 14, color: 'var(--muted-foreground)', flexShrink: 0 }} />
        </div>
        <button
          className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
          style={{ cursor: 'pointer', color: 'var(--muted-foreground)' }}
        >
          <Search style={{ width: 15, height: 15 }} />
        </button>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ minWidth: 140 }}>
          <option value="">Select Status</option>
          <option value="Connected">Connected</option>
          <option value="Disconnected">Disconnected</option>
        </Select>
        <button
          className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
          style={{ cursor: 'pointer', color: 'var(--muted-foreground)' }}
          onClick={() => { setSearch(''); setStatusFilter('') }}
        >
          <RefreshCw style={{ width: 15, height: 15 }} />
        </button>
        <Button size="sm" className="flex items-center gap-1.5">
          Embedded Sign-up
        </Button>
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background" style={{ minWidth: 200 }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>1023586759560338</span>
          <ChevronDown style={{ width: 14, height: 14, color: 'var(--muted-foreground)', marginLeft: 'auto' }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                {['Business Name', 'Business Number', 'Quality', 'Status', 'Last Updated', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                    No profiles found
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors" style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : undefined }}>
                    <td className="px-4 py-4">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>{p.businessName}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{p.businessNumber}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: QUALITY_COLOR[p.quality], flexShrink: 0, display: 'inline-block' }} />
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{p.quality}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className="px-3 py-1 rounded-full"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                          background: p.status === 'Connected' ? '#22c55e' : '#e5e7eb',
                          color: p.status === 'Connected' ? '#fff' : 'var(--foreground)',
                          display: 'inline-block',
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{p.lastUpdated}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <ProfileRowActions onEdit={() => navigate('/profiles/edit')} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Contact Book ─────────────────────────────────────────────────────────────

interface ContactRow {
  id: string
  displayName: string
  userId: string
  phone: string
  businessName: string
  businessNumber: string
  createdAt: string
}

const CONTACTS_MOCK: ContactRow[] = [
  { id: '1', displayName: 'Rahul Sharma',   userId: 'IN.13491208655302741918', phone: '918433853078', businessName: 'Test - Helo.ai', businessNumber: '15557836045', createdAt: '2026-09-03 14:43' },
  { id: '2', displayName: 'Priya Mehta',    userId: 'IN.87382107544291630807', phone: '918108653528', businessName: 'Test - Helo.ai', businessNumber: '15557836045', createdAt: '2026-09-03 12:12' },
  { id: '3', displayName: 'Amit Verma',     userId: 'IN.76271006433180519696', phone: '917021344401', businessName: 'Test - Helo.ai', businessNumber: '15557836045', createdAt: '2026-09-02 22:23' },
  { id: '4', displayName: 'John Smith',     userId: 'US.68946509055302741918', phone: '14155551234',  businessName: 'VCPL - Test1',   businessNumber: '15557836046', createdAt: '2026-09-02 18:30' },
  { id: '5', displayName: 'Sneha Patel',    userId: 'IN.51273006433080519696', phone: '919876543210', businessName: 'Test - Helo.ai', businessNumber: '15557836045', createdAt: '2026-09-01 09:15' },
  { id: '6', displayName: 'Vikram Singh',   userId: 'IN.40164905321969408585', phone: '918765432109', businessName: 'Test - Helo.ai', businessNumber: '15557836045', createdAt: '2026-08-31 16:44' },
  { id: '7', displayName: 'Neha Kapoor',    userId: 'IN.29055804210858297474', phone: '917654321098', businessName: 'VCPL - Test1',   businessNumber: '15557836046', createdAt: '2026-08-30 11:02' },
  { id: '8', displayName: 'Arjun Reddy',    userId: 'IN.17946703109747186363', phone: '919543210987', businessName: 'Test - Helo.ai', businessNumber: '15557836045', createdAt: '2026-08-29 08:30' },
]

function fmtISODate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function fmtDateLabel(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function DateRangeFilter({
  start,
  end,
  onChange,
}: {
  start: string
  end: string
  onChange: (start: string, end: string) => void
}) {
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

  const presets = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 days', days: 6 },
    { label: 'Last 14 days', days: 13 },
    { label: 'Last 30 days', days: 29 },
  ]

  function applyPreset(days: number) {
    const endDate = new Date()
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - days)
    onChange(fmtISODate(startDate), fmtISODate(endDate))
    setOpen(false)
  }

  const label = start === end ? fmtDateLabel(start) : `${fmtDateLabel(start)} - ${fmtDateLabel(end)}`

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
        style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', cursor: 'pointer' }}
      >
        <CalendarIcon style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
        {label}
        <ChevronDown style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border bg-background shadow-md p-3 flex flex-col gap-3"
          style={{ width: 260 }}
        >
          <div className="flex flex-col gap-0.5">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.days)}
                className="text-left px-2 py-1.5 rounded hover:bg-muted transition-colors"
                style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-border pt-3">
            <label className="flex-1 flex flex-col gap-1">
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>From</span>
              <input
                type="date"
                value={start}
                max={end}
                onChange={e => onChange(e.target.value, end)}
                className="rounded border border-border px-2 py-1"
                style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', background: 'var(--background)' }}
              />
            </label>
            <label className="flex-1 flex flex-col gap-1">
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>To</span>
              <input
                type="date"
                value={end}
                min={start}
                onChange={e => onChange(start, e.target.value)}
                className="rounded border border-border px-2 py-1"
                style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', background: 'var(--background)' }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

function ContactBookView() {
  const { addDownload } = useDownloads()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const today = fmtISODate(new Date())
  const [dateRange, setDateRange] = useState({ start: today, end: today })

  const filtered = CONTACTS_MOCK.filter(c => {
    const matchesSearch =
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      c.userId.toLowerCase().includes(search.toLowerCase()) ||
      maskPhone(c.phone).includes(search) ||
      c.businessName.toLowerCase().includes(search.toLowerCase())
    const createdDate = c.createdAt.slice(0, 10)
    const matchesDate = createdDate >= dateRange.start && createdDate <= dateRange.end
    return matchesSearch && matchesDate
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const rangeStart = filtered.length > 0 ? (page - 1) * perPage + 1 : 0
  const rangeEnd = Math.min(page * perPage, filtered.length)

  function handleExport() {
    addDownload(`contact-list-${dateRange.start}_${dateRange.end}.csv`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 flex-1" style={{ maxWidth: 360 }}>
        <Search style={{ width: 14, height: 14, color: 'var(--muted-foreground)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search by name, User ID or business"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}
        />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DateRangeFilter
            start={dateRange.start}
            end={dateRange.end}
            onChange={(start, end) => { setDateRange({ start, end }); setPage(1) }}
          />
          <Button size="sm" variant="outline" className="flex items-center gap-1.5" onClick={handleExport}>
            <Download style={{ width: 14, height: 14 }} />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                {['User Display Name', 'User ID', 'User Phone Number', 'Business Name', 'Business Number', 'Created at'].map(h => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                    No contacts found
                  </td>
                </tr>
              ) : (
                paginated.map((c, i) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors" style={{ borderBottom: i < paginated.length - 1 ? '1px solid var(--border)' : undefined }}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>{c.displayName}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>{c.userId}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: 'monospace' }}>{maskPhone(c.phone)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{c.businessName}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{c.businessNumber}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{c.createdAt}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end gap-3 px-4 py-2.5 border-t border-border">
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Rows per page</span>
            <Select
              value={String(perPage)}
              onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}
              style={{ minWidth: 70 }}
            >
              {[10, 25, 50, 100].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
            {filtered.length > 0 ? `${rangeStart} - ${rangeEnd} of ${filtered.length}` : '0 - 0 of 0'}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn('p-1.5 rounded transition-colors', page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-muted cursor-pointer')}
              style={{ border: 'none', background: 'none', color: 'var(--foreground)', display: 'flex', alignItems: 'center' }}
              aria-label="Previous page"
            >
              <ChevronLeft style={{ width: 15, height: 15 }} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={cn('p-1.5 rounded transition-colors', page >= totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-muted cursor-pointer')}
              style={{ border: 'none', background: 'none', color: 'var(--foreground)', display: 'flex', alignItems: 'center' }}
              aria-label="Next page"
            >
              <ChevronRight style={{ width: 15, height: 15 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABLE_COLS = ['Template Name', 'Category', 'Template ID', 'Language', 'Status', 'Reason', 'Last Updated', 'Action'] as const

type SubTab = 'Profiles' | 'Templates' | 'Contacts'

export function TemplateList() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Templates')
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)
  const [updatingTemplate, setUpdatingTemplate] = useState<Template | null>(null)
  const [previewingTemplate, setPreviewingTemplate] = useState<Template | null>(null)
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
            {(['Profiles', 'Templates', 'Contacts'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={cn(
                  'px-5 py-2 rounded-md text-sm font-medium transition-colors',
                  activeSubTab === tab
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

        {activeSubTab === 'Contacts' && (
          <div className="px-6 py-5">
            <ContactBookView />
          </div>
        )}

        {activeSubTab === 'Profiles' && (
          <div className="px-6 py-5">
            <ProfilesView />
          </div>
        )}

        {activeSubTab === 'Templates' && (
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
                          <RowActions onUpdateBid={() => setUpdatingTemplate(t)} onPreview={() => setPreviewingTemplate(t)} />
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
        )}
      </div>


      {updatingTemplate && (
        <UpdateBidModal
          template={updatingTemplate}
          onSave={amount => handleSaveBid(updatingTemplate.id, amount)}
          onClose={() => setUpdatingTemplate(null)}
        />
      )}

      {previewingTemplate && (
        <PreviewTemplateModal
          template={previewingTemplate}
          onClose={() => setPreviewingTemplate(null)}
        />
      )}
    </div>
  )
}
