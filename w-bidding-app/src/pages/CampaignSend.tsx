import { useState } from 'react'
import { Check, ChevronRight, ChevronDown, HelpCircle, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MultiplierSlider } from '@/components/bidding/MultiplierSlider'
import { MultiplierSummary } from '@/components/bidding/MultiplierSummary'
import { ReachEstimationWidget } from '@/components/bidding/ReachEstimationWidget'
import { TopNav } from '@/components/layout/TopNav'
import { WhatsAppPhoneMockup } from '@/components/layout/WhatsAppPhoneMockup'
import { useFeature } from '@/context/FeatureContext'
import { cn } from '@/lib/utils'

const STEPS = [
  { label: 'WhatsApp Configuration', id: 'config' },
  { label: 'Audience', id: 'audience' },
  { label: 'Settings', id: 'settings', badge: 'AI POWERED' },
  { label: 'Conversion', id: 'conversion' },
  { label: 'Preview', id: 'preview' },
]

const TEMPLATES = [
  { value: 'summer_sale_v1', label: 'summer_sale_v1 (Marketing · Bid set)', hasBid: true, bidAmount: 0.005 },
  { value: 'welcome_offer', label: 'welcome_offer (Marketing · No bid)', hasBid: false, bidAmount: 0 },
  { value: 'utility_update', label: 'utility_update (Utility)', hasBid: false, bidAmount: 0 },
]

const TEMPLATE_PREVIEW: Record<string, { body: string; footer: string }> = {
  summer_sale_v1: {
    body: 'Hi {{1}}, the Summer Sale is here! 🛍️ Get up to 50% off on selected items. Shop now before stocks run out!',
    footer: 'Reply STOP to unsubscribe',
  },
  welcome_offer: {
    body: "Welcome to Helo! 👋 We're excited to have you. Here's a special 20% discount on your first order: WELCOME20",
    footer: 'Valid for 7 days only',
  },
  utility_update: {
    body: 'Your order #{{1}} has been confirmed and is being processed. Estimated delivery: {{2}}.',
    footer: '',
  },
}

