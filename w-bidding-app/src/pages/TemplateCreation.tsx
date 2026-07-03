import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { BiddingToggle } from '@/components/bidding/BiddingToggle'
import { ReachEstimationWidget } from '@/components/bidding/ReachEstimationWidget'
import { TopNav } from '@/components/layout/TopNav'
import { useFeature } from '@/context/FeatureContext'
import { Plus, X, Sparkles, ChevronDown } from 'lucide-react'
import { CHANNEL_TABS } from '@/lib/constants'
import { WhatsAppPhoneMockup } from '@/components/layout/WhatsAppPhoneMockup'

const CATEGORIES = [
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'UTILITY', label: 'Utility' },
  { value: 'AUTHENTICATION', label: 'Authentication' },
  { value: 'SERVICE', label: 'Service' },
  { value: 'DIRECT', label: 'Direct' },
]

const DIRECT_HEADER_TYPES = [
  { value: 'NONE', label: 'None' },
  { value: 'TEXT', label: 'Text' },
]

type ButtonType = 'QUICK_REPLY' | 'VISIT_WEBSITE' | 'CALL_PHONE' | 'COPY_OFFER_CODE' | 'REQUEST_CONTACT_INFO'

interface CtaButton {
  id: number
  type: ButtonType
  text: string
  url?: string
  phone?: string
  countryCode?: string
}

const BUTTON_TYPE_LABELS: Record<ButtonType, string> = {
  QUICK_REPLY: 'Quick Reply',
  VISIT_WEBSITE: 'Visit Website',
  CALL_PHONE: 'Call Phone Number',
  COPY_OFFER_CODE: 'Copy Offer Code',
  REQUEST_CONTACT_INFO: 'Share Contact Info',
}

const BUTTON_TYPE_SUBTITLES: Record<ButtonType, string> = {
  QUICK_REPLY: '',
  VISIT_WEBSITE: 'URL Type: Static',
  CALL_PHONE: 'Country: +91',
  COPY_OFFER_CODE: '',
  REQUEST_CONTACT_INFO: 'Sends user\'s phone number to business',
}

const HEADER_TYPES = [
  { value: 'NONE', label: 'None' },
  { value: 'TEXT', label: 'Text' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'DOCUMENT', label: 'Document' },
]

let _btnId = 4

