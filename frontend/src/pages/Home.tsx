import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEntries } from '../api'
import type { EntrySummary } from '../types'
import Skeleton from '../components/Skeleton'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export default function Home() {
  const [entries, setEntries] = useState<EntrySummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listEntries()
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton variant="home" />

  return (
    <div>
      <h1>All Pages</h1>
      {entries.length === 0 ? (
        <div className="empty-state">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="empty-illustration">
            <rect x="20" y="15" width="80" height="90" rx="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
            <line x1="35" y1="40" x2="85" y2="40" stroke="currentColor" strokeWidth="2" opacity="0.2" />
            <line x1="35" y1="55" x2="75" y2="55" stroke="currentColor" strokeWidth="2" opacity="0.15" />
            <line x1="35" y1="70" x2="65" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.1" />
            <circle cx="60" cy="95" r="15" fill="var(--accent)" opacity="0.15" />
            <line x1="60" y1="88" x2="60" y2="102" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <line x1="53" y1="95" x2="67" y2="95" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          </svg>
          <p className="empty-text">No entries yet.</p>
          <Link to="/new" className="btn">Create the first page</Link>
        </div>
      ) : (
        <div className="entry-grid">
          {entries.map(entry => (
            <Link to={`/wiki/${encodeURIComponent(entry.title)}`} key={entry.title} className="entry-card">
              <h2 className="entry-card-title">{entry.title}</h2>
              <p className="entry-card-snippet">{entry.snippet || 'No content'}</p>
              <span className="entry-card-time">{timeAgo(entry.updated_at)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
