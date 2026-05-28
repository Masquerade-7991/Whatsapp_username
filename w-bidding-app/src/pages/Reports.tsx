import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, RefreshCw, Download, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TopNav } from '@/components/layout/TopNav'
import { cn } from '@/lib/utils'
import { fmtINR, maskPhone } from '@/lib/format'

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

// ─── Template Summary ─────────────────────────────────────────────────────────

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

const TEMPLATE_MOCK: TemplateRow[] = [
  { id: '1', date: '2026-01-05', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'jsdfhsvkdhcbowuksdj', category: 'Authentication', status: 'Approved', templateSource: 'Non AI', totalSubmission: 1, totalInProcess: 0, totalDelivered: 0, hasBid: false, actualCostPerMsg: null },
  { id: '2', date: '2026-01-05', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'yogeshtestingauthenticationfifth', category: 'Authentication', status: 'Approved', templateSource: 'Non AI', totalSubmission: 1, totalInProcess: 0, totalDelivered: 1, hasBid: false, actualCostPerMsg: 0.00080 },
  { id: '3', date: '2026-01-05', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'desgcfvghdsvchgdc', category: 'Marketing', status: 'Approved', templateSource: 'Non AI', totalSubmission: 2, totalInProcess: 0, totalDelivered: 0, hasBid: true, actualCostPerMsg: null },
  { id: '4', date: '2026-01-06', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'mp_image_body_buttons_new_2026', category: 'Marketing', status: 'Approved', templateSource: 'Non AI', totalSubmission: 7, totalInProcess: 5, totalDelivered: 0, hasBid: true, actualCostPerMsg: 0.00418 },
  { id: '5', date: '2026-01-06', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'mp_image_body_buttons_new_2026', category: 'Marketing Lite', status: 'Approved', templateSource: 'Non AI', totalSubmission: 2, totalInProcess: 0, totalDelivered: 0, hasBid: false, actualCostPerMsg: null },
  { id: '6', date: '2026-01-08', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'test_auth_4545', category: 'Authentication', status: 'Approved', templateSource: 'Non AI', totalSubmission: 4, totalInProcess: 0, totalDelivered: 0, hasBid: false, actualCostPerMsg: null },
  { id: '7', date: '2026-01-08', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'abhfl_lead_gen', category: 'Marketing', status: 'Approved', templateSource: 'Non AI', totalSubmission: 10, totalInProcess: 0, totalDelivered: 0, hasBid: true, actualCostPerMsg: 0.00391 },
  { id: '8', date: '2026-01-10', username: 'Helo_Staging1', country: 'IN', businessName: 'Test - WABA Account', businessNumber: '15557836045', name: 'order_confirmation', category: 'Utility', status: 'Approved', templateSource: 'Non AI', totalSubmission: 55000, totalInProcess: 1100, totalDelivered: 53900, hasBid: false, actualCostPerMsg: 0.00120 },
]

// ─── Delivery Report ──────────────────────────────────────────────────────────

interface DeliveryRow {
  id: string
  username: string
  country: string
  businessNumber: string
  initialCategory: string
  finalCategory: string
  messageType: string
  mobileNumber: string
  messageContentType: string
  templateName: string
  messageId: string
  journeyTimestamp: string
  userId: string
}

