import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createEntry, listEntries } from '../api'
import { useTheme } from '../hooks/useTheme'
import { useToast } from '../hooks/useToast'
import Loading from '../components/Loading'

export default function NewEntry() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [titleError, setTitleError] = useState('')
  const [existingTitles, setExistingTitles] = useState<string[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    listEntries().then(entries => setExistingTitles(entries.map(e => e.title))).catch(() => {})
  }, [])

  useEffect(() => {
    const t = title.trim().toLowerCase()
    if (!t) {
      setTitleError('')
      return
    }
    if (existingTitles.some(e => e.toLowerCase() === t)) {
      setTitleError('An entry with this title already exists.')
    } else {
      setTitleError('')
    }
  }, [title, existingTitles])

  const onChange = useCallback((value: string) => {
    setContent(value)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title cannot be empty.')
      return
    }
    const savedTitle = title.trim()
    const savedContent = content
    setSubmitting(true)
    navigate(`/wiki/${encodeURIComponent(savedTitle)}`)
    try {
      await createEntry(savedTitle, savedContent)
      addToast('Entry created!', 'success')
    } catch (err: unknown) {
      navigate('/')
      setError(err instanceof Error ? err.message : 'Failed to create entry.')
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Create New Page</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="entry-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter page title"
            disabled={submitting}
            className={titleError ? 'input-error' : ''}
          />
          {titleError && <span className="field-hint hint-error">{titleError}</span>}
          {!titleError && title.trim() && <span className="field-hint hint-ok">Title is available</span>}
        </div>
        <div className="form-group split-pane">
          <div className="pane">
            <label htmlFor="content">Markdown Content <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="md-help">(Markdown help)</a></label>
            <CodeMirror
              id="content"
              value={content}
              onChange={onChange}
              placeholder="Enter Markdown content"
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
        <button type="submit" className="btn" disabled={submitting || !!titleError}>
          {submitting && <Loading size="small" />}
          {submitting ? ' Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}
