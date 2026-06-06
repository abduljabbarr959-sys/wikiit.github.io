import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listEntries } from '../api'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

interface Props {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onToggleMobile: () => void
}

export default function Sidebar({ theme, onToggleTheme, onToggleMobile }: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const entries = await listEntries(query.trim())
        setSuggestions(entries.map(e => e.title))
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowSuggestions(false)
      onToggleMobile()
    }
  }

  const handleSuggestionClick = (title: string) => {
    setQuery('')
    setShowSuggestions(false)
    navigate(`/wiki/${encodeURIComponent(title)}`)
    onToggleMobile()
  }

  const handleLogout = async () => {
    await logout()
    onToggleMobile()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2><Link to="/wiki/wikiit" onClick={onToggleMobile}>wikiit</Link></h2>
        <button className="mobile-close" onClick={onToggleMobile} aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="search-wrapper" ref={searchRef}>
        <form onSubmit={handleSearch} className="search-form">
          <input
            className="search-input"
            type="text"
            name="q"
            placeholder="Search Encyclopedia"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => { if (suggestions.length) setShowSuggestions(true) }}
            autoComplete="off"
          />
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-dropdown">
            {suggestions.map(title => (
              <button key={title} className="search-suggestion" onClick={() => handleSuggestionClick(title)}>
                {title}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <Link to="/" onClick={onToggleMobile}>Home</Link>
        <Link to="/new" onClick={onToggleMobile}>Create New Page</Link>
        <span className="nav-divider" />
        {user ? (
          <>
            <span className="nav-user">Logged in as <strong>{user.username}</strong></span>
            <button className="nav-link-btn" onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={onToggleMobile}>Log In</Link>
            <Link to="/register" onClick={onToggleMobile}>Register</Link>
          </>
        )}
      </nav>

      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </aside>
  )
}
