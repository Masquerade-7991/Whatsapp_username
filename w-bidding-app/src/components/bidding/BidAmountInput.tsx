import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'
import { BID_MIN, BID_MAX } from '@/lib/constants'

interface BidAmountInputProps {
  value: number | ''
  onChange: (v: number | '') => void
}

export function BidAmountInput({ value, onChange }: BidAmountInputProps) {
  const [touched, setTouched] = useState(false)

  const numericValue = typeof value === 'number' ? value : NaN
  const per1000 = !isNaN(numericValue) && numericValue >= BID_MIN ? numericValue * 1000 : null
  const hasError = touched && (value === '' || (typeof value === 'number' && (value < BID_MIN || value > BID_MAX)))

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '') { onChange(''); return }
    const parsed = parseFloat(parseFloat(raw).toFixed(2))
    if (!isNaN(parsed)) onChange(parsed)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
          Cost per message
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-[200px]">
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
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
            Cost per 1,000:
          </span>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
            ₹{per1000.toFixed(2)} INR
          </span>
        </div>
      )}
    </div>
  )
}