function AddButtonDropdown({ available, onAdd }: { available: ButtonType[]; onAdd: (t: ButtonType) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (available.length === 0) return null

  return (
    <div ref={ref} className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary hover:text-primary transition-colors"
        style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
      >
        <Plus style={{ width: 14, height: 14 }} />
        Add a button
        <ChevronDown style={{ width: 12, height: 12 }} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 rounded-lg border border-border bg-background shadow-md py-1" style={{ minWidth: 220 }}>
          {available.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => { onAdd(type); setOpen(false) }}
              className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex flex-col gap-0.5"
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                {BUTTON_TYPE_LABELS[type]}
              </span>
              {BUTTON_TYPE_SUBTITLES[type] && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  {BUTTON_TYPE_SUBTITLES[type]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function TemplateCreation() {
  const { metaEnabled } = useFeature()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('MARKETING')
  const [header, setHeader] = useState('NONE')
  const [body, setBody] = useState('')
  const [footer, setFooter] = useState('')
  const [nameError, setNameError] = useState(false)
  const [buttons, setButtons] = useState<CtaButton[]>([
    { id: 1, type: 'VISIT_WEBSITE', text: 'Visit Website', url: '' },
    { id: 2, type: 'CALL_PHONE', text: 'Call Phone Number', countryCode: '+91', phone: '' },
    { id: 3, type: 'COPY_OFFER_CODE', text: 'Copy Offer Code' },
  ])

  const isDirectMode = category === 'DIRECT'
  const showBidding = category === 'MARKETING' && metaEnabled

  useEffect(() => {
    if (isDirectMode) {
      if (!['NONE', 'TEXT'].includes(header)) setHeader('NONE')
      setButtons([])
    }
  }, [category]) // eslint-disable-line react-hooks/exhaustive-deps

  const hasRequestContactInfo = buttons.some(b => b.type === 'REQUEST_CONTACT_INFO')
  const canAddRequestContactInfo = !hasRequestContactInfo && (category === 'MARKETING' || category === 'UTILITY')
  const visitWebsiteCount = buttons.filter(b => b.type === 'VISIT_WEBSITE').length
  const callPhoneCount = buttons.filter(b => b.type === 'CALL_PHONE').length

  const availableButtonTypes: ButtonType[] = isDirectMode
    ? (() => {
        const hasUrl = buttons.some(b => b.type === 'VISIT_WEBSITE')
        const qrCount = buttons.filter(b => b.type === 'QUICK_REPLY').length
        if (hasUrl || qrCount >= 3) return []
        if (qrCount > 0) return ['QUICK_REPLY']
        return ['QUICK_REPLY', 'VISIT_WEBSITE']
      })()
    : [
        'QUICK_REPLY',
        ...(visitWebsiteCount < 2 ? ['VISIT_WEBSITE' as ButtonType] : []),
        ...(callPhoneCount < 1 ? ['CALL_PHONE' as ButtonType] : []),
        'COPY_OFFER_CODE',
        ...(canAddRequestContactInfo ? ['REQUEST_CONTACT_INFO' as ButtonType] : []),
      ]

  function addButton(type: ButtonType) {
    const defaults: Partial<CtaButton> =
      type === 'VISIT_WEBSITE' ? { url: '' } :
      type === 'CALL_PHONE'    ? { countryCode: '+91', phone: '' } : {}
    setButtons(prev => [...prev, { id: ++_btnId, type, text: BUTTON_TYPE_LABELS[type], ...defaults }])
  }

  function removeButton(id: number) {
    setButtons(prev => prev.filter(b => b.id !== id))
  }

  function updateButton(id: number, patch: Partial<Omit<CtaButton, 'id' | 'type'>>) {
    setButtons(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setNameError(true); return }
    alert('Template saved! (Prototype — no real API call)')
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav
        crumbs={[
          { label: 'Templates' },
          { label: 'WhatsApp' },
          { label: 'Create WhatsApp Template' },
        ]}
      />

      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-border px-6">
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

      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="px-8 py-6 max-w-[600px] mx-auto flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div style={{ fontSize: '1.125rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                  New WhatsApp template
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm">Cancel</Button>
                  <Button type="submit" size="sm">Submit</Button>
                </div>
              </div>

              {/* Template Name */}
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Template Name
                </label>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  Name your template using lowercase letters, alphanumeric characters, and underscores
                </p>
                <Input
                  placeholder="Enter Template Name"
                  value={name}
                  onChange={e => { setName(e.target.value); setNameError(false) }}
                  className={nameError ? 'border-destructive' : ''}
                />
                {nameError && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--destructive)' }}>
                    Template Name is required
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Category
                </label>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  Choose a message template
                </p>
                <Select value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </Select>
              </div>

              {/* Language */}
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Language
                </label>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  Please select the languages for which you want to create a template. (Maximum 10 languages allowed · 1/10 selected)
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-3 py-1 rounded-full bg-primary text-primary-foreground"
                    style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}
                  >
                    English
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-border hover:border-primary hover:text-primary transition-colors"
                    style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer' }}
                  >
                    <Plus style={{ width: 12, height: 12 }} />
                    Add Language
                  </button>
                </div>
              </div>

              {/* Header */}
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Header <span className="text-muted-foreground" style={{ fontWeight: 'var(--font-weight-normal)' }}>Optional</span>
                </label>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  Add a title or choose which type of media you'll use for this header.
                </p>
                <Select value={header} onChange={e => setHeader(e.target.value)}>
                  {(isDirectMode ? DIRECT_HEADER_TYPES : HEADER_TYPES).map(h => (
                    <option key={h.value} value={h.value}>{h.label}</option>
                  ))}
                </Select>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Body
                </label>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  Enter the text for your message in the language that you've selected.
                </p>
                <div className="relative">
                  <Textarea
                    placeholder="Enter body text"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={4}
                    maxLength={1024}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <button
                      type="button"
                      className="px-2 py-1 rounded hover:bg-muted transition-colors"
                      style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', background: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                    >
                      + Variable
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-2 py-1 rounded hover:bg-muted transition-colors"
                        style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer' }}
                      >
                        Translate
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', border: 'none' }}
                      >
                        <Sparkles style={{ width: 12, height: 12 }} />
                        Rephrase with AI
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textAlign: 'right', marginTop: '2px' }}>
                    {body.length}/1024
                  </div>
                </div>
              </div>

              {/* Footer */}
              {!isDirectMode && (
                <div className="flex flex-col gap-2">
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                    Footer <span className="text-muted-foreground" style={{ fontWeight: 'var(--font-weight-normal)' }}>Optional</span>
                  </label>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                    Add a short line of text to the bottom of your message template.
                  </p>
                  <div className="relative">
                    <Input
                      placeholder="Enter text"
                      value={footer}
                      onChange={e => setFooter(e.target.value)}
                      maxLength={60}
                    />
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textAlign: 'right', marginTop: '2px' }}>
                      {footer.length}/60
                    </div>
                  </div>
                </div>
              )}

              {/* ── BIDDING SECTION ── */}
              {showBidding && (
                <>
                  <BiddingToggle />

                  {/* Preview Estimated Reach block — same hierarchy level */}
                  <ReachEstimationWidget />
                </>
              )}

              {/* Call to Action */}
              <div className="flex flex-col gap-3">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Call to Action/Reply Buttons <span className="text-muted-foreground" style={{ fontWeight: 'var(--font-weight-normal)' }}>Optional</span>
                </label>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  {isDirectMode
                    ? 'Add up to 3 Quick Reply buttons, or 1 URL Redirect button — not both.'
                    : 'Create Call to Action or Reply Buttons that let customers respond to your message or take action. You can add up to 10 buttons.'}
                </p>
                <div className="flex flex-col gap-2">
                  {buttons.map(btn => (
                    <div key={btn.id} className="rounded-lg border border-border p-3 flex flex-col gap-3">
                      {/* header row */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>Type of Action</span>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                              {BUTTON_TYPE_LABELS[btn.type]}
                            </span>
                            {btn.type === 'REQUEST_CONTACT_INFO' && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                                style={{ fontSize: '10px', background: '#dbeafe', color: '#1d4ed8', fontWeight: 'var(--font-weight-medium)' }}
                              >
                                New
                              </span>
                            )}
                          </div>
                          {BUTTON_TYPE_SUBTITLES[btn.type] && btn.type !== 'CALL_PHONE' && (
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                              {BUTTON_TYPE_SUBTITLES[btn.type]}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeButton(btn.id)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          <X style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
                        </button>
                      </div>

                      {/* Quick Reply: text label */}
                      {btn.type === 'QUICK_REPLY' && (
                        <Input
                          placeholder="Button text"
                          value={btn.text}
                          onChange={e => updateButton(btn.id, { text: e.target.value })}
                          maxLength={25}
                        />
                      )}

                      {/* Visit Website: button name + URL */}
                      {btn.type === 'VISIT_WEBSITE' && (
                        <div className="flex flex-col gap-2">
                          <Input
                            placeholder="Button name"
                            value={btn.text}
                            onChange={e => updateButton(btn.id, { text: e.target.value })}
                            maxLength={25}
                          />
                          <Input
                            placeholder="https://example.com"
                            value={btn.url ?? ''}
                            onChange={e => updateButton(btn.id, { url: e.target.value })}
                          />
                        </div>
                      )}

                      {/* Call Phone: button text + country code + phone */}
                      {btn.type === 'CALL_PHONE' && (
                        <div className="flex flex-col gap-2">
                          <Input
                            placeholder="Button text"
                            value={btn.text}
                            onChange={e => updateButton(btn.id, { text: e.target.value })}
                            maxLength={25}
                          />
                          <div className="flex gap-2">
                            <Input
                              value={btn.countryCode ?? '+91'}
                              onChange={e => updateButton(btn.id, { countryCode: e.target.value })}
                              style={{ width: 72 }}
                            />
                            <Input
                              placeholder="Phone number"
                              value={btn.phone ?? ''}
                              onChange={e => updateButton(btn.id, { phone: e.target.value })}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {buttons.length < 10 && (
                    <AddButtonDropdown available={availableButtonTypes} onAdd={addButton} />
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-2 pb-8">
                <Button type="button" variant="outline">Cancel</Button>
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview panel — non-scrollable */}
        <div className="w-72 shrink-0 border-l border-border bg-muted/30 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-border shrink-0">
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>Preview</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
            <WhatsAppPhoneMockup
              body={body}
              footer={footer}
              buttons={buttons.map(b => b.text)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
