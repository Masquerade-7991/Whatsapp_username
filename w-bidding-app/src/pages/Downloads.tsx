import { useState } from 'react'
import { File, Download as DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TopNav } from '@/components/layout/TopNav'
import { useDownloads } from '@/context/DownloadsContext'
import { cn } from '@/lib/utils'

const CHANNEL_TABS = ['SMS Outbound', 'SMS Inbound', 'RCS', 'WHATSAPP'] as const
const REPORT_TABS = ['Downloaded Reports', 'Inprocess Reports'] as const

export function Downloads() {
  const { downloads } = useDownloads()
  const [channel, setChannel] = useState<typeof CHANNEL_TABS[number]>('WHATSAPP')
  const [reportTab, setReportTab] = useState<typeof REPORT_TABS[number]>('Downloaded Reports')

  const showList = channel === 'WHATSAPP' && reportTab === 'Downloaded Reports'

  return (
    <div className="flex flex-col h-full">
      <TopNav crumbs={[{ label: 'Downloads' }]} />

      <div className="flex-1 overflow-y-auto bg-muted/20">
        <div className="bg-background px-6 pt-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            {CHANNEL_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setChannel(tab)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  tab === channel
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-1">
            {REPORT_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setReportTab(tab)}
                className={cn(
                  'px-5 py-2 rounded-md text-sm font-medium transition-colors',
                  reportTab === tab
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:bg-muted bg-background'
                )}
                style={{ cursor: 'pointer' }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-border overflow-hidden bg-background">
            {!showList || downloads.length === 0 ? (
              <div className="px-4 py-12 text-center" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                {channel !== 'WHATSAPP'
                  ? 'Not part of this prototype'
                  : reportTab === 'Inprocess Reports'
                  ? 'No reports in process'
                  : 'No downloaded reports yet'}
              </div>
            ) : (
              downloads.map((d, i) => (
                <div
                  key={d.id}
                  className="flex items-center gap-4 px-4 py-4"
                  style={{ borderBottom: i < downloads.length - 1 ? '1px solid var(--border)' : undefined }}
                >
                  <File style={{ width: 20, height: 20, color: 'var(--muted-foreground)', flexShrink: 0 }} />
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', width: 260, flexShrink: 0 }}>
                    {d.name}
                  </p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', width: 140, flexShrink: 0 }}>
                    {d.createdAt}
                  </p>
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full rounded-full" style={{ height: 4, background: 'var(--border)' }}>
                      <div className="rounded-full" style={{ height: 4, width: '100%', background: 'var(--border)' }} />
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>File is ready for download</span>
                  </div>
                  <Button size="sm" className="flex items-center gap-1.5 shrink-0">
                    <DownloadIcon style={{ width: 14, height: 14 }} />
                    Download
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
