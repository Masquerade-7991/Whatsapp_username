import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { TopNav } from '@/components/layout/TopNav'
import { useFeature } from '@/context/FeatureContext'
import { Upload, ShieldCheck, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { CHANNEL_TABS } from '@/lib/constants'

const BUSINESS_CATEGORIES = [
  'Automotive',
  'Beauty, Spa and Salon',
  'Clothing and Apparel',
  'Education',
  'Entertainment',
  'Event Planning and Service',
  'Finance and Banking',
  'Food and Grocery',
  'Hotel and Lodging',
  'Medical and Health',
  'Non-profit',
  'Professional Services',
  'Restaurant',
  'Retail',
  'Shopping and Retail',
  'Travel and Transportation',
  'Technology',
  'Other',
]

type UsernameStatus = 'idle' | 'valid' | 'invalid' | 'taken' | 'submitted'

function validateUsername(val: string): UsernameStatus {
  if (!val) return 'idle'
  if (/^[A-Z]{2}\.[a-zA-Z0-9]{1,120}$/.test(val)) return 'valid'
  return 'invalid'
}

function CharCount({ current, max }: { current: number; max: number }) {
  return (
    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textAlign: 'right', marginTop: 4 }}>
      {current} / {max}
    </div>
  )
}

export function BusinessProfile() {
  const { whatsappUsernamesEnabled } = useFeature()
  const fileRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [primaryWebsite, setPrimaryWebsite] = useState('')
  const [secondaryWebsite, setSecondaryWebsite] = useState('')
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)

  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setUploadedPhoto(file.name)
  }

  function handleUsernameChange(val: string) {
    setUsername(val)
    setUsernameStatus(validateUsername(val))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert('Profile saved! (Prototype — no real API call)')
  }

  const usernameHint: Record<UsernameStatus, { text: string; color: string } | null> = {
    idle: null,
    valid: { text: 'Format valid — click Verify to submit for approval', color: 'var(--primary)' },
    invalid: { text: 'Format: CC.alphanumeric — e.g. IN.mybrand (max 128 chars)', color: 'var(--destructive)' },
    taken: { text: 'This username is already taken', color: 'var(--destructive)' },
    submitted: { text: 'Verification request submitted — pending approval', color: '#16a34a' },
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav
        crumbs={[
          { label: 'Templates' },
          { label: 'WhatsApp' },
          { label: 'Edit Business Profile' },
        ]}
      />

      {/* Channel tab bar */}
      <div className="flex items-center gap-0 border-b border-border px-6 shrink-0">
        {CHANNEL_TABS.map(tab => (
          <button
            key={tab}
            className="px-4 py-3 transition-colors"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: tab === 'WHATSAPP' ? 'var(--font-weight-semi-bold)' : 'var(--font-weight-normal)',
              color: tab === 'WHATSAPP' ? 'var(--primary)' : 'var(--muted-foreground)',
              borderBottom: tab === 'WHATSAPP' ? '2px solid var(--primary)' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/10">
        <form onSubmit={handleSubmit}>
          <div className="max-w-[640px] mx-auto px-6 py-8 flex flex-col gap-6">

            {/* ── Save / Cancel header ── */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '1.125rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Edit Business Profile
              </span>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm">Cancel</Button>
                <Button type="submit" size="sm">Save</Button>
              </div>
            </div>

            {/* ── Phone profile ── */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Phone profile
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                Accepts .png, .jpg
              </span>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-background hover:bg-muted/40 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                <Upload style={{ width: 15, height: 15, color: 'var(--muted-foreground)' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                  {uploadedPhoto ? uploadedPhoto : 'Browse'}
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* ── Display name ── */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Display name
              </span>
              <Input
                placeholder="John Doe"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                maxLength={60}
              />
              <CharCount current={displayName.length} max={60} />
            </div>

            {/* ── Official business account card ── */}
            <div className="rounded-xl border border-border bg-background px-5 py-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: '#dbeafe' }}
                >
                  <ShieldCheck style={{ width: 18, height: 18, color: '#2563eb' }} />
                </div>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    Official business account
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
                    An official business account has a blue tick next to its name. This shows that WhatsApp has confirmed that an authentic and notable brand owns this account.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" size="sm">Submit request</Button>
                <Button type="button" variant="outline" size="sm">Learn more</Button>
              </div>
            </div>

            {/* ── Business information heading ── */}
            <div>
              <span style={{ fontSize: '1rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Business information
              </span>
            </div>

            {/* ── Category ── */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Category
              </span>
              <Select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select</option>
                {BUSINESS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>

            {/* ── Description ── */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Description{' '}
                <span style={{ fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>(Optional)</span>
              </span>
              <Textarea
                placeholder="Enter description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={512}
                rows={4}
              />
              <CharCount current={description.length} max={512} />
            </div>

            {/* ── Address ── */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Address{' '}
                <span style={{ fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>(Optional)</span>
              </span>
              <Input
                placeholder="Enter address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                maxLength={256}
              />
              <CharCount current={address.length} max={256} />
            </div>

            {/* ── Email ── */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Email{' '}
                <span style={{ fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>(Optional)</span>
              </span>
              <Input
                type="email"
                placeholder="e.g. johndoe@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                maxLength={128}
              />
              <CharCount current={email.length} max={128} />
            </div>

            {/* ── Primary website ── */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Primary website{' '}
                <span style={{ fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>(Optional)</span>
              </span>
              <Input
                type="url"
                placeholder="e.g. https://www.example.com"
                value={primaryWebsite}
                onChange={e => setPrimaryWebsite(e.target.value)}
                maxLength={256}
              />
              <CharCount current={primaryWebsite.length} max={256} />
            </div>

            {/* ── Secondary website ── */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Secondary website{' '}
                <span style={{ fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>(Optional)</span>
              </span>
              <Input
                type="url"
                placeholder="e.g. https://www.example.com"
                value={secondaryWebsite}
                onChange={e => setSecondaryWebsite(e.target.value)}
                maxLength={256}
              />
              <CharCount current={secondaryWebsite.length} max={256} />
            </div>

            {/* ── WhatsApp Username (feature-flagged) ── */}
            {whatsappUsernamesEnabled && (
              <div className="flex flex-col gap-2 rounded-xl border border-ring/30 bg-accent/30 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    WhatsApp Username
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', background: '#dbeafe', color: '#1d4ed8' }}
                  >
                    NEW
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
                  Set a public username for your WhatsApp Business account. Format: <strong>CC.name</strong> (e.g.&nbsp;<code>IN.heloai</code>). Once approved, customers can message you using your username instead of a phone number.
                </p>
                <a
                  href="#"
                  className="flex items-center gap-1 w-fit"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)' }}
                  onClick={e => e.preventDefault()}
                >
                  <ExternalLink style={{ width: 11, height: 11 }} />
                  Eligibility requirements
                </a>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="e.g. IN.mybrand"
                    value={username}
                    onChange={e => handleUsernameChange(e.target.value)}
                    maxLength={128}
                    className={
                      usernameStatus === 'invalid' || usernameStatus === 'taken'
                        ? 'border-destructive'
                        : usernameStatus === 'valid'
                        ? 'border-primary'
                        : ''
                    }
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={usernameStatus !== 'valid'}
                    onClick={() => usernameStatus === 'valid' && setUsernameStatus('submitted')}
                    className="shrink-0"
                  >
                    Verify
                  </Button>
                </div>
                {usernameHint[usernameStatus] && (
                  <div className="flex items-center gap-1.5" style={{ fontSize: 'var(--text-xs)', color: usernameHint[usernameStatus]!.color }}>
                    {usernameStatus === 'submitted'
                      ? <CheckCircle style={{ width: 12, height: 12 }} />
                      : usernameStatus === 'invalid' || usernameStatus === 'taken'
                      ? <AlertCircle style={{ width: 12, height: 12 }} />
                      : null}
                    {usernameHint[usernameStatus]!.text}
                  </div>
                )}
              </div>
            )}

            {/* ── Footer buttons ── */}
            <div className="flex items-center justify-end gap-2 pb-10">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit">Save</Button>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