const DELIVERY_MOCK: DeliveryRow[] = [
  { id: '1', username: 'Helo_Staging1', country: 'IN', businessNumber: '15557836045', initialCategory: 'Marketing', finalCategory: 'N/A', messageType: 'OUTGOING', mobileNumber: '919698999634', messageContentType: 'IMAGE', templateName: 'test_automation_temp03', messageId: '66c1500-5448-4548-80c5-7b04a0d4dc5', journeyTimestamp: '2026-05-22 14:43:47', userId: 'IN.13491208655302741918' },
  { id: '2', username: 'Helo_Staging1', country: 'IN', businessNumber: '15557836045', initialCategory: 'Marketing', finalCategory: 'N/A', messageType: 'OUTGOING', mobileNumber: '919698999634', messageContentType: 'IMAGE', templateName: 'd5e0e917-1447-4742-b14b', messageId: 'd5e0e917-1447-4742-b14b-48926146982f', journeyTimestamp: '2026-05-22 13:12:55', userId: 'IN.24582108655302741918' },
  { id: '3', username: 'Helo_Staging1', country: 'IN', businessNumber: '15557836045', initialCategory: 'Service', finalCategory: 'N/A', messageType: 'OUTGOING', mobileNumber: '919698999634', messageContentType: 'TEMPLAT', templateName: 'N/A', messageId: '4603a210-9346-4ac2-b14b-806deca96e74', journeyTimestamp: '2026-05-22 13:12:55', userId: 'IN.35673208755302741918' },
  { id: '4', username: 'Helo_Staging1', country: 'IN', businessNumber: '15557836045', initialCategory: 'Marketing', finalCategory: 'N/A', messageType: 'OUTGOING', mobileNumber: '919698999634', messageContentType: 'TEXT', templateName: '1_automation_temp03', messageId: 'ae77875-993a-4483-9438-6a0b300e149c', journeyTimestamp: '2026-05-22 13:11:47', userId: 'IN.46764308855302741918' },
  { id: '5', username: 'Helo_Staging1', country: 'IN', businessNumber: '15557836045', initialCategory: 'Marketing', finalCategory: 'N/A', messageType: 'OUTGOING', mobileNumber: '919698999634', messageContentType: 'IMAGE', templateName: 'test_automation_temp03', messageId: '1e718ed1-d18-4541-a1af-963300770aafb', journeyTimestamp: '2026-05-22 13:10:44', userId: 'IN.57855408955302741918' },
  { id: '6', username: 'Helo_Staging1', country: 'US', businessNumber: '15557836045', initialCategory: 'Utility', finalCategory: 'N/A', messageType: 'OUTGOING', mobileNumber: '14155551234', messageContentType: 'TEXT', templateName: 'order_confirmation', messageId: 'f9a1234b-5678-9abc-def0-123456789012', journeyTimestamp: '2026-05-21 18:30:00', userId: 'US.68946509055302741918' },
]

// ─── Incoming Message ─────────────────────────────────────────────────────────

interface IncomingRow {
  id: string
  mobileNumber: string
  messageContentType: string
  messageReceivedTimestamp: string
  userId: string
}

const INCOMING_MOCK: IncomingRow[] = [
  { id: '1', mobileNumber: '918433853078', messageContentType: 'text', messageReceivedTimestamp: '2026-05-22 14:43:47', userId: 'IN.98491208655302741918' },
  { id: '2', mobileNumber: '918108653528', messageContentType: 'text', messageReceivedTimestamp: '2026-05-22 12:12:55', userId: 'IN.87382107544291630807' },
  { id: '3', mobileNumber: '918108653528', messageContentType: 'text', messageReceivedTimestamp: '2026-05-22 12:12:49', userId: 'IN.87382107544291630807' },
  { id: '4', mobileNumber: '918108653528', messageContentType: 'text', messageReceivedTimestamp: '2026-05-22 12:12:48', userId: 'IN.87382107544291630807' },
  { id: '5', mobileNumber: '918108653528', messageContentType: 'text', messageReceivedTimestamp: '2026-05-22 12:11:47', userId: 'IN.87382107544291630807' },
  { id: '6', mobileNumber: '918108653528', messageContentType: 'text', messageReceivedTimestamp: '2026-05-22 12:11:46', userId: 'IN.87382107544291630807' },
  { id: '7', mobileNumber: '918108653528', messageContentType: 'text', messageReceivedTimestamp: '2026-05-22 12:11:15', userId: 'IN.87382107544291630807' },
  { id: '8', mobileNumber: '917021344401', messageContentType: 'text', messageReceivedTimestamp: '2026-05-21 22:23:39', userId: 'IN.76271006433180519696' },
]

