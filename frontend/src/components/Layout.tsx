import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import Sidebar from './Sidebar'
import { ToastProvider } from '../hooks/useToast'

interface Props {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Layout({ theme, onToggleTheme }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className={`layout ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      <Sidebar
        theme={theme}
        onToggleTheme={onToggleTheme}
        onToggleMobile={() => setMobileOpen(false)}
      />
      <main className="main">
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <ToastProvider>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </ToastProvider>
      </main>
    </div>
  )
}
