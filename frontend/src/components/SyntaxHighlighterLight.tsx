import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go'
import graphql from 'react-syntax-highlighter/dist/esm/languages/prism/graphql'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby'
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'

SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('c', c)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('go', go)
SyntaxHighlighter.registerLanguage('graphql', graphql)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('md', markdown)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('py', python)
SyntaxHighlighter.registerLanguage('ruby', ruby)
SyntaxHighlighter.registerLanguage('rb', ruby)
SyntaxHighlighter.registerLanguage('rust', rust)
SyntaxHighlighter.registerLanguage('rs', rust)
SyntaxHighlighter.registerLanguage('sql', sql)
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('ts', typescript)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('yml', yaml)

import type { CSSProperties } from 'react'

interface Props {
  style: { [key: string]: CSSProperties }
  language: string
  code: string
}

export default function CodeHighlighter({ style, language, code }: Props) {
  return (
    <SyntaxHighlighter style={style} language={language} PreTag="div">
      {code}
    </SyntaxHighlighter>
  )
}
