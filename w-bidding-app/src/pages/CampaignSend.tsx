import { useState } from 'react'
import { Check, ChevronRight, HelpCircle } from 'lucide-react'
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
  const [campaignName] = useState('qwertyuiougjvhb')
  const [selectedTemplate, setSelectedTemplate] = useState('summer_sale_v1')
  const [multiplier, setMultiplier] = useState(1.0)

  const template = TEMPLATES.find(t => t.value === selectedTemplate)!
  const showMultiplier = metaEnabled && template.hasBid

  const preview = TEMPLATE_PREVIEW[selectedTemplate]

  return (
    <div className="flex flex-col h-full">
      <TopNav
        crumbs={[
          { label: 'Broadcast' },
          { label: 'Campaign List' },
          { label: 'Campaign Creation' },
          { label: 'Create New Campaign' },
        ]}
      />

      <div className="flex flex-1 overflow-hidden">
      {/* Form — scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-6 py-6 flex flex-col gap-6">

          {/* Campaign name header */}
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Campaigns
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{campaignName}</span>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 0 }}>✎</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Save as Draft</Button>
              <Button variant="outline" size="sm">← Back</Button>
            </div>
          </div>

          {/* Step progress bar */}
          <div className="flex items-center gap-0 overflow-x-auto">
            {STEPS.map((step, i) => {
              const isActive = i === activeStep
              const isDone = i < activeStep
              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
                      isActive ? 'bg-accent border-ring/40' : isDone ? 'border-transparent bg-transparent' : 'border-transparent bg-transparent'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center shrink-0 border',
                      isDone ? 'bg-primary border-primary' : isActive ? 'border-primary' : 'border-border bg-background'
                    )}>
                      {isDone
                        ? <Check style={{ width: 10, height: 10, color: 'white' }} />
                        : <span style={{ fontSize: '10px', color: isActive ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: 'var(--font-weight-bold)' }}>{i + 1}</span>
                      }
                    </div>
                    <div className="flex flex-col">
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: isActive ? 'var(--font-weight-semi-bold)' : 'var(--font-weight-normal)',
                        color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                        whiteSpace: 'nowrap',
                      }}>
                        {step.label}
                      </span>
                      {step.badge && (
                        <span className="bg-primary text-primary-foreground rounded px-1" style={{ fontSize: '9px', fontWeight: 'var(--font-weight-bold)', width: 'fit-content' }}>
                          {step.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight style={{ width: 14, height: 14, color: 'var(--muted-foreground)', flexShrink: 0 }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Channels badge */}
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)' }}>Channel 1:</span>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
              <div className="w-4 h-4 rounded bg-[#25D366] flex items-center justify-center">
                <span style={{ fontSize: '8px', color: 'white', fontWeight: 'bold' }}>W</span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 'var(--font-weight-medium)' }}>WHATSAPP</span>
            </div>
          </div>

          {/* WABA Name */}
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              WABA Name
            </label>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
              Your WABA Name is for your reference
            </p>
            <div className="flex items-center justify-between h-9 px-3 rounded-lg border border-border bg-muted/30">
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Test – WABA Account</span>
              <ChevronRight style={{ width: 14, height: 14, color: 'var(--muted-foreground)' }} />
            </div>
          </div>

          {/* WABA Number */}
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              WABA Number/Business Account Name
            </label>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
              Select your WhatsApp number/Business Account Name from which you are going to campaign
            </p>
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background">
              <span style={{ fontSize: 'var(--text-sm)' }}>15557836045</span>
              <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground" style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)' }}>
                Test – Helo.ai
              </span>
            </div>
          </div>

          {/* WABA Template */}
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
              WABA Template
            </label>
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

          {/* ── MULTIPLIER SECTION ── */}
          {showMultiplier && (
            <div className="flex flex-col gap-3 rounded-lg border border-ring/30 bg-accent/30 px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                    Max-Price Multiplier
                  </span>
                  <button
                    type="button"
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

              <MultiplierSummary
                baseBid={template.bidAmount}
                multiplier={multiplier}
              />

              <ReachEstimationWidget bidAmount={template.bidAmount * multiplier} />
            </div>
          )}

          {/* Define Variables */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>
                Define Variables
              </label>
              <span className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>Optional</span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
              You can add the static value(s) or URL(s) against the variables. Remaining variables (if any) can be uploaded in <strong>Audience</strong>
            </p>
            <div className="rounded-lg border border-dashed border-border p-4 flex items-center justify-center" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
              No variables have been selected yet.
            </div>
            <button
              className="flex items-center justify-center gap-1 h-9 rounded-lg border border-border hover:bg-muted transition-colors"
              style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', background: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
            >
              + Add values to variables
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-end pb-8">
            <Button>
              Next
              <ChevronRight style={{ width: 16, height: 16 }} />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview pane — non-scrollable */}
      <div className="w-72 shrink-0 border-l border-border bg-muted/30 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-border shrink-0">
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)' }}>Preview</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
          <WhatsAppPhoneMockup
            body={preview?.body}
            footer={preview?.footer}
          />
        </div>
      </div>

      </div>
    </div>
  )
}
