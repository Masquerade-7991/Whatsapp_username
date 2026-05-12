import { useRef } from 'react'
import { cn } from '@/lib/utils'

const TICKS = [1.0, 1.5, 2.0, 2.5, 3.0]

interface MultiplierSliderProps {
  value: number
  onChange: (v: number) => void
  className?: string
}

export function MultiplierSlider({ value, onChange, className }: MultiplierSliderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseFloat(e.target.value)
    const snapped = Math.round(raw * 10) / 10
    onChange(snapped)
  }

  const percent = ((value - 1.0) / (3.0 - 1.0)) * 100

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Track + thumb */}
      <div className="relative pt-1">
        <div
          className="h-1 rounded-full absolute top-[calc(0.25rem+2px)]"
          style={{
            left: 0,
            width: `${percent}%`,
            background: 'var(--primary)',
          }}
        />
        <input
          ref={inputRef}
          type="range"
          min={1.0}
          max={3.0}
          step={0.1}
          value={value}
          onChange={handleChange}
          className="w-full relative z-10"
          style={{
            background: `linear-gradient(to right, var(--primary) ${percent}%, var(--border) ${percent}%)`
          }}
        />
      </div>

      {/* Tick labels */}
      <div className="flex justify-between" style={{ marginTop: '-4px' }}>
        {TICKS.map(tick => (
          <span
            key={tick}
            className={cn(
              'cursor-pointer select-none transition-colors',
              Math.abs(value - tick) < 0.05
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: Math.abs(value - tick) < 0.05 ? 'var(--font-weight-semi-bold)' : 'var(--font-weight-normal)',
            }}
            onClick={() => onChange(tick)}
          >
            {tick.toFixed(1)}×
          </span>
        ))}
      </div>
    </div>
  )
}
