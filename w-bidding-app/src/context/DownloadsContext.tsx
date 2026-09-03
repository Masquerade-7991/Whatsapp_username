import React, { createContext, useCallback, useContext, useState } from 'react'

export interface DownloadItem {
  id: string
  name: string
  createdAt: string
}

interface DownloadsContextValue {
  downloads: DownloadItem[]
  addDownload: (fileName: string) => void
}

const DownloadsContext = createContext<DownloadsContextValue | null>(null)

export function DownloadsProvider({ children }: { children: React.ReactNode }) {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const addDownload = useCallback((fileName: string) => {
    setDownloads(d => [{ id: crypto.randomUUID(), name: fileName, createdAt: new Date().toLocaleString() }, ...d])
    setToastMessage('Your file is getting downloaded. Go to the Download section to check.')
    setTimeout(() => setToastMessage(null), 3000)
  }, [])

  return (
    <DownloadsContext.Provider value={{ downloads, addDownload }}>
      {children}
      {toastMessage && (
        <div
          className="fixed bottom-6 right-6 z-[100] rounded-lg border border-border bg-background shadow-lg px-4 py-3"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', maxWidth: 320 }}
        >
          {toastMessage}
        </div>
      )}
    </DownloadsContext.Provider>
  )
}

export function useDownloads() {
  const ctx = useContext(DownloadsContext)
  if (!ctx) throw new Error('useDownloads must be used inside DownloadsProvider')
  return ctx
}
