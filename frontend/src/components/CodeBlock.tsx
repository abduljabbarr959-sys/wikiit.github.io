import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react'

const LazyHighlighter = lazy(() =>
  import('./SyntaxHighlighterLight').then(m => ({ default: m.default }))
)

function getHighlighterStyles(theme: string) {
  if (theme === 'dark') {
    return import('react-syntax-highlighter/dist/esm/styles/prism').then(m => m.oneDark)
  }
  return import('react-syntax-highlighter/dist/esm/styles/prism').then(m => m.oneLight)
}

export default function CodeBlock({ code, language, theme }: { code: string; language: string; theme: string }) {
  const [style, setStyle] = useState<{ [key: string]: CSSProperties } | null>(null)

  useEffect(() => {
    getHighlighterStyles(theme).then(setStyle)
  }, [theme])

  if (!style) return <pre><code>{code}</code></pre>

  return (
    <Suspense fallback={<pre><code>{code}</code></pre>}>
      <LazyHighlighter style={style} language={language} code={code} />
    </Suspense>
  )
}