// ─── Engagement Summary ───────────────────────────────────────────────────────

interface EngagementRow {
  id: string
  username: string
  country: string
  businessWaba: string
  businessNumber: string
  mobileNumber: string
  templateName: string
  messageCategory: string
  templateLanguage: string
  engagementType: string
  userId: string
}

const ENGAGEMENT_MOCK: EngagementRow[] = [
  { id: '1', username: 'Helo_Staging1', country: 'IN', businessWaba: 'Test - WABA Account', businessNumber: '15557836045', mobileNumber: '918433853078', templateName: 'wasdadas', messageCategory: 'Marketing', templateLanguage: 'EN', engagementType: 'cta', userId: 'IN.73491208655302741918' },
  { id: '2', username: 'Helo_Staging1', country: 'IN', businessWaba: 'Test - WABA Account', businessNumber: '15557836045', mobileNumber: '917021344401', templateName: 'test_automation_temp0423', messageCategory: 'Marketing Lite', templateLanguage: 'EN', engagementType: 'cta', userId: 'IN.62382107544191630807' },
  { id: '3', username: 'Helo_Staging1', country: 'IN', businessWaba: 'Test - WABA Account', businessNumber: '15557836045', mobileNumber: '917021344401', templateName: 'N/A', messageCategory: 'Service', templateLanguage: 'N/A', engagementType: 'cta', userId: 'IN.51273006433080519696' },
  { id: '4', username: 'Helo_Staging1', country: 'IN', businessWaba: 'Test - WABA Account', businessNumber: '15557836045', mobileNumber: '917021344401', templateName: 'N/A', messageCategory: 'Service', templateLanguage: 'N/A', engagementType: 'cta', userId: 'IN.40164905321969408585' },
  { id: '5', username: 'Helo_Staging1', country: 'IN', businessWaba: 'Test - WABA Account', businessNumber: '15557836045', mobileNumber: '917021344401', templateName: 'N/A', messageCategory: 'Service', templateLanguage: 'N/A', engagementType: 'cta', userId: 'IN.39055804210858297474' },
  { id: '6', username: 'Helo_Staging1', country: 'IN', businessWaba: 'Test - WABA Account', businessNumber: '15557836045', mobileNumber: '917021344401', templateName: 'N/A', messageCategory: 'Service', templateLanguage: 'N/A', engagementType: 'cta', userId: 'IN.27946703109747186363' },
  { id: '7', username: 'Helo_Staging1', country: 'IN', businessWaba: 'Test - WABA Account', businessNumber: '15557836045', mobileNumber: '917021344401', templateName: 'N/A', messageCategory: 'Service', templateLanguage: 'N/A', engagementType: 'cta', userId: 'IN.16837602098636075252' },
  { id: '8', username: 'Helo_Staging1', country: 'IN', businessWaba: 'Test - WABA Account', businessNumber: '15557836045', mobileNumber: '917021344401', templateName: 'N/A', messageCategory: 'Service', templateLanguage: 'N/A', engagementType: 'cta', userId: 'IN.05728501987524964141' },
]

// ─── Report types ─────────────────────────────────────────────────────────────

type ReportTab = 'template' | 'delivery' | 'incoming' | 'engagement'

const REPORT_TABS: { value: ReportTab; label: string }[] = [
  { value: 'template', label: 'Template Summary' },
  { value: 'delivery', label: 'Delivery Report' },
  { value: 'incoming', label: 'Incoming Message' },
  { value: 'engagement', label: 'Engagement Summary' },
]

// ─── Shared header components ─────────────────────────────────────────────────

type SortDir = 'asc' | 'desc'

function SortIconEl({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown style={{ width: 12, height: 12, opacity: 0.4 }} />
  if (dir === 'asc') return <ArrowUp style={{ width: 12, height: 12, color: 'var(--primary)' }} />
  return <ArrowDown style={{ width: 12, height: 12, color: 'var(--primary)' }} />
}

function UserIdCell({ userId }: { userId: string }) {
  return (
    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>
      {userId}
    </span>
  )
}

// ─── Template Summary sub-view ────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, 'success' | 'destructive' | 'secondary'> = {
  Approved: 'success',
  Rejected: 'destructive',
  Pending: 'secondary',
}

