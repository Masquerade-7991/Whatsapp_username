import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { TopNav } from '@/components/layout/TopNav'
import { cn } from '@/lib/utils'
import { DATE_INTERVALS } from '@/lib/constants'
import { fmtINR } from '@/lib/format'

interface TemplateRow {
  id: string
  name: string
  category: string
  status: 'Approved' | 'Rejected' | 'Pending'
  sent: number
  delivered: number
  deliveryRate: string
  hasBid: boolean
  actualCostPerMsg: number | null
}

const MOCK_DATA: TemplateRow[] = [
  { id: '1', name: 'summer_sale_v1', category: 'Marketing', status: 'Approved', sent: 24500, delivered: 21560, deliveryRate: '87.9%', hasBid: true, actualCostPerMsg: 0.00418 },
  { id: '2', name: 'welcome_offer', category: 'Marketing', status: 'Approved', sent: 12000, delivered: 10800, deliveryRate: '90.0%', hasBid: false, actualCostPerMsg: 0.00350 },
  { id: '3', name: 'reengagement_oct', category: 'Marketing', status: 'Approved', sent: 8300, delivered: 5810, deliveryRate: '70.0%', hasBid: true, actualCostPerMsg: 0.00391 },
  { id: '4', name: 'black_friday_promo', category: 'Marketing', status: 'Pending', sent: 0, delivered: 0, deliveryRate: '—', hasBid: true, actualCostPerMsg: null },
  { id: '5', name: 'order_confirmation', category: 'Utility', status: 'Approved', sent: 55000, delivered: 53900, deliveryRate: '98.0%', hasBid: false, actualCostPerMsg: 0.00120 },
  { id: '6', name: 'otp_verification', category: 'Authentication', status: 'Approved', sent: 9800, delivered: 9700, deliveryRate: '99.0%', hasBid: false, actualCostPerMsg: 0.00080 },
  { id: '7', name: 'flash_sale_nov', category: 'Marketing', status: 'Rejected', sent: 0, delivered: 0, deliveryRate: '—', hasBid: true, actualCostPerMsg: null },
  { id: '8', name: 'loyalty_reminder', category: 'Marketing', status: 'Approved', sent: 3400, delivered: 0, deliveryRate: '0%', hasBid: false, actualCostPerMsg: null },
]

type SortKey = 'name' | 'sent' | 'deliveryRate' | 'hasBid' | 'actualCostPerMsg'
type SortDir = 'asc' | 'desc'

function formatCost(v: number | null, hasDeliveries: boolean): string {
  if (v === null || !hasDeliveries) return '—'
  return fmtINR(v)
}

export function Reports() {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [filterBillingType, setFilterBillingType] = useState<'all' | 'standard' | 'custom'>('all')
  const [dateRange, setDateRange] = useState('L7D')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = MOCK_DATA.filter(row => {
    if (filterBillingType === 'standard') return !row.hasBid
    if (filterBillingType === 'custom') return row.hasBid
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    let aVal: string | number, bVal: string | number
    switch (sortKey) {
      case 'name': aVal = a.name; bVal = b.name; break
      case 'sent': aVal = a.sent; bVal = b.sent; break
      case 'deliveryRate': aVal = parseFloat(a.deliveryRate) || 0; bVal = parseFloat(b.deliveryRate) || 0; break
      case 'hasBid': aVal = a.hasBid ? 1 : 0; bVal = b.hasBid ? 1 : 0; break
      case 'actualCostPerMsg': aVal = a.actualCostPerMsg ?? -1; bVal = b.actualCostPerMsg ?? -1; break
      default: aVal = a.name; bVal = b.name
    }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown style={{ width: 12, height: 12, opacity: 0.4 }} />
    if (sortDir === 'asc') return <ArrowUp style={{ width: 12, height: 12, color: 'var(--primary)' }} />
    return <ArrowDown style={{ width: 12, height: 12, color: 'var(--primary)' }} />
  }

  function ColHeader({ col, label }: { col: SortKey; label: string }) {
    return (
      <th
        className={cn(
          'px-4 py-3 text-left cursor-pointer hover:bg-muted/60 transition-colors select-none whitespace-nowrap',
          sortKey === col && 'bg-accent'
        )}
        style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--muted-foreground)' }}
        onClick={() => handleSort(col)}
      >
        <div className="flex items-center gap-1">
          {label}
          <SortIcon col={col} />
        </div>
      </th>
    )
  }

  const statusColors: Record<string, string> = {
    Approved: 'success',
    Rejected: 'destructive',
    Pending: 'secondary',
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav
        crumbs={[{ label: 'Analyse' }, { label: 'Reports' }]}
        actions={
          <Button variant="outline" size="sm" className="gap-1">
            <Download style={{ width: 14, height: 14 }} />
            Export
          </Button>
        }
      />

      <div className="flex-1 overflow-auto">
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div style={{ fontSize: '1.125rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Template Performance Report
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                WhatsApp template analytics with billing type and cost data
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)' }}>Filters:</span>
            </div>
            <div className="w-40">
              <Select value={dateRange} onChange={e => setDateRange(e.target.value)}>
                {DATE_INTERVALS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </Select>
            </div>
            <div className="w-44">
              <Select value={filterBillingType} onChange={e => setFilterBillingType(e.target.value as 'all' | 'standard' | 'custom')}>
                <option value="all">All Billing Types</option>
                <option value="standard">Standard only</option>
                <option value="custom">Custom only</option>
              </Select>
            </div>
          </div>

          {/* New columns callout */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent border border-ring/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-foreground)' }}>
              <strong>New:</strong> Billing Type and Actual Cost per Message columns are now available. Scroll right to view.
            </p>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <ColHeader col="name" label="Template Name" />
                    <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--muted-foreground)' }}>Category</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--muted-foreground)' }}>Status</th>
                    <ColHeader col="sent" label="Messages Sent" />
                    <ColHeader col="deliveryRate" label="Delivery Rate" />
                    <ColHeader col="hasBid" label="Billing Type" />
                    <ColHeader col="actualCostPerMsg" label="Actual Cost / Msg" />
                    <th className="px-4 py-3" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--muted-foreground)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, i) => (
                    <tr
                      key={row.id}
                      className={cn(
                        'border-b border-border hover:bg-muted/30 transition-colors',
                        i % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                      )}
                    >
                      <td className="px-4 py-3">
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
                          {row.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                          {row.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusColors[row.status] as 'success' | 'destructive' | 'secondary'}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
                          {row.sent.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
                          {row.deliveryRate}
                        </span>
                      </td>

                      {/* NEW: Billing Type */}
                      <td className="px-4 py-3">
                        {row.hasBid
                          ? (
                            <Badge variant="default">
                              Custom
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Standard
                            </Badge>
                          )
                        }
                      </td>

                      {/* NEW: Actual Cost per Message */}
                      <td className="px-4 py-3">
                        <span style={{
                          fontSize: 'var(--text-sm)',
                          color: row.actualCostPerMsg !== null && row.delivered > 0 ? 'var(--foreground)' : 'var(--muted-foreground)',
                          fontWeight: row.actualCostPerMsg !== null && row.delivered > 0 ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                        }}>
                          {formatCost(row.actualCostPerMsg, row.delivered > 0)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
            Showing {sorted.length} of {MOCK_DATA.length} templates
          </div>
        </div>
      </div>
    </div>
  )
}
