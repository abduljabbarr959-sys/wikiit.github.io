import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { listEntries } from '../api'
import type { EntrySummary } from '../types'
import Skeleton from '../components/Skeleton'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<EntrySummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) {
      setResults([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    listEntries(query)
      .then(entries => { if (!cancelled) setResults(entries) })
      .catch(() => { if (!cancelled) setResults([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [query])

  const highlight = (text: string, term: string) => {
    if (!term) return text
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase()
        ? <strong key={i}>{part}</strong>
        : part
    )
  }

  if (loading) return <Skeleton variant="search" />

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      {results.length === 0 ? (
        <div className="empty-state">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="empty-illustration">
            <circle cx="40" cy="40" r="18" stroke="currentColor" strokeWidth="2.5" opacity="0.3" fill="none" />
            <line x1="53" y1="53" x2="70" y2="70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
            <line x1="78" y1="72" x2="88" y2="82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
          </svg>
          <p className="empty-text">No results found.</p>
        </div>
      ) : (
        <div className="entry-grid">
          {results.map(entry => (
            <Link to={`/wiki/${encodeURIComponent(entry.title)}`} key={entry.title} className="entry-card">
              <h2 className="entry-card-title">{highlight(entry.title, query)}</h2>
              <p className="entry-card-snippet">{entry.snippet || 'No content'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