type TemplateSortKey = 'date' | 'name' | 'totalSubmission' | 'totalInProcess' | 'totalDelivered' | 'hasBid' | 'actualCostPerMsg'

function TemplateSummaryView() {
  const [sortKey, setSortKey] = useState<TemplateSortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(key: TemplateSortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...TEMPLATE_MOCK].sort((a, b) => {
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

  function Col({ col, label, right }: { col: TemplateSortKey; label: string; right?: boolean }) {
    return (
      <th
        className={cn('px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors select-none whitespace-nowrap', right && 'text-right')}
        style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: sortKey === col ? 'var(--primary)' : 'var(--foreground)' }}
        onClick={() => handleSort(col)}
      >
        <div className={cn('flex items-center gap-1', right && 'justify-end')}>
          {label}
          <SortIconEl active={sortKey === col} dir={sortDir} />
        </div>
      </th>
    )
  }

  function StaticTh({ label, right }: { label: string; right?: boolean }) {
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
    <>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent border border-ring/30">
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-foreground)' }}>
          <strong>New:</strong> Billing Type and Actual Cost per Message columns are now available. Scroll right to view.
        </p>
      </div>
      <div className="rounded-lg border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <Col col="date" label="Date" />
                <StaticTh label="Username" />
                <StaticTh label="Country" />
                <StaticTh label="Business Name" />
                <StaticTh label="Business Number" />
                <Col col="name" label="Template Name" />
                <StaticTh label="Template Source" />
                <StaticTh label="Message Category" />
                <StaticTh label="Status" />
                <Col col="totalSubmission" label="Total Submission" right />
                <Col col="totalInProcess" label="Total In Process" right />
                <Col col="totalDelivered" label="Total Delivered" right />
                <Col col="hasBid" label="Billing Type" />
                <Col col="actualCostPerMsg" label="Actual Cost / Msg" right />
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
                      <span className="px-3 py-1 rounded-full" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', display: 'inline-block', ...catStyle }}>
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
        Showing {sorted.length} of {TEMPLATE_MOCK.length} templates
      </div>
    </>
  )
}

// ─── Delivery Report sub-view ─────────────────────────────────────────────────

