import { Suspense, useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getEntry, deleteEntry } from '../api'
import type { Entry as EntryType } from '../types'
import CodeBlock from '../components/CodeBlock'
import Skeleton from '../components/Skeleton'
import Loading from '../components/Loading'
import { useToast } from '../hooks/useToast'

export default function Entry() {
  const { title } = useParams<{ title: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [entry, setEntry] = useState<EntryType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!title) return
    let cancelled = false
    setEntry(null)
    setLoading(true)
    setError('')
    getEntry(title)
      .then(entry => { if (!cancelled) setEntry(entry) })
      .catch(() => { if (!cancelled) setError(`The page "${title}" was not found.`) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [title])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!title || !confirm(`Delete "${title}"? This cannot be undone.`)) return
    const deletedTitle = title
    setDeleting(true)
    addToast(`"${deletedTitle}" deleted.`, 'success')
    navigate('/')
    try {
      await deleteEntry(deletedTitle)
    } catch {
      navigate(`/wiki/${encodeURIComponent(deletedTitle)}`)
      addToast('Failed to delete entry.', 'error')
      setDeleting(false)
    }
  }

  if (loading) return <Skeleton variant="entry" />
  if (error) return <ErrorPage message={error} />
  if (!entry) return null

  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'

  return (
    <div>
      <div className="entry-header">
        <div>
          {entry.author && (
            <p className="entry-meta">
              By <strong>{entry.author}</strong> &middot; Last updated {new Date(entry.updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="entry-menu-wrapper" ref={menuRef}>
          <button className="entry-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Page actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="4" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="10" cy="16" r="1.5" />
            </svg>
          </button>
          {menuOpen && (
            <div className="entry-dropdown">
              <Link to={`/edit/${encodeURIComponent(entry.title)}`} className="dropdown-item" onClick={() => setMenuOpen(false)}>Edit</Link>
              <button className="dropdown-item dropdown-item-danger" onClick={handleDelete} disabled={deleting}>
                {deleting && <Loading size="small" />}
                {deleting ? ' Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="entry-content markdown-body">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              const code = String(children).replace(/\n$/, '')
              if (match) {
                return (
                  <Suspense fallback={<code {...props}>{children}</code>}>
                    <CodeBlock code={code} language={match[1]} theme={theme} />
                  </Suspense>
                )
              }
              return <code className={className} {...props}>{children}</code>
            },
          }}
        >
          {entry.content}
        </Markdown>
      </div>
    </div>
  )
}

function ErrorPage({ message }: { message: string }) {
  return (
    <div className="error-page">
      <h1>Error</h1>
      <p>{message}</p>
      <Link to="/" className="btn">Return to Home</Link>
    </div>
  )
}
