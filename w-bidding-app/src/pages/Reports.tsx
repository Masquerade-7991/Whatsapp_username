import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, RefreshCw, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TopNav } from '@/components/layout/TopNav'
import { cn } from '@/lib/utils'
import { fmtINR } from '@/lib/format'

const FLAG: Record<string, string> = {
  IN: '🇮🇳', US: '🇺🇸', BR: '🇧🇷', DE: '🇩🇪', GB: '🇬🇧',
  ID: '🇮🇩', MX: '🇲🇽', PH: '🇵🇭', JP: '🇯🇵', NG: '🇳🇬',
}

const DATE_OPTS = [
  { value: 'L1D', label: '1 day' },
  { value: 'L7D', label: '7 days' },
  { value: 'L14D', label: '14 days' },
  { value: 'L28D', label: '28 days' },
  { value: 'L90D', label: '90 days' },
]

const CATEGORY_COLORS: Record<string, { background: string; color: string }> = {
  Authentication: { background: '#ec4899', color: '#fff' },
  Marketing: { background: '#22c55e', color: '#fff' },
  'Marketing Lite': { background: '#9ca3af', color: '#fff' },
  Utility: { background: '#3b82f6', color: '#fff' },
  Service: { background: '#8b5cf6', color: '#fff' },
}

interface TemplateRow {
  id: string
  date: string
  username: string
  country: string
  businessName: string
  businessNumber: string
  name: string
  category: string
  status: 'Approved' | 'Rejected' | 'Pending'
  templateSource: 'AI' | 'Non AI'
  totalSubmission: number
  totalInProcess: number
  totalDelivered: number
  hasBid: boolean
  actualCostPerMsg: number | null
}

const MOCK_DATA: TemplateRow[] = [
  { id: '1', date: '2026-01-05', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'jsdfhsvkdhcbowuksdj', category: 'Authentication', status: 'Approved', templateSource: 'Non AI', totalSubmission: 1, totalInProcess: 0, totalDelivered: 0, hasBid: false, actualCostPerMsg: null },
  { id: '2', date: '2026-01-05', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'yogeshtestingauthenticationfifth', category: 'Authentication', status: 'Approved', templateSource: 'Non AI', totalSubmission: 1, totalInProcess: 0, totalDelivered: 1, hasBid: false, actualCostPerMsg: 0.00080 },
  { id: '3', date: '2026-01-05', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'desgcfvghdsvchgdc', category: 'Marketing', status: 'Approved', templateSource: 'Non AI', totalSubmission: 2, totalInProcess: 0, totalDelivered: 0, hasBid: true, actualCostPerMsg: null },
  { id: '4', date: '2026-01-06', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'mp_image_body_buttons_new_2026', category: 'Marketing', status: 'Approved', templateSource: 'Non AI', totalSubmission: 7, totalInProcess: 5, totalDelivered: 0, hasBid: true, actualCostPerMsg: 0.00418 },
  { id: '5', date: '2026-01-06', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'mp_image_body_buttons_new_2026', category: 'Marketing Lite', status: 'Approved', templateSource: 'Non AI', totalSubmission: 2, totalInProcess: 0, totalDelivered: 0, hasBid: false, actualCostPerMsg: null },
  { id: '6', date: '2026-01-08', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'test_auth_4545', category: 'Authentication', status: 'Approved', templateSource: 'Non AI', totalSubmission: 4, totalInProcess: 0, totalDelivered: 0, hasBid: false, actualCostPerMsg: null },
  { id: '7', date: '2026-01-08', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'abhfl_lead_gen', category: 'Marketing', status: 'Approved', templateSource: 'Non AI', totalSubmission: 10, totalInProcess: 0, totalDelivered: 0, hasBid: true, actualCostPerMsg: 0.00391 },
  { id: '8', date: '2026-01-10', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'order_confirmation', category: 'Utility', status: 'Approved', templateSource: 'Non AI', totalSubmission: 55000, totalInProcess: 1100, totalDelivered: 53900, hasBid: false, actualCostPerMsg: 0.00120 },
]

type SortKey = 'date' | 'name' | 'totalSubmission' | 'totalInProcess' | 'totalDelivered' | 'hasBid' | 'actualCostPerMsg'
type SortDir = 'asc' | 'desc'

const STATUS_VARIANT: Record<string, 'success' | 'destructive' | 'secondary'> = {
  Approved: 'success',
  Rejected: 'destructive',
  Pending: 'secondary',
}

