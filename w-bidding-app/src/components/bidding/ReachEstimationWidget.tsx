import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useFeature } from '@/context/FeatureContext'
import { USD_TO_INR, DATE_INTERVALS } from '@/lib/constants'
import { fmtINR } from '@/lib/format'

const COUNTRIES = [
  { code: 'IN', label: 'India (IN)' },
  { code: 'BR', label: 'Brazil (BR)' },
  { code: 'ID', label: 'Indonesia (ID)' },
  { code: 'MX', label: 'Mexico (MX)' },
  { code: 'PH', label: 'Philippines (PH)' },
  { code: 'US', label: 'United States (US)' },
  { code: 'DE', label: 'Germany (DE)' },
  { code: 'GB', label: 'United Kingdom (GB)' },
  { code: 'JP', label: 'Japan (JP)' },
  { code: 'NG', label: 'Nigeria (NG)' },
]


const MOCK_RESULTS: Record<string, { deliveryRate: number; costPerMessage: number }> = {
  'IN-L7D': { deliveryRate: 72, costPerMessage: 0.0041 },
  'IN-L1D': { deliveryRate: 68, costPerMessage: 0.0039 },
  'IN-L14D': { deliveryRate: 75, costPerMessage: 0.0043 },
  'IN-L28D': { deliveryRate: 71, costPerMessage: 0.0040 },
  'BR-L7D': { deliveryRate: 65, costPerMessage: 0.0052 },
  'US-L7D': { deliveryRate: 58, costPerMessage: 0.0078 },
  'DE-L7D': { deliveryRate: 61, costPerMessage: 0.0065 },
}

interface DeliveryRow {
  strategy: string
  deliveryRate: number
  cost: number
  pctChange: number
  costLow: number
  costHigh: number
}

function computeDeliveryRows(base: { deliveryRate: number; costPerMessage: number }): DeliveryRow[] {
  const { deliveryRate, costPerMessage } = base
  return [
    {
      strategy: 'Accelerated',
      deliveryRate: Math.min(Math.round(deliveryRate * 1.11), 95),
      cost: costPerMessage * 1.25,
      pctChange: 25,
      costLow: costPerMessage * 1.25 * 0.88,
      costHigh: costPerMessage * 1.25 * 1.12,
    },
    {
      strategy: 'Standard',
      deliveryRate,
      cost: costPerMessage,
      pctChange: 0,
      costLow: costPerMessage * 0.88,
      costHigh: costPerMessage * 1.12,
    },
    {
      strategy: 'Conservative',
      deliveryRate: Math.max(Math.round(deliveryRate * 0.91), 10),
      cost: costPerMessage * 0.90,
      pctChange: -10,
      costLow: costPerMessage * 0.90 * 0.88,
      costHigh: costPerMessage * 0.90 * 1.12,
    },
  ]
}

interface ReachEstimationWidgetProps {
  bidAmount?: number
}

export function ReachEstimationWidget({ bidAmount: _bidAmount }: ReachEstimationWidgetProps) {
  const { reachEstimateState: forcedState } = useFeature()
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState('IN')
  const [interval, setInterval] = useState('L7D')
  const [displayState, setDisplayState] = useState<'idle' | 'loading' | 'success' | 'no-history' | 'error'>('idle')
  const [result, setResult] = useState<{ deliveryRate: number; costPerMessage: number } | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) return

    setDisplayState('loading')
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      setDisplayState(forcedState)
      const key = `${country}-${interval}`
      setResult(MOCK_RESULTS[key] || null)
    }, 400)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [country, interval, open, forcedState])

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted hover:bg-accent transition-colors"
        style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}
      >
        <span className="flex items-center gap-2">
          <Info style={{ width: 14, height: 14, color: 'var(--primary)' }} />
          Preview estimated reach
        </span>
        {open
          ? <ChevronUp style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
          : <ChevronDown style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
        }
      </button>

      <div
        className={cn('collapsible-content')}
        data-state={open ? 'open' : 'closed'}
      >
        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                Country
              </label>
              <Select value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                Date interval
              </label>
              <Select value={interval} onChange={e => setInterval(e.target.value)}>
                {DATE_INTERVALS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* Result area */}
          <div>
            {displayState === 'loading' && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
            )}

            {displayState === 'success' && result && (
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', paddingBottom: 6, paddingRight: 8, color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }}>
                        Strategy
                      </th>
                      <th style={{ textAlign: 'right', paddingBottom: 6, paddingRight: 8, color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }}>
                        Cost / msg
                      </th>
                      <th style={{ textAlign: 'right', paddingBottom: 6, paddingRight: 8, color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }}>
                        vs Rate
                      </th>
                      <th style={{ textAlign: 'right', paddingBottom: 6, color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }}>
                        Cost Range
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {computeDeliveryRows(result).map((row, i) => (
                      <tr
                        key={row.strategy}
                        style={{
                          borderBottom: i < 2 ? '1px solid var(--border)' : undefined,
                          background: row.pctChange === 0 ? 'var(--accent)' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '8px 8px 8px 0' }}>
                          <div style={{
                            color: 'var(--foreground)',
                            fontWeight: row.pctChange === 0 ? 'var(--font-weight-semi-bold)' : 'var(--font-weight-medium)',
                          }}>
                            {row.strategy}
                          </div>
                          <div style={{ color: 'var(--muted-foreground)', marginTop: 2 }}>
                            ~{row.deliveryRate}% est. delivery
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', padding: '8px 8px 8px 0', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }}>
                          {fmtINR(row.cost)}
                        </td>
                        <td style={{ textAlign: 'right', padding: '8px 8px 8px 0', whiteSpace: 'nowrap' }}>
                          <span style={{
                            color: row.pctChange > 0 ? '#16a34a' : row.pctChange < 0 ? '#dc2626' : 'var(--muted-foreground)',
                            fontWeight: 'var(--font-weight-medium)',
                          }}>
                            {row.pctChange === 0 ? '—' : row.pctChange > 0 ? `+${row.pctChange}%` : `${row.pctChange}%`}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', padding: '8px 0', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
                          ₹{(row.costLow * USD_TO_INR).toFixed(2)}–{(row.costHigh * USD_TO_INR).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {displayState === 'no-history' && (
              <div
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3"
                style={{ fontSize: 'var(--text-sm)', color: '#92400e' }}
              >
                Estimates will be available once your account has sent messages to this market.
                Send your first campaign to unlock reach data.
              </div>
            )}

            {displayState === 'error' && (
              <div
                className="rounded-lg border border-border bg-muted px-3 py-3"
                style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}
              >
                Estimates unavailable for this configuration
              </div>
            )}

            {displayState === 'idle' && null}
          </div>

          {/* Disclaimer */}
          {(displayState === 'success' || displayState === 'loading') && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }} className="flex items-start gap-1">
              <Info style={{ width: 12, height: 12, marginTop: 2, flexShrink: 0 }} />
              Estimates are based on historical data and do not guarantee future performance.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
