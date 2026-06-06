import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getEntry, updateEntry } from '../api'
import { useTheme } from '../hooks/useTheme'
import { useToast } from '../hooks/useToast'
import Skeleton from '../components/Skeleton'
import Loading from '../components/Loading'

export default function EditEntry() {
  const { title } = useParams<{ title: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { theme } = useTheme()
  const { addToast } = useToast()

  const onChange = useCallback((value: string) => {
    setContent(value)
  }, [])

  useEffect(() => {
    if (!title) return
    getEntry(title)
      .then(entry => setContent(entry.content))
      .catch(() => setError(`The page "${title}" was not found.`))
      .finally(() => setLoading(false))
  }, [title])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title) return
    setError('')
    const savedContent = content
    const savedTitle = title
    setSubmitting(true)
    navigate(`/wiki/${encodeURIComponent(savedTitle)}`)
    try {
      await updateEntry(savedTitle, savedContent)
      addToast('Changes saved!', 'success')
    } catch (err: unknown) {
      navigate(`/edit/${encodeURIComponent(savedTitle)}`)
      setError(err instanceof Error ? err.message : 'Failed to update entry.')
      setSubmitting(false)
    }
  }

  if (loading) return <Skeleton variant="form" />

  if (error && !content) {
    return (
      <div className="error-page">
        <h1>Error</h1>
        <p>{error}</p>
        <Link to="/" className="btn">Return to Home</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Edit {title}</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="entry-form">
        <div className="form-group split-pane">
          <div className="pane">
            <label htmlFor="content">Markdown Content <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="md-help">(Markdown help)</a></label>
            <CodeMirror
              id="content"
              value={content}
              onChange={onChange}
              extensions={[markdown({ base: markdownLanguage })]}
              theme={theme === 'dark' ? 'dark' : 'light'}
              height="400px"
              basicSetup={{
                lineNumbers: false,
                foldGutter: false,
                highlightActiveLine: true,
                autocompletion: false,
              }}
            />
          </div>
          <div className="pane">
            <label>Preview</label>
            <div className="preview markdown-body">
              <Markdown remarkPlugins={[remarkGfm]}>{content || '*Nothing to preview*'}</Markdown>
            </div>
          </div>
        </div>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting && <Loading size="small" />}
          {submitting ? ' Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}