export function Reports() {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [dateRangeIdx, setDateRangeIdx] = useState(4) // starts at 90 days

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...MOCK_DATA].sort((a, b) => {
    let aVal: string | number, bVal: string | number
    switch (sortKey) {
      case 'date': aVal = a.date; bVal = b.date; break
      case 'name': aVal = a.name; bVal = b.name; break
      case 'totalSubmission': aVal = a.totalSubmission; bVal = b.totalSubmission; break
      case 'totalInProcess': aVal = a.totalInProcess; bVal = b.totalInProcess; break
      case 'totalDelivered': aVal = a.totalDelivered; bVal = b.totalDelivered; break
      case 'hasBid': aVal = a.hasBid ? 1 : 0; bVal = b.hasBid ? 1 : 0; break
      case 'actualCostPerMsg': aVal = a.actualCostPerMsg ?? -1; bVal = b.actualCostPerMsg ?? -1; break
      default: aVal = a.date; bVal = b.date
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

  function ColHeader({ col, label, right }: { col: SortKey; label: string; right?: boolean }) {
    return (
      <th
        className={cn('px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors select-none whitespace-nowrap', right && 'text-right')}
        style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: sortKey === col ? 'var(--primary)' : 'var(--foreground)' }}
        onClick={() => handleSort(col)}
      >
        <div className={cn('flex items-center gap-1', right && 'justify-end')}>
          {label}
          <SortIcon col={col} />
        </div>
      </th>
    )
  }

  function StaticHeader({ label, right }: { label: string; right?: boolean }) {
    return (
      <th
        className={cn('px-4 py-3 whitespace-nowrap', right && 'text-right')}
        style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}
      >
        {label}
      </th>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav crumbs={[{ label: 'Analyse' }, { label: 'Reports' }]} />

      <div className="flex-1 overflow-auto">
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <div style={{ fontSize: '1.25rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
              Template Summary
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDateRangeIdx(i => (i + 1) % DATE_OPTS.length)}
                className="px-4 py-1.5 rounded-full border border-border bg-muted/60 hover:bg-muted transition-colors"
                style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)', cursor: 'pointer' }}
              >
                {DATE_OPTS[dateRangeIdx].label}
              </button>
              <Button size="sm" className="gap-1.5 rounded-full px-4">
                <ChevronLeft style={{ width: 14, height: 14 }} />
                Filter
              </Button>
              <Button size="icon" className="rounded w-8 h-8">
                <RefreshCw style={{ width: 14, height: 14 }} />
              </Button>
              <Button size="icon" className="rounded w-8 h-8">
                <Download style={{ width: 14, height: 14 }} />
              </Button>
            </div>
          </div>

          {/* Custom columns callout */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent border border-ring/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-foreground)' }}>
              <strong>New:</strong> Billing Type and Actual Cost per Message columns are now available. Scroll right to view.
            </p>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden bg-background">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <ColHeader col="date" label="Date" />
                    <StaticHeader label="Username" />
                    <StaticHeader label="Country" />
                    <StaticHeader label="Business Name" />
                    <StaticHeader label="Business Number" />
                    <ColHeader col="name" label="Template Name" />
                    <StaticHeader label="Template Source" />
                    <StaticHeader label="Message Category" />
                    <StaticHeader label="Status" />
                    <ColHeader col="totalSubmission" label="Total Submission" right />
                    <ColHeader col="totalInProcess" label="Total In Process" right />
                    <ColHeader col="totalDelivered" label="Total Delivered" right />
                    <ColHeader col="hasBid" label="Billing Type" />
                    <ColHeader col="actualCostPerMsg" label="Actual Cost / Msg" right />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(row => {
                    const catStyle = CATEGORY_COLORS[row.category] ?? { background: '#6b7280', color: '#fff' }
                    return (
                      <tr key={row.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.date}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.username}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>{FLAG[row.country] ?? ''}</span>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>{row.country}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.businessName}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.businessNumber}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.name}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{row.templateSource}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className="px-3 py-1 rounded-full"
                            style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', display: 'inline-block', ...catStyle }}
                          >
                            {row.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.totalSubmission.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.totalInProcess.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.totalDelivered.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {row.hasBid ? <Badge variant="default">Custom</Badge> : <Badge variant="outline">Standard</Badge>}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <span style={{
                            fontSize: 'var(--text-sm)',
                            color: row.actualCostPerMsg !== null && row.totalDelivered > 0 ? 'var(--foreground)' : 'var(--muted-foreground)',
                            fontWeight: row.actualCostPerMsg !== null && row.totalDelivered > 0 ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                          }}>
                            {row.actualCostPerMsg !== null && row.totalDelivered > 0 ? fmtINR(row.actualCostPerMsg) : '—'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
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
