import type { ReactNode } from 'react'
import { HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MultiplierSlider } from './MultiplierSlider'
import { MultiplierSummary } from './MultiplierSummary'

interface MultiplierCardProps {
  baseBid: number
  multiplier: number
  onChange: (v: number) => void
  helpText?: string
  children?: ReactNode
}

const DEFAULT_HELP_TEXT = 'Adjusts the base bid. 1.0× applies the base bid with no change.'

export function MultiplierCard({ baseBid, multiplier, onChange, helpText = DEFAULT_HELP_TEXT, children }: MultiplierCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-ring/30 bg-accent/30 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
            Max-Price Multiplier
          </span>
          <button
            title={helpText}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <HelpCircle style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
          </button>
        </div>
        <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
          Tentative
        </Badge>
      </div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
        {helpText}
      </p>
      <MultiplierSlider value={multiplier} onChange={onChange} />
      <MultiplierSummary baseBid={baseBid} multiplier={multiplier} />
      {children}
    </div>
  )
}
