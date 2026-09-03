import { useState } from 'react'
import { Info } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { BidAmountInput } from './BidAmountInput'
import { MultiplierCard } from './MultiplierCard'

const TOOLTIP_TEXT = 'Helps in setting a custom message cost. Bid a higher value to improve engagement or bid lower to reach out to a wider audience.'

export function BiddingToggle() {
  const [enabled, setEnabled] = useState(false)
  const [bidAmount, setBidAmount] = useState<number | ''>(1.0)
  const [bidWasSet, setBidWasSet] = useState(false)
  const [multiplier, setMultiplier] = useState(1.0)

  function handleToggle(v: boolean) {
    setEnabled(v)
    if (v && bidAmount !== '' && Number(bidAmount) > 0) setBidWasSet(true)
  }

  function handleBidChange(v: number | '') {
    setBidAmount(v)
    if (v !== '' && Number(v) > 0) setBidWasSet(true)
  }

  return (
    <div className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden">
      {/* Single consolidated header row */}
      <div className="flex items-center gap-2 px-4 py-3 bg-background">
        {/* Label */}
        <span style={{ fontWeight: 'var(--font-weight-semi-bold)', fontSize: 'var(--text-sm)', color: 'var(--foreground)', flexShrink: 0 }}>
          Set a custom price
        </span>

        {/* Beta badge */}
        <span
          className="px-2 py-0.5 rounded border border-primary/30 bg-accent"
          style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--primary)', flexShrink: 0 }}
        >
          Beta
        </span>

        {/* Info tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span style={{ display: 'flex', alignItems: 'center', cursor: 'default', flexShrink: 0 }}>
                <Info style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" style={{ maxWidth: 240 }}>
              {TOOLTIP_TEXT}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Toggle */}
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>

      {/* Expanded content */}
      <div className="collapsible-content" data-state={enabled ? 'open' : 'closed'}>
        <div className="border-t border-border px-4 py-4 flex flex-col gap-4 bg-background">
          <BidAmountInput value={bidAmount} onChange={handleBidChange} />

          {typeof bidAmount === 'number' && bidAmount > 0 && (
            <MultiplierCard
              baseBid={bidAmount}
              multiplier={multiplier}
              onChange={setMultiplier}
              helpText="Adjusts your template's base bid. 1.0× applies the base bid with no change."
            />
          )}

          {bidWasSet && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
              To use standard rates, create the template without setting a custom price.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
