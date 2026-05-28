import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TemplateList } from '@/pages/TemplateList'
import { TemplateCreation } from '@/pages/TemplateCreation'
import { CampaignSend } from '@/pages/CampaignSend'
import { Reports } from '@/pages/Reports'
import { BusinessProfile } from '@/pages/BusinessProfile'
import { DevToolbar } from '@/components/DevToolbar'
import { FeatureProvider } from '@/context/FeatureContext'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <p style={{ fontSize: '1.125rem', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }}>{title}</p>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Not part of this prototype</p>
    </div>
  )
}

export default function App() {
  return (
    <FeatureProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/templates" replace />} />
            <Route path="/templates" element={<TemplateList />} />
            <Route path="/templates/new" element={<TemplateCreation />} />
            <Route path="/campaigns" element={<CampaignSend />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
            <Route path="/governance" element={<PlaceholderPage title="Governance" />} />
            <Route path="/flows" element={<PlaceholderPage title="Flows" />} />
            <Route path="/shortlinks" element={<PlaceholderPage title="Shortlinks" />} />
            <Route path="/profiles/edit" element={<BusinessProfile />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            <Route path="/developers" element={<PlaceholderPage title="Developers" />} />
            <Route path="*" element={<Navigate to="/templates" replace />} />
          </Routes>
        </Layout>
        <DevToolbar />
      </BrowserRouter>
    </FeatureProvider>
  )
}
