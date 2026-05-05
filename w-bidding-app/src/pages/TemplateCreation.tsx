import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { BiddingToggle } from '@/components/bidding/BiddingToggle'
import { TopNav } from '@/components/layout/TopNav'
import { useFeature } from '@/context/FeatureContext'
import { Plus, X, Smartphone, Sparkles } from 'lucide-react'
import { CHANNEL_TABS } from '@/lib/constants'

const CATEGORIES = [
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'UTILITY', label: 'Utility' },
  { value: 'AUTHENTICATION', label: 'Authentication' },
  { value: 'SERVICE', label: 'Service' },
]

const HEADER_TYPES = [
  { value: 'NONE', label: 'None' },
  { value: 'TEXT', label: 'Text' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'DOCUMENT', label: 'Document' },
]

export function TemplateCreation() {
  const { metaEnabled } = useFeature()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('MARKETING')
  const [header, setHeader] = useState('NONE')
  const [body, setBody] = useState('')
  const [footer, setFooter] = useState('')
  const [nameError, setNameError] = useState(false)

  const showBidding = category === 'MARKETING' && metaEnabled

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
            <div className="px-8 py-6 max-w-[600px] flex flex-col gap-6">
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
                  {HEADER_TYPES.map(h => (
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

              {/* ── BIDDING SECTION ── */}
              {showBidding && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Max-Price Bidding
                    </label>
                    <span
                      className="px-2 py-0.5 rounded border border-primary/30 bg-accent text-accent-foreground"
                      style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}
                    >
                      Beta
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                    Set a maximum bid cap per 1,000 message deliveries for this marketing template.
                  </p>
                  <BiddingToggle />
                </div>
              )}

              {/* Footer */}
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

              {/* Call to Action */}
              <div className="flex flex-col gap-3">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Call to Action/Reply Buttons <span className="text-muted-foreground" style={{ fontWeight: 'var(--font-weight-normal)' }}>Optional</span>
                </label>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  Create Call to Action or Reply Buttons that let customers respond to your message or take action. You can add up to 10 buttons.
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { type: 'Visit Website', sub: 'URL Type: Static' },
                    { type: 'Call Phone Number', sub: 'Country: +91' },
                    { type: 'Copy Offer Code', sub: '' },
                  ].map((btn, i) => (
                    <div key={i} className="rounded-lg border border-border p-3 flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>Type of Action</span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>{btn.type}</span>
                        {btn.sub && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{btn.sub}</span>}
                      </div>
                      <button type="button" className="p-1 hover:bg-muted rounded transition-colors" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <X style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary hover:text-primary transition-colors w-fit"
                    style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                  >
                    <Plus style={{ width: 14, height: 14 }} />
                    Add a button
                  </button>
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

        {/* Preview panel */}
        <div className="w-72 shrink-0 border-l border-border bg-muted/30 flex flex-col">
          <div className="px-6 py-4 border-b border-border">
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>Preview</span>
          </div>
          <div className="flex-1 flex items-start justify-center pt-8 px-6">
            <div className="w-56 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              {/* Phone bar */}
              <div className="bg-[#075E54] px-3 py-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/30" />
                <div>
                  <p className="text-white" style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semi-bold)' }}>Test - WABA Account</p>
                </div>
              </div>
              {/* Chat area */}
              <div className="bg-[#ECE5DD] p-3 min-h-[160px]">
                {body && (
                  <div className="bg-white rounded-lg p-2 shadow-sm" style={{ fontSize: '12px', maxWidth: '90%' }}>
                    {body}
                  </div>
                )}
                {!body && (
                  <div className="flex flex-col items-center justify-center h-20 gap-1 opacity-40">
                    <Smartphone style={{ width: 24, height: 24 }} />
                    <span style={{ fontSize: '10px' }}>Preview appears here</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
