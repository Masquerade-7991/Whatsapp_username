import { ChevronRight } from 'lucide-react'

interface Crumb {
  label: string
  href?: string
}

interface TopNavProps {
  crumbs: Crumb[]
  actions?: React.ReactNode
}

export function TopNav({ crumbs, actions }: TopNavProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
      <nav className="flex items-center gap-1" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight style={{ width: 14, height: 14 }} />}
            <span style={{ color: i === crumbs.length - 1 ? 'var(--foreground)' : undefined, fontWeight: i === crumbs.length - 1 ? 'var(--font-weight-medium)' : undefined }}>
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
