import { useState } from 'react'
import { ChevronLeft, Info, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { WhatsAppPhoneMockup } from '@/components/layout/WhatsAppPhoneMockup'
import { cn } from '@/lib/utils'

// BSUID = <ISO country code>.<19-digit numerical value>, e.g. IN.1234567890123456789
const BSUID_RE = /^[A-Z]{2,3}\.\d{19}$/
const PHONE_RE = /^\+?\d{7,15}$/

const MOCK_TEST_NUMBERS = ['+919876543210', '+14155550132', '+447911123456', '+61491570156']

const MOCK_TEST_BSUIDS = [
  'IN.1234567890123456789',
  'IN.9876543210987654321',
  'US.1112223334445556667',
  'GB.7778889990001112223',
]

type EntryKind = 'phone' | 'bsuid' | 'invalid'

function classify(raw: string): EntryKind {
  const v = raw.trim().toUpperCase()
  if (!v) return 'invalid'
  if (BSUID_RE.test(v)) return 'bsuid'
  if (PHONE_RE.test(raw.trim())) return 'phone'
  return 'invalid'
}

interface CampaignTestProps {
  templateBody?: string
  templateFooter?: string
  onBack: () => void
}

export function CampaignTest({ templateBody, templateFooter, onBack }: CampaignTestProps) {
  const [mode, setMode] = useState<'manual' | 'choose'>('manual')
  const [manualDraft, setManualDraft] = useState('')
  const [manualChips, setManualChips] = useState<string[]>([])
  const [manualError, setManualError] = useState<string | null>(null)
  const [chooseTab, setChooseTab] = useState<'numbers' | 'userid'>('numbers')
  const [chosenNumbers, setChosenNumbers] = useState<string[]>([])
  const [chosenBsuids, setChosenBsuids] = useState<string[]>([])
  const [variablesMode, setVariablesMode] = useState<'manual' | 'fetch'>('manual')
  const [varValue, setVarValue] = useState('')
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [testSent, setTestSent] = useState(false)

  const chosenTotal = chosenNumbers.length + chosenBsuids.length
  const recipients = mode === 'manual' ? manualChips : [...chosenNumbers, ...chosenBsuids]

  const bsuidOnly = recipients.length > 0 && recipients.every(r => BSUID_RE.test(r.toUpperCase()))
  const overLimit = recipients.length > 10

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    if (list.includes(id)) setList(list.filter(x => x !== id))
    else if (chosenTotal < 10) setList([...list, id])
  }

  function commitManualDraft() {
    const value = manualDraft.trim()
    if (!value) return
    if (manualChips.length >= 10) {
      setManualError('You can add up to 10 numbers only.')
      return
    }
    if (classify(value) === 'invalid') {
      setManualError("That's not a valid phone number or BSUID.")
      return
    }
    if (manualChips.includes(value)) {
      setManualError('Already added.')
      return
    }
    setManualChips(prev => [...prev, value])
    setManualDraft('')
    setManualError(null)
  }

  function handleManualKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitManualDraft()
    } else if (e.key === 'Backspace' && manualDraft === '' && manualChips.length > 0) {
      setManualChips(prev => prev.slice(0, -1))
    }
  }

  function removeManualChip(value: string) {
    setManualChips(prev => prev.filter(v => v !== value))
  }

  function handleTest() {
    if (recipients.length === 0 || overLimit) return
    setTestSent(true)
  }

  return (
    <>
      {/* Left rail */}
      <div className="w-56 shrink-0 rounded-lg border border-border bg-background sticky top-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
            Stepwise Configuration
          </span>
        </div>
        <div className="px-4 py-2.5 flex items-center gap-2.5 bg-primary/10">
          <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: 'var(--primary)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />
          </div>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--primary)' }}>
            Test Campaign
          </span>
        </div>
      </div>

      {/* Center form */}
      <div className="flex-1 min-w-0 rounded-lg border border-border bg-background overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
            Test Your Campaign
          </span>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6">
          {/* Test Users */}
          <div className="flex flex-col gap-3">
            <div>
              <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Test Users
              </span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 2 }}>
                You can add or select upto 10 numbers
              </p>
            </div>

            <div className="flex items-center gap-3">
              {(['manual', 'choose'] as const).map(m => (
                <div
                  key={m}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-lg border cursor-pointer flex-1 transition-colors"
                  style={{
                    borderColor: mode === m ? 'var(--primary)' : 'var(--border)',
                    background: mode === m ? 'hsl(var(--primary)/0.06)' : 'var(--background)',
                  }}
                  onClick={() => setMode(m)}
                >
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: mode === m ? 'var(--primary)' : 'var(--border)' }}>
                    {mode === m && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      {m === 'manual' ? 'Enter Manually' : 'Choose Test Numbers'}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                      {m === 'manual'
                        ? 'All the Test Numbers will be entered in a comma separated manner.'
                        : 'Select the Test Users across different channels for your campaign testing.'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mode === 'manual' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Enter Numbers</span>
                  <button
                    onClick={() => { setManualChips([]); setManualDraft(''); setManualError(null) }}
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                </div>
                <Input
                  value={manualDraft}
                  onChange={e => { setManualDraft(e.target.value); setManualError(null) }}
                  onKeyDown={handleManualKeyDown}
                  placeholder="Enter Mobile Number or BSUID (IN.1234567890123456789), press Enter to add"
                />
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  BSUID format: <code>{'<country_code>.<19-digit numerical value>'}</code> — e.g. IN for India, US for USA
                </p>
                {manualError && (
                  <p style={{ fontSize: 'var(--text-xs)', color: '#b91c1c' }}>{manualError}</p>
                )}
                {manualChips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {manualChips.map(value => (
                      <Badge key={value} variant={BSUID_RE.test(value.toUpperCase()) ? 'default' : 'secondary'} className="gap-1 pr-1">
                        {value}
                        <button
                          type="button"
                          onClick={() => removeManualChip(value)}
                          aria-label={`Remove ${value}`}
                          className="flex items-center justify-center rounded-full hover:bg-black/10"
                          style={{ width: 14, height: 14, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          <X style={{ width: 10, height: 10 }} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {mode === 'choose' && (
              <div className="flex flex-col gap-2">
                {/* Numbers / User ID tabs */}
                <div className="flex items-center gap-1 border-b border-border">
                  {(['numbers', 'userid'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setChooseTab(tab)}
                      className={cn(
                        'px-4 py-2 -mb-px border-b-2 transition-colors',
                        chooseTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                      )}
                      style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', background: 'none', cursor: 'pointer' }}
                    >
                      {tab === 'numbers' ? 'Numbers' : 'User ID (BSUID)'}
                    </button>
                  ))}
                </div>

                {chooseTab === 'numbers' && (
                  <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
                    {MOCK_TEST_NUMBERS.map(num => (
                      <label key={num} className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-muted/30">
                        <input
                          type="checkbox"
                          checked={chosenNumbers.includes(num)}
                          onChange={() => toggle(chosenNumbers, setChosenNumbers, num)}
                          style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{num}</span>
                      </label>
                    ))}
                  </div>
                )}

                {chooseTab === 'userid' && (
                  <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
                    {MOCK_TEST_BSUIDS.map(id => (
                      <label key={id} className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-muted/30">
                        <input
                          type="checkbox"
                          checked={chosenBsuids.includes(id)}
                          onChange={() => toggle(chosenBsuids, setChosenBsuids, id)}
                          style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{id}</span>
                      </label>
                    ))}
                  </div>
                )}

                {chosenTotal > 0 && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                    {chosenTotal} selected ({chosenNumbers.length} number{chosenNumbers.length === 1 ? '' : 's'}, {chosenBsuids.length} user ID{chosenBsuids.length === 1 ? '' : 's'})
                  </p>
                )}
              </div>
            )}

            {overLimit && (
              <p style={{ fontSize: 'var(--text-xs)', color: '#b91c1c' }}>
                You can add or select up to 10 numbers only.
              </p>
            )}

            {bsuidOnly && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg" style={{ background: 'hsl(var(--primary)/0.06)' }}>
                <Info style={{ width: 14, height: 14, color: 'var(--primary)', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)' }}>
                  All selected test recipients are BSUIDs. If WhatsApp isn't the first channel in your MCO
                  order, the fallback channel(s) will trigger behind the scenes for this test.
                </p>
              </div>
            )}
          </div>

          {/* Variables */}
          <div className="flex flex-col gap-3">
            <div>
              <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Variables
              </span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 2 }}>
                Define the dynamic variables manually or fetch them from the file uploaded at campaign creation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg border cursor-pointer flex-1 transition-colors"
                style={{ borderColor: variablesMode === 'manual' ? 'var(--primary)' : 'var(--border)', background: variablesMode === 'manual' ? 'hsl(var(--primary)/0.06)' : 'var(--background)' }}
                onClick={() => setVariablesMode('manual')}
              >
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: variablesMode === 'manual' ? 'var(--primary)' : 'var(--border)' }}>
                  {variablesMode === 'manual' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Define Manually</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>Sent across all selected test users.</div>
                </div>
              </div>
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg border flex-1 transition-colors"
                style={{
                  borderColor: variablesMode === 'fetch' ? 'var(--primary)' : 'var(--border)',
                  background: variablesMode === 'fetch' ? 'hsl(var(--primary)/0.06)' : 'var(--muted)',
                  cursor: recipients.length ? 'pointer' : 'not-allowed',
                  opacity: recipients.length ? 1 : 0.5,
                }}
                onClick={() => recipients.length && setVariablesMode('fetch')}
              >
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: variablesMode === 'fetch' ? 'var(--primary)' : 'var(--border)' }}>
                  {variablesMode === 'fetch' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Fetch from the uploaded file</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>Select test numbers first to enable this.</div>
                </div>
              </div>
            </div>

            {variablesMode === 'manual' && (
              <Input value={varValue} onChange={e => setVarValue(e.target.value)} placeholder="{{1}} value, e.g. Helo.ai" />
            )}
          </div>

          {/* Schedule */}
          <div className="flex flex-col gap-3">
            <div>
              <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Campaign Activation Start Time
              </span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 2 }}>
                You can start your campaign or schedule it for later
              </p>
            </div>
            <div className="flex items-center gap-3">
              {(['now', 'later'] as const).map(s => (
                <div
                  key={s}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-lg border cursor-pointer flex-1 transition-colors"
                  style={{ borderColor: scheduleMode === s ? 'var(--primary)' : 'var(--border)', background: scheduleMode === s ? 'hsl(var(--primary)/0.06)' : 'var(--background)' }}
                  onClick={() => setScheduleMode(s)}
                >
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: scheduleMode === s ? 'var(--primary)' : 'var(--border)' }}>
                    {scheduleMode === s && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      {s === 'now' ? 'Start Now' : 'Schedule it for later'}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                      {s === 'now' ? 'Test will send once you click Test.' : 'Schedule within 10 mins of the current time'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {scheduleMode === 'later' && (
              <div className="flex items-center gap-3">
                <Input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="flex-1" />
                <Input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="flex-1" />
              </div>
            )}
          </div>

          {testSent && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: '#dcfce7' }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: '#15803d', flexShrink: 0 }} />
              <p style={{ fontSize: 'var(--text-sm)', color: '#15803d' }}>
                Test sent to {recipients.length} recipient{recipients.length === 1 ? '' : 's'}.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-border">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
          >
            <ChevronLeft style={{ width: 14, height: 14 }} />
            Previous
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { setManualChips([]); setManualDraft(''); setManualError(null); setChosenNumbers([]); setChosenBsuids([]); setTestSent(false) }}>Clear</Button>
            <Button variant="outline" size="sm" onClick={onBack}>Cancel</Button>
            <Button size="sm" disabled={recipients.length === 0 || overLimit} onClick={handleTest}>Test</Button>
          </div>
        </div>
      </div>

      {/* Right preview */}
      <div className="w-64 shrink-0 rounded-lg border border-border bg-background sticky top-4 overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Preview</span>
        </div>
        <div className="flex items-center justify-center px-4 py-6">
          <WhatsAppPhoneMockup body={templateBody} footer={templateFooter} />
        </div>
      </div>
    </>
  )
}