export function CampaignSend() {
  const { metaEnabled } = useFeature()
  const [activeStep] = useState(0)
  const [campaignName] = useState('smk_waba_v1')
  const [selectedTemplate, setSelectedTemplate] = useState('summer_sale_v1')
  const [multiplier, setMultiplier] = useState(1.0)
  const [variablesOpen, setVariablesOpen] = useState(true)

  const template = TEMPLATES.find(t => t.value === selectedTemplate)!
  const showMultiplier = metaEnabled && template.hasBid
  const preview = TEMPLATE_PREVIEW[selectedTemplate]

  return (
    <div className="flex flex-col h-full">
      <TopNav
        crumbs={[
          { label: 'Broadcast' },
          { label: 'Campaign List' },
          { label: 'Edit Campaign' },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Page title */}
          <div style={{ fontSize: '1.375rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
            Campaigns
          </div>

          {/* Campaign name + action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                {campaignName}
              </span>
              <button
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 0, fontSize: '1rem' }}
              >
                ✎
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Save as Draft</Button>
              <Button variant="outline" size="sm">← Back</Button>
            </div>
          </div>

          {/* 3-column layout */}
          <div className="flex gap-4 items-start pb-8">

            {/* ── LEFT: Stepwise Configuration ── */}
            <div className="w-56 shrink-0 rounded-lg border border-border bg-background sticky top-4 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                  Stepwise Configuration
                </span>
              </div>

              {/* Steps list */}
              <div className="flex flex-col py-1">
                {STEPS.map((step, i) => {
                  const isActive = i === activeStep
                  const isDone = i < activeStep
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        'flex items-center gap-2.5 px-4 py-2.5 transition-colors cursor-pointer',
                        isActive ? 'bg-primary/10' : 'hover:bg-muted/40'
                      )}
                    >
                      {/* Step indicator */}
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0 border',
                        isDone
                          ? 'bg-primary border-primary'
                          : isActive
                          ? 'bg-primary border-primary'
                          : 'border-border bg-background'
                      )}>
                        {isDone ? (
                          <Check style={{ width: 10, height: 10, color: 'white' }} />
                        ) : isActive ? (
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'white', display: 'block' }} />
                        ) : (
                          <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-bold)' }}>{i + 1}</span>
                        )}
                      </div>

                      {/* Step label */}
                      <div className="flex flex-col min-w-0">
                        <span style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: isActive ? 'var(--font-weight-semi-bold)' : 'var(--font-weight-normal)',
                          color: isActive ? 'var(--primary)' : isDone ? 'var(--foreground)' : 'var(--muted-foreground)',
                          whiteSpace: 'nowrap',
                        }}>
                          {step.label}
                        </span>
                        {step.badge && (
                          <span
                            className="flex items-center gap-0.5 w-fit px-1 py-0.5 rounded mt-0.5"
                            style={{ fontSize: '8px', fontWeight: 'var(--font-weight-bold)', background: '#f59e0b', color: 'white' }}
                          >
                            ✦ {step.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Channels section */}
              <div className="px-4 py-3 border-t border-border flex flex-col gap-2">
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                  Channels
                </span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                  <strong>NOTE:</strong> Channels can be rearranged.
                </p>
                <div className="flex items-center justify-between px-2 py-1.5 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>Channel 1:</span>
                    <div className="w-4 h-4 rounded bg-[#25D366] flex items-center justify-center shrink-0">
                      <span style={{ fontSize: '8px', color: 'white', fontWeight: 'bold' }}>W</span>
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      WHATSAPP
                    </span>
                  </div>
                  <GripVertical style={{ width: 12, height: 12, color: 'var(--muted-foreground)' }} />
                </div>
                <Select>
                  <option value="WHATSAPP">WHATSAPP</option>
                  <option value="SMS">SMS</option>
                  <option value="RCS">RCS</option>
                </Select>
              </div>

              {/* Tags section */}
              <div className="px-4 py-3 border-t border-border flex flex-col gap-2">
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                  Tags
                </span>
                <Select>
                  <option value="">Select/enter your Tag(s)</option>
                  <option value="promo">Promo</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="retention">Retention</option>
                </Select>
              </div>
            </div>

            {/* ── CENTER: Form card ── */}
            <div className="flex-1 min-w-0 rounded-lg border border-border bg-background">

              {/* WABA Name */}
              <div className="px-6 py-5 border-b border-border">
                <div className="flex flex-col gap-2">
                  <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    WABA Name
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                    Your WABA Name is for your reference
                  </p>
                  <Select>
                    <option value="test">Test - WABA Account</option>
                  </Select>
                </div>
              </div>

              {/* WABA Number */}
              <div className="px-6 py-5 border-b border-border">
                <div className="flex flex-col gap-2">
                  <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    WABA Number/Business Account Name
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                    Select your WhatsApp number/Business Account Name from which you are going to campaign
                  </p>
                  <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background cursor-pointer hover:border-ring/60 transition-colors">
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>15557836045</span>
                    <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground" style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)' }}>
                      Test – Helo.ai
                    </span>
                    <ChevronDown style={{ width: 14, height: 14, color: 'var(--muted-foreground)', marginLeft: 'auto' }} />
                  </div>
                </div>
              </div>

              {/* WABA Template */}
              <div className="px-6 py-5 border-b border-border">
                <div className="flex flex-col gap-2">
                  <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    WABA Template
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                    Choose your WhatsApp message template for your campaign configuration
                  </p>
                  <Select
                    value={selectedTemplate}
                    onChange={e => { setSelectedTemplate(e.target.value); setMultiplier(1.0) }}
                  >
                    {TEMPLATES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* ── MAX-PRICE MULTIPLIER (custom addition) ── */}
              {showMultiplier && (
                <div className="px-6 py-5 border-b border-border">
                  <div className="flex flex-col gap-3 rounded-lg border border-ring/30 bg-accent/30 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                          Max-Price Multiplier
                        </span>
                        <button
                          title="Adjusts your template bid for this campaign. 1.0× applies the base bid with no change."
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
                      Adjust the bid multiplier for this campaign send. 1.0× applies the base bid with no change.
                    </p>
                    <MultiplierSlider value={multiplier} onChange={setMultiplier} />
                    <MultiplierSummary baseBid={template.bidAmount} multiplier={multiplier} />
                    <ReachEstimationWidget bidAmount={template.bidAmount * multiplier} />
                  </div>
                </div>
              )}

              {/* Define Variables */}
              <div className="px-6 py-5 border-b border-border">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      Define Variables
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full border"
                      style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', background: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0' }}
                    >
                      Optional
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                    You can add the static value(s) or URL(s) against the variables. Remaining variables (if any) can be uploaded in <strong>Audience</strong>
                  </p>

                  {/* Variable Configuration collapsible */}
                  <div className="rounded-lg border border-border overflow-hidden">
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                      style={{ border: 'none', cursor: 'pointer' }}
                      onClick={() => setVariablesOpen(o => !o)}
                    >
                      <ChevronDown
                        style={{
                          width: 14, height: 14,
                          color: 'var(--foreground)',
                          transform: variablesOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                          transition: 'transform 0.15s ease',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
                        Variable Configuration
                      </span>
                    </button>

                    {variablesOpen && (
                      <div className="border-t border-border overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-border bg-muted/20">
                              <th className="px-4 py-2.5 text-left" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Variable</th>
                              <th className="px-4 py-2.5 text-left" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Type</th>
                              <th className="px-4 py-2.5 text-left" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{'{{1}}'}</span>
                                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>(visit us)</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Select>
                                  <option value="shortlink">Shortlink Te...</option>
                                  <option value="static">Static Value</option>
                                  <option value="dynamic">Dynamic</option>
                                </Select>
                              </td>
                              <td className="px-4 py-3">
                                <Select>
                                  <option value="shortify2variabl">shortify2variabl...</option>
                                </Select>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Add values button */}
                  <div className="flex justify-center pt-1">
                    <button
                      className="flex items-center gap-1 h-9 px-6 rounded-lg border border-border hover:bg-muted transition-colors"
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', background: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                    >
                      + Add values to variables
                    </button>
                  </div>
                </div>
              </div>

              {/* Next footer */}
              <div className="px-6 py-4 flex justify-end">
                <button
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                >
                  Next
                  <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>

            {/* ── RIGHT: Preview pane (sticky) ── */}
            <div className="w-64 shrink-0 rounded-lg border border-border bg-background sticky top-4 overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Preview</span>
              </div>
              <div className="flex items-center justify-center px-4 py-6">
                <WhatsAppPhoneMockup
                  body={preview?.body}
                  footer={preview?.footer}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
