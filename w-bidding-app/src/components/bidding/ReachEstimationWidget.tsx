import { useState, useRef } from 'react'
import { Info, AlertCircle } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { useFeature } from '@/context/FeatureContext'
import { DATE_INTERVALS } from '@/lib/constants'
import { fmtINR } from '@/lib/format'


const MOCK_RESULTS: Record<string, { deliveryRate: number; costPerMessage: number }> = {
  'IN-L7D': { deliveryRate: 72, costPerMessage: 0.0041 },
  'IN-L1D': { deliveryRate: 68, costPerMessage: 0.0039 },
  'IN-L14D': { deliveryRate: 75, costPerMessage: 0.0043 },
  'IN-L28D': { deliveryRate: 71, costPerMessage: 0.0040 },
  'BR-L7D': { deliveryRate: 65, costPerMessage: 0.0052 },
  'US-L7D': { deliveryRate: 58, costPerMessage: 0.0078 },
  'DE-L7D': { deliveryRate: 61, costPerMessage: 0.0065 },
}

type DisplayState = 'idle' | 'loading' | 'success' | 'no-history' | 'error'

export function ReachEstimationWidget() {
  const { reachEstimateState: forcedState } = useFeature()
  const country = 'IN'
  const [interval, setInterval] = useState('L7D')
  const [displayState, setDisplayState] = useState<DisplayState>('idle')
  const [result, setResult] = useState<{ deliveryRate: number; costPerMessage: number } | null>(null)
  const [stale, setStale] = useState(false)
  const [fetchedInterval, setFetchedInterval] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleCheckMetrics() {
    setDisplayState('loading')
    setStale(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDisplayState(forcedState)
      const key = `${country}-${interval}`
      setResult(MOCK_RESULTS[key] || null)
      setFetchedInterval(interval)
    }, 600)
  }

  function handleIntervalChange(v: string) {
    setInterval(v)
    if (displayState === 'success' && v !== fetchedInterval) {
      setStale(true)
    }
  }

  const canCheck = displayState !== 'loading' && (displayState !== 'success' || stale)

  return (
    <div className="flex flex-col gap-2">
      {/* Section heading with tooltip */}
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 cursor-default select-none w-fit">
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                  Preview Estimated Reach
                </span>
                <Info style={{ width: 13, height: 13, color: 'var(--muted-foreground)' }} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              Data presented is the historical performance of the main WABA ID
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Block */}
      <div className="rounded-lg border border-border px-4 py-4 flex flex-col gap-4 bg-background">
        {/* Selectors + button in one row */}
        <div className="flex items-end gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)' }}>
              Geography
            </label>
            <Select
              value="IN"
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }}
            >
              <option value="IN">India (IN)</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)' }}>
              Time range
            </label>
            <Select value={interval} onChange={e => handleIntervalChange(e.target.value)}>
              {DATE_INTERVALS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </Select>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleCheckMetrics}
            disabled={!canCheck}
            className="shrink-0"
            style={canCheck ? { background: 'var(--primary)', color: 'var(--primary-foreground)' } : {}}
          >
            Check Metrics
          </Button>
        </div>

        {/* Stale warning */}
        {stale && displayState === 'success' && (
          <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
            <AlertCircle style={{ width: 13, height: 13, color: '#d97706', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-xs)', color: '#92400e' }}>
              Time range has been changed. Click <strong>Check Metrics</strong> to get updated data.
            </span>
          </div>
        )}

        {/* Result area */}
        {displayState === 'loading' && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}

        {displayState === 'success' && result && (
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', paddingBottom: 6, paddingRight: 8, color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }}>
                    Est. delivery
                  </th>
                  <th style={{ textAlign: 'right', paddingBottom: 6, paddingRight: 8, color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }}>
                    Average cost
                  </th>
                  <th style={{ textAlign: 'right', paddingBottom: 6, color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }}>
                    Cost range
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ opacity: stale ? 0.45 : 1 }}>
                  <td style={{ padding: '8px 8px 8px 0', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                    ~{result.deliveryRate}%
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px 8px 8px 0', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }}>
                    {fmtINR(result.costPerMessage)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px 0', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
                    {fmtINR(result.costPerMessage * 0.88)}–{fmtINR(result.costPerMessage * 1.12)}
                  </td>
                </tr>
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
          </div>
        )}

        {displayState === 'error' && (
          <div
            className="rounded-lg border border-border bg-muted px-3 py-3"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}
          >
            Estimates unavailable for this configuration.
          </div>
        )}
      </div>
    </div>
  )
}
