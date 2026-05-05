const USD_TO_INR = 83

interface MultiplierSummaryProps {
  baseBid: number
  multiplier: number
}

export function MultiplierSummary({ baseBid, multiplier }: MultiplierSummaryProps) {
  const effectiveBid = baseBid * multiplier

  const fmt = (usd: number) => `₹${(usd * USD_TO_INR).toFixed(2)}`

  return (
    <div className="rounded-lg border border-border bg-muted px-4 py-3 flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Base bid</span>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
          {fmt(baseBid)} per message
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Multiplier</span>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
          {multiplier.toFixed(1)}×
        </span>
      </div>
      <div className="h-px bg-border my-0.5" />
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
          Effective bid
        </span>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--primary)' }}>
          {fmt(effectiveBid)} per message
        </span>
      </div>
    </div>
  )
}
