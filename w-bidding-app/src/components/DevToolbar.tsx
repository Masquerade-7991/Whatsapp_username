import { useState } from 'react'
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useFeature } from '@/context/FeatureContext'

type EstimateState = 'loading' | 'success' | 'no-history' | 'error'

const STATES: { value: EstimateState; label: string }[] = [
  { value: 'success', label: 'Success' },
  { value: 'loading', label: 'Loading' },
  { value: 'no-history', label: 'No History' },
  { value: 'error', label: 'Error' },
]

export function DevToolbar() {
  const [open, setOpen] = useState(true)
  const { metaEnabled, setMetaEnabled, reachEstimateState, setReachEstimateState, whatsappUsernamesEnabled, setWhatsappUsernamesEnabled } = useFeature()

  return (
    <div
      className="fixed bottom-4 right-4 z-50 rounded-xl border border-border bg-card shadow-lg overflow-hidden"
      style={{ width: '220px' }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-muted hover:bg-accent transition-colors border-b border-border"
        style={{ cursor: 'pointer' }}
      >
        <div className="flex items-center gap-1.5">
          <Settings2 style={{ width: 14, height: 14, color: 'var(--primary)' }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
            Prototype Controls
          </span>
        </div>
        {open
          ? <ChevronDown style={{ width: 12, height: 12, color: 'var(--muted-foreground)' }} />
          : <ChevronUp style={{ width: 12, height: 12, color: 'var(--muted-foreground)' }} />
        }
      </button>

      {open && (
        <div className="px-3 py-3 flex flex-col gap-3">
          {/* WABA Feature Flag */}
          <div className="flex flex-col gap-1.5">
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
              WABA Feature Flag
            </p>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                {metaEnabled ? '✓ Meta-enabled (bidding UI shown)' : '✗ Disabled (bidding UI hidden)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={metaEnabled}
                onCheckedChange={setMetaEnabled}
              />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                {metaEnabled ? 'On' : 'Off'}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Reach Estimate State */}
          <div className="flex flex-col gap-1.5">
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
              Reach Estimate State
            </p>
            <div className="grid grid-cols-2 gap-1">
              {STATES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setReachEstimateState(s.value)}
                  className="px-2 py-1 rounded border transition-colors text-center"
                  style={{
                    fontSize: '10px',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    background: reachEstimateState === s.value ? 'var(--primary)' : 'var(--background)',
                    color: reachEstimateState === s.value ? 'var(--primary-foreground)' : 'var(--foreground)',
                    borderColor: reachEstimateState === s.value ? 'var(--primary)' : 'var(--border)',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* WA Usernames Feature Flag */}
          <div className="flex flex-col gap-1.5">
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
              WA Usernames Flag
            </p>
            <div className="flex items-center gap-2">
              <Switch
                checked={whatsappUsernamesEnabled}
                onCheckedChange={setWhatsappUsernamesEnabled}
              />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                {whatsappUsernamesEnabled ? 'On (username field visible)' : 'Off'}
              </span>
            </div>
          </div>

          <div className="h-px bg-border" />
          <p style={{ fontSize: '10px', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>
            Toggle WABA flag to show/hide bidding UI. Cycle reach states to test all 4 widget states.
          </p>
        </div>
      )}
    </div>
  )
}
