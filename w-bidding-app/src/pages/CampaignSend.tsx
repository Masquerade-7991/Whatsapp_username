import { useState, useRef } from 'react'
import { Check, ChevronRight, ChevronDown, GripVertical, Upload, FileText, Users, ChevronLeft as ChevronLeftIcon, Eye, Download, Trash2 } from 'lucide-react'
import { CampaignTest } from '@/pages/CampaignTest'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { MultiplierCard } from '@/components/bidding/MultiplierCard'
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
  { value: 'summer_sale_v1', label: 'summer_sale_v1 (Marketing · Bid set)', hasBid: true, bidAmount: 0.80 },
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

type FileStatus = 'pending' | 'success' | 'failed'

function AudienceStep({ onUploaded }: { onUploaded?: (done: boolean) => void }) {
  const [audienceTab, setAudienceTab] = useState<'upload' | 'segment'>('upload')
  const [dragging, setDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [fileStatus, setFileStatus] = useState<FileStatus | null>(null)
  const [removeDuplicatesChecked, setRemoveDuplicatesChecked] = useState(false)
  const [removeDuplicatesScope, setRemoveDuplicatesScope] = useState<'single' | 'multiple'>('single')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) { setUploadedFile(file.name); setFileStatus('pending') }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) { setUploadedFile(file.name); setFileStatus('pending') }
  }

  function handleDeleteFile() {
    setUploadedFile(null)
    setFileStatus(null)
    onUploaded?.(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleUpload() {
    setFileStatus('success')
    onUploaded?.(true)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Method picker */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-lg border cursor-pointer flex-1 transition-colors"
          style={{ borderColor: audienceTab === 'upload' ? 'var(--primary)' : 'var(--border)', background: audienceTab === 'upload' ? 'hsl(var(--primary)/0.06)' : 'var(--background)' }}
          onClick={() => setAudienceTab('upload')}
        >
          <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: audienceTab === 'upload' ? 'var(--primary)' : 'var(--border)' }}>
            {audienceTab === 'upload' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />}
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Upload file</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>.txt, .csv, .zip and .xlsx formats accepted.</div>
          </div>
        </div>
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-lg border cursor-pointer flex-1 transition-colors"
          style={{ borderColor: audienceTab === 'segment' ? 'var(--primary)' : 'var(--border)', background: audienceTab === 'segment' ? 'hsl(var(--primary)/0.06)' : 'var(--background)' }}
          onClick={() => setAudienceTab('segment')}
        >
          <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: audienceTab === 'segment' ? 'var(--primary)' : 'var(--border)' }}>
            {audienceTab === 'segment' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />}
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>Select segment</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>Segments from clarity will be shown.</div>
          </div>
        </div>
      </div>

      {audienceTab === 'upload' && (
        <>
          {/* NOTE + Sample File row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)' }}>
                <strong>NOTE:</strong> Same type of files are accepted
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 2 }}>
                In .csv file don't use comma and in .txt file don't use delimiters in the variables uploaded.
              </p>
            </div>
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
              style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', border: 'none', cursor: 'pointer' }}
            >
              <FileText style={{ width: 13, height: 13 }} />
              Sample File
            </button>
          </div>

          {/* Drop zone */}
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors py-12"
            style={{ borderColor: dragging ? 'var(--primary)' : 'var(--border)', background: dragging ? 'hsl(var(--primary)/0.04)' : 'var(--background)' }}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <Upload style={{ width: 40, height: 40, color: 'var(--muted-foreground)' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
              Drag &amp; Drop file here
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>or</span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', border: 'none', cursor: 'pointer' }}
            >
              Browse
            </button>
            {uploadedFile && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>1 file selected</span>
            )}
            <input ref={fileRef} type="file" accept=".txt,.csv,.zip,.xls,.xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          {/* Formats note — red */}
          <p style={{ fontSize: 'var(--text-xs)', color: '#ef4444', fontWeight: 'var(--font-weight-medium)' }}>
            .txt, .csv, .zip, .xls and .xlsx formats are Accepted. Size: Upto 200 MB
          </p>

          {/* File table — shown when a file is selected */}
          {uploadedFile && fileStatus && (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: '#dbeafe' }}>
                    <th className="px-4 py-2.5 text-left" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: '#1d4ed8' }}>File Name</th>
                    <th className="px-4 py-2.5 text-left" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: '#1d4ed8' }}>Status</th>
                    <th className="px-4 py-2.5 text-left" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: '#1d4ed8' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{uploadedFile}</span>
                    </td>
                    <td className="px-4 py-3">
                      {fileStatus === 'pending' && (
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Pending</span>
                      )}
                      {fileStatus === 'success' && (
                        <span className="px-2.5 py-0.5 rounded-full" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', background: '#dcfce7', color: '#15803d' }}>
                          Success
                        </span>
                      )}
                      {fileStatus === 'failed' && (
                        <span className="px-2.5 py-0.5 rounded-full" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', background: '#fee2e2', color: '#b91c1c' }}>
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex' }} title="Preview">
                          <Eye style={{ width: 16, height: 16 }} />
                        </button>
                        <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex' }} title="Download">
                          <Download style={{ width: 16, height: 16 }} />
                        </button>
                        <button type="button" onClick={handleDeleteFile} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex' }} title="Delete">
                          <Trash2 style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Remove Duplicate Numbers — checkbox */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={removeDuplicatesChecked}
                onChange={e => setRemoveDuplicatesChecked(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                Remove Duplicate Numbers
              </span>
            </label>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', paddingLeft: 24 }}>
              Selecting this will remove the duplicate mobile numbers from the file uploaded above
            </p>
            <div className="flex items-center gap-6" style={{ paddingLeft: 24 }}>
              {(['single', 'multiple'] as const).map(opt => (
                <label
                  key={opt}
                  className="flex items-center gap-2"
                  style={{ cursor: removeDuplicatesChecked ? 'pointer' : 'not-allowed', opacity: removeDuplicatesChecked ? 1 : 0.4 }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: removeDuplicatesChecked && removeDuplicatesScope === opt ? 'var(--primary)' : 'var(--border)' }}
                    onClick={() => removeDuplicatesChecked && setRemoveDuplicatesScope(opt)}
                  >
                    {removeDuplicatesChecked && removeDuplicatesScope === opt && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', display: 'block' }} />
                    )}
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
                    {opt === 'single' ? 'Single file' : 'Across multiple files'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload button — centred */}
          <div className="flex justify-center">
            <button
              type="button"
              disabled={!uploadedFile || fileStatus === 'success'}
              onClick={handleUpload}
              className="px-10 py-2 rounded-lg transition-opacity"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                background: uploadedFile && fileStatus !== 'success' ? 'var(--primary)' : 'var(--muted)',
                color: uploadedFile && fileStatus !== 'success' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                border: 'none',
                cursor: uploadedFile && fileStatus !== 'success' ? 'pointer' : 'not-allowed',
                opacity: uploadedFile && fileStatus !== 'success' ? 1 : 0.6,
              }}
            >
              Upload
            </button>
          </div>
        </>
      )}

      {audienceTab === 'segment' && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-xl border border-dashed border-border">
          <Users style={{ width: 36, height: 36, color: 'var(--muted-foreground)' }} />
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
            No segments available. Create a segment in Clarity to use here.
          </p>
        </div>
      )}
    </div>
  )
}

