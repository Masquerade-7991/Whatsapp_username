import { Link, useLocation } from 'react-router-dom'
import {
  Radio, BarChart2, FileText, GitFork, Zap, Settings, Code2, Download, ChevronDown, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useDownloads } from '@/context/DownloadsContext'

interface NavItem {
  label: string
  icon: React.ReactNode
  href?: string
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    label: 'Broadcast',
    icon: <Radio style={{ width: 16, height: 16 }} />,
    children: [
      { label: 'Campaigns', href: '/campaigns' },
      { label: 'Governance', href: '/governance' },
    ],
  },
  {
    label: 'Analyse',
    icon: <BarChart2 style={{ width: 16, height: 16 }} />,
    children: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Reports', href: '/reports' },
    ],
  },
  {
    label: 'Templates',
    icon: <FileText style={{ width: 16, height: 16 }} />,
    href: '/templates',
  },
  {
    label: 'Flows',
    icon: <GitFork style={{ width: 16, height: 16 }} />,
    href: '/flows',
  },
  {
    label: 'Shortlinks',
    icon: <Zap style={{ width: 16, height: 16 }} />,
    href: '/shortlinks',
  },
  {
    label: 'Settings',
    icon: <Settings style={{ width: 16, height: 16 }} />,
    href: '/settings',
  },
  {
    label: 'Developers',
    icon: <Code2 style={{ width: 16, height: 16 }} />,
    href: '/developers',
  },
]

function NavItemRow({ item }: { item: NavItem }) {
  const location = useLocation()
  const [open, setOpen] = useState(() => {
    if (item.children) {
      return item.children.some(c => location.pathname.startsWith(c.href))
    }
    return false
  })

  const isActive = item.href
    ? location.pathname === item.href || location.pathname.startsWith(item.href + '/')
    : item.children?.some(c => location.pathname.startsWith(c.href))

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            isActive && 'text-sidebar-accent-foreground'
          )}
          style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}
        >
          {item.icon}
          <span className="flex-1 text-left">{item.label}</span>
          {open
            ? <ChevronDown style={{ width: 14, height: 14 }} />
            : <ChevronRight style={{ width: 14, height: 14 }} />
          }
        </button>
        {open && (
          <div className="ml-6 mt-0.5 flex flex-col gap-0.5">
            {item.children.map(child => {
              const childActive = location.pathname === child.href || location.pathname.startsWith(child.href + '/')
              return (
                <Link
                  key={child.href}
                  to={child.href}
                  className={cn(
                    'px-3 py-1.5 rounded-lg transition-colors',
                    childActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                  style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', display: 'block' }}
                >
                  {child.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      to={item.href!}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      )}
      style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}
    >
      {item.icon}
      {item.label}
    </Link>
  )
}

function DownloadsLink() {
  const { downloads } = useDownloads()

  return (
    <Link
      to="/downloads"
      className="flex items-center gap-2 px-3 py-1.5 text-sidebar-foreground cursor-pointer hover:bg-sidebar-accent rounded-lg transition-colors"
    >
      <Download style={{ width: 16, height: 16 }} />
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>Downloads</span>
      {downloads.length > 0 && (
        <span
          className="ml-auto rounded-full px-1.5 py-0.5"
          style={{ fontSize: '11px', fontWeight: 'var(--font-weight-semi-bold)', background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          {downloads.length}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside
      className="flex flex-col w-56 shrink-0 border-r border-sidebar-border bg-sidebar h-screen sticky top-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground"
          style={{ fontWeight: 'var(--font-weight-bold)', fontSize: '14px' }}
        >
          H
        </div>
        <span style={{ fontWeight: 'var(--font-weight-semi-bold)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
          Helo.ai
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 py-4 overflow-y-auto">
        {navItems.map(item => (
          <NavItemRow key={item.label} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3 flex flex-col gap-1">
        <DownloadsLink />
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
            style={{ fontSize: '11px', fontWeight: 'var(--font-weight-bold)' }}>
            H
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: '12px', fontWeight: 'var(--font-weight-semi-bold)', color: 'var(--foreground)' }} className="truncate">
              Helo_Staging1
            </div>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', paddingLeft: '12px', paddingBottom: '4px' }}>
          © 2026 Helo.ai. All Rights Reserved.
        </div>
      </div>
    </aside>
  )
}
