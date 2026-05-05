import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MoreVertical, Plus, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TopNav } from '@/components/layout/TopNav'
import { BID_MIN, BID_MAX, CHANNEL_TABS } from '@/lib/constants'

interface Template {
  id: string
  name: string
  category: string
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  language: string
  bidAmount?: number
  createdAt: string
}

const INITIAL_TEMPLATES: Template[] = [
  { id: '1', name: 'summer_promo_2024', category: 'MARKETING', status: 'APPROVED', language: 'English', bidAmount: 0.80, createdAt: 'May 1, 2024' },
  { id: '2', name: 'order_confirmation', category: 'UTILITY', status: 'APPROVED', language: 'English', createdAt: 'Apr 20, 2024' },
  { id: '3', name: 'flash_sale_alert', category: 'MARKETING', status: 'APPROVED', language: 'English', bidAmount: 1.20, createdAt: 'Apr 15, 2024' },
  { id: '4', name: 'account_otp', category: 'AUTHENTICATION', status: 'APPROVED', language: 'English', createdAt: 'Mar 10, 2024' },
  { id: '5', name: 'loyalty_rewards', category: 'MARKETING', status: 'PENDING', language: 'English', bidAmount: 0.60, createdAt: 'May 3, 2024' },
  { id: '6', name: 'shipping_update', category: 'UTILITY', status: 'APPROVED', language: 'English', createdAt: 'Feb 28, 2024' },
]

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
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border">
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
              Update bid
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 2 }}>
              {template.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
              Cost per message
            </label>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
              Set a maximum bid cap per 1,000 message deliveries (₹{BID_MIN.toFixed(2)} – ₹{BID_MAX.toFixed(2)}).
            </p>
            <div className="flex items-center gap-2">
              <div style={{ maxWidth: 200, flex: 1 }}>
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
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                INR
              </span>
            </div>
            {hasError && (
              <div className="flex items-center gap-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--destructive)' }}>
                <AlertCircle style={{ width: 12, height: 12 }} />
                Bid must be between ₹{BID_MIN.toFixed(2)} and ₹{BID_MAX.toFixed(2)}
              </div>
            )}
          </div>

          {per1000 !== null && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Cost per 1,000:</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                ₹{per1000.toFixed(2)} INR
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </div>
    </div>
  )
}

export function TemplateList() {
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)
  const [updatingTemplate, setUpdatingTemplate] = useState<Template | null>(null)

  function handleSaveBid(id: string, amount: number) {
    setTemplates(ts => ts.map(t => t.id === id ? { ...t, bidAmount: amount } : t))
    setUpdatingTemplate(null)
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav
        crumbs={[{ label: 'Templates' }]}
        actions={
          <Link to="/templates/new">
            <Button size="sm" className="flex items-center gap-1.5">
              <Plus style={{ width: 14, height: 14 }} />
              New Template
            </Button>
          </Link>
        }
      />

      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-border px-6">
        {CHANNEL_TABS.map(tab => (
          <button
            key={tab}
            className="px-4 py-3 transition-colors"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: tab === 'WHATSAPP' ? 'var(--font-weight-semi-bold)' : 'var(--font-weight-normal)',
              color: tab === 'WHATSAPP' ? 'var(--primary)' : 'var(--muted-foreground)',
              borderBottom: tab === 'WHATSAPP' ? '2px solid var(--primary)' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                {['Name', 'Category', 'Status', 'Language', 'Bid Cap', 'Created', ''].map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left"
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-semi-bold)',
                      color: 'var(--muted-foreground)',
                      width: col === '' ? 48 : undefined,
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {templates.map((t, i) => (
                <tr
                  key={t.id}
                  className="hover:bg-muted/20 transition-colors"
                  style={{ borderBottom: i < templates.length - 1 ? '1px solid var(--border)' : undefined }}
                >
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
                      {t.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                      {t.category.charAt(0) + t.category.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{t.language}</span>
                  </td>
                  <td className="px-4 py-3">
                    {t.bidAmount !== undefined ? (
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
                        ₹{t.bidAmount.toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{t.createdAt}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowActions onUpdateBid={() => setUpdatingTemplate(t)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