function PreviewSectionRow({ label }: { label: string }) {
  return (
    <tr>
      <td colSpan={2} className="px-4 py-2.5" style={{ background: 'var(--muted)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
        {label}
      </td>
    </tr>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-2.5" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{label}</td>
      <td className="px-4 py-2.5 text-right" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>{value}</td>
    </tr>
  )
}

export function CampaignSend() {
  const { metaEnabled } = useFeature()
  const [activeStep, setActiveStep] = useState(0)
  const [audienceUploaded, setAudienceUploaded] = useState(false)
  const [campaignName] = useState('smk_waba_v1')
  const [selectedTemplate, setSelectedTemplate] = useState('summer_sale_v1')
  const [multiplier, setMultiplier] = useState(1.0)
  const [variablesOpen, setVariablesOpen] = useState(true)
  const [published, setPublished] = useState(false)
  const [testMode, setTestMode] = useState(false)

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
            {testMode ? (
              <CampaignTest
                templateBody={preview?.body}
                templateFooter={preview?.footer}
                onBack={() => setTestMode(false)}
              />
            ) : (
              <>

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
            <div className="flex-1 min-w-0 rounded-lg border border-border bg-background overflow-hidden">

              {/* Step 1: Audience */}
              {activeStep === 1 && (
                <>
                  <div className="px-6 py-5 border-b border-border">
                    <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      Add Audience
                    </span>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 4 }}>
                      Choose one method
                    </p>
                  </div>
                  <div className="px-6 py-5">
                    <AudienceStep onUploaded={setAudienceUploaded} />
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between border-t border-border">
                    <button
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                      onClick={() => setActiveStep(0)}
                    >
                      <ChevronLeftIcon style={{ width: 14, height: 14 }} />
                      Back
                    </button>
                    <button
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                      onClick={() => setActiveStep(2)}
                    >
                      Next →
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </>
              )}

              {/* Steps 2–3: Settings / Conversion — not built out for this prototype, but progression works */}
              {(activeStep === 2 || activeStep === 3) && (
                <>
                  <div className="px-6 py-5 border-b border-border">
                    <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      {STEPS[activeStep]?.label}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                      This step is not part of this prototype.
                    </p>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between border-t border-border">
                    <button
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                      onClick={() => setActiveStep(s => Math.max(0, s - 1))}
                    >
                      <ChevronLeftIcon style={{ width: 14, height: 14 }} />
                      Back
                    </button>
                    <button
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                      onClick={() => setActiveStep(s => Math.min(STEPS.length - 1, s + 1))}
                    >
                      Next
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </>
              )}

              {/* Step 4: Preview */}
              {activeStep === 4 && (
                <>
                  <div className="px-6 py-5 border-b border-border">
                    <span style={{ fontSize: 'var(--text-base, 1rem)', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>
                      Preview your entries
                    </span>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginTop: 4 }}>
                      Review your campaign configuration before publishing.
                    </p>
                  </div>

                  <div className="px-6 py-2">
                    <table className="w-full border-collapse">
                      <tbody>
                        <PreviewSectionRow label="General Info" />
                        <PreviewRow label="Campaign name" value={campaignName} />
                        <PreviewRow label="Channel" value="WHATSAPP" />

                        <PreviewSectionRow label="WhatsApp Configuration" />
                        <PreviewRow label="WABA Name" value="Test - WABA Account" />
                        <PreviewRow label="WABA Number" value="15557836045" />
                        <PreviewRow label="Business Account Name" value="Test – Helo.ai" />
                        <PreviewRow label="WABA Template" value={template.value} />
                        {showMultiplier && (
                          <PreviewRow label="Max-price multiplier" value={`${multiplier.toFixed(2)}× (base $${template.bidAmount.toFixed(2)})`} />
                        )}

                        <PreviewSectionRow label="Audience" />
                        <PreviewRow label="Contacts uploaded" value={audienceUploaded ? 'File uploaded' : 'No file uploaded'} />
                      </tbody>
                    </table>
                  </div>

                  <div className="px-6 py-4 flex items-center justify-between border-t border-border">
                    <button
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                      onClick={() => setActiveStep(3)}
                    >
                      <ChevronLeftIcon style={{ width: 14, height: 14 }} />
                      Previous
                    </button>
                    <div className="flex items-center gap-4">
                      <button
                        className="hover:opacity-80 transition-opacity"
                        style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}
                        onClick={() => setTestMode(true)}
                      >
                        Test Your Campaign
                      </button>
                      <Button size="sm" onClick={() => setPublished(true)}>Publish</Button>
                    </div>
                  </div>

                  {published && (
                    <div className="mx-6 mb-5 flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: '#dcfce7' }}>
                      <Check style={{ width: 16, height: 16, color: '#15803d' }} />
                      <p style={{ fontSize: 'var(--text-sm)', color: '#15803d' }}>Campaign published — this is a prototype, no message is actually sent.</p>
                    </div>
                  )}
                </>
              )}

              {/* Step 0: WhatsApp Configuration */}
              {activeStep === 0 && <>

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
                  <MultiplierCard
                    baseBid={template.bidAmount}
                    multiplier={multiplier}
                    onChange={setMultiplier}
                    helpText="Adjusts your template bid for this campaign. 1.0× applies the base bid with no change."
                  >
                    <ReachEstimationWidget />
                  </MultiplierCard>
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
                  onClick={() => setActiveStep(1)}
                >
                  Next
                  <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>

              </>}
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

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