function DeliveryReportView() {
  return (
    <>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent border border-ring/30">
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-foreground)' }}>
          <strong>New:</strong> User ID (BSUID) column added. End-user phone numbers are masked for privacy.
        </p>
      </div>
      <div className="rounded-lg border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                {['Username', 'Country', 'Business Number', 'Initial Category', 'Final Category', 'Message Type', 'Mobile Number', 'Content Type', 'Template Name', 'Message ID', 'Journey Timestamp', 'User ID'].map(h => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap text-left" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {h === 'User ID' ? (
                      <span className="flex items-center gap-1">
                        {h}
                        <span className="px-1.5 py-0.5 rounded-full text-white" style={{ fontSize: '9px', background: 'var(--primary)', fontWeight: 'var(--font-weight-bold)' }}>New</span>
                      </span>
                    ) : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DELIVERY_MOCK.map(row => {
                const catStyle = CATEGORY_COLORS[row.initialCategory] ?? { background: '#6b7280', color: '#fff' }
                return (
                  <tr key={row.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.username}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{FLAG[row.country] ?? ''}</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>{row.country}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.businessNumber}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', display: 'inline-block', ...catStyle }}>
                        {row.initialCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{row.finalCategory}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{row.messageType}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: 'monospace' }}>{maskPhone(row.mobileNumber)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{row.messageContentType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.templateName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>{row.messageId}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{row.journeyTimestamp}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <UserIdCell userId={row.userId} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
        Showing {DELIVERY_MOCK.length} records
      </div>
    </>
  )
}

// ─── Incoming Message sub-view ────────────────────────────────────────────────

function IncomingMessageView() {
  return (
    <>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent border border-ring/30">
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-foreground)' }}>
          <strong>New:</strong> User ID (BSUID) column added. End-user phone numbers are masked for privacy.
        </p>
      </div>
      <div className="rounded-lg border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                {['Mobile Number', 'Message Content Type', 'Message Received Timestamp', 'User ID', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap text-left" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {h === 'User ID' ? (
                      <span className="flex items-center gap-1">
                        {h}
                        <span className="px-1.5 py-0.5 rounded-full text-white" style={{ fontSize: '9px', background: 'var(--primary)', fontWeight: 'var(--font-weight-bold)' }}>New</span>
                      </span>
                    ) : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INCOMING_MOCK.map(row => (
                <tr key={row.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: 'monospace' }}>{maskPhone(row.mobileNumber)}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{row.messageContentType}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{row.messageReceivedTimestamp}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <UserIdCell userId={row.userId} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}
                      title="View"
                    >
                      <Eye style={{ width: 16, height: 16 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
        Showing {INCOMING_MOCK.length} records
      </div>
    </>
  )
}

// ─── Engagement Summary sub-view ──────────────────────────────────────────────

function EngagementSummaryView() {
  return (
    <>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent border border-ring/30">
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-foreground)' }}>
          <strong>New:</strong> User ID (BSUID) column added. End-user phone numbers are masked for privacy.
        </p>
      </div>
      <div className="rounded-lg border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                {['Username', 'Country', 'Business WABA', 'Business Number', 'Mobile Number', 'Template Name', 'Message Category', 'Template Language', 'Engagement Type', 'User ID'].map(h => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap text-left" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    {h === 'User ID' ? (
                      <span className="flex items-center gap-1">
                        {h}
                        <span className="px-1.5 py-0.5 rounded-full text-white" style={{ fontSize: '9px', background: 'var(--primary)', fontWeight: 'var(--font-weight-bold)' }}>New</span>
                      </span>
                    ) : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENGAGEMENT_MOCK.map(row => {
                const catStyle = CATEGORY_COLORS[row.messageCategory] ?? { background: '#6b7280', color: '#fff' }
                return (
                  <tr key={row.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.username}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{FLAG[row.country] ?? ''}</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>{row.country}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.businessWaba}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.businessNumber}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: 'monospace' }}>{maskPhone(row.mobileNumber)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.templateName}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', display: 'inline-block', ...catStyle }}>
                        {row.messageCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{row.templateLanguage}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{row.engagementType}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <UserIdCell userId={row.userId} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
        Showing {ENGAGEMENT_MOCK.length} records
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('template')
  const [dateRangeIdx, setDateRangeIdx] = useState(4)

  const reportTitle = REPORT_TABS.find(t => t.value === activeTab)?.label ?? 'Reports'

  return (
    <div className="flex flex-col h-full">
      <TopNav crumbs={[{ label: 'Analyse' }, { label: 'Reports' }]} />

      <div className="flex-1 overflow-auto">
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <div style={{ fontSize: '1.25rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
              {reportTitle}
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

          {/* Report type tab strip */}
          <div className="flex items-center gap-1 border-b border-border">
            {REPORT_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="px-4 py-2.5 transition-colors whitespace-nowrap"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: activeTab === tab.value ? 'var(--font-weight-semi-bold)' : 'var(--font-weight-normal)',
                  color: activeTab === tab.value ? 'var(--primary)' : 'var(--muted-foreground)',
                  borderBottom: activeTab === tab.value ? '2px solid var(--primary)' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'template' && <TemplateSummaryView />}
          {activeTab === 'delivery' && <DeliveryReportView />}
          {activeTab === 'incoming' && <IncomingMessageView />}
          {activeTab === 'engagement' && <EngagementSummaryView />}

        </div>
      </div>
    </div>
  )
}
