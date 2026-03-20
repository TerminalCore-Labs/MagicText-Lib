import { useState } from 'react'
import { MagicEditor } from 'magic-text'
import type { JSONContent, ContentType } from 'magic-text'
import '../../src/styles/editor.css'

const INITIAL_HTML = `<h2>Welcome to MagicText</h2><p>This is a <strong>rich text editor</strong> built with <em>TipTap</em>. Try editing the content!</p><ul><li>Bold, italic, underline</li><li>Headings and lists</li><li>Links and images</li></ul>`

export default function App() {
  const [editable, setEditable] = useState(true)
  const [inputType, setInputType] = useState<ContentType>('html')
  const [outputType, setOutputType] = useState<ContentType>('html')

  const [htmlContent, setHtmlContent] = useState<string>(INITIAL_HTML)
  const [jsonContent, setJsonContent] = useState<JSONContent | null>(null)

  const content = inputType === 'json' && jsonContent ? jsonContent : htmlContent
  const output = outputType === 'json' ? jsonContent : htmlContent

  function handleChange(value: string | JSONContent) {
    if (outputType === 'json') setJsonContent(value as JSONContent)
    else setHtmlContent(value as string)
  }

  const btnStyle = (active: boolean) => ({
    padding: '6px 14px',
    borderRadius: 6,
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    background: active ? '#dbeafe' : '#fff',
    color: active ? '#1d4ed8' : 'inherit',
  })

  return (
    <div style={{ maxWidth: 860, margin: '40px auto', padding: '0 24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>MagicText Dev</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Development playground — not included in the npm package.</p>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setEditable((v) => !v)} style={btnStyle(!editable)}>
          {editable ? 'Switch to Read-only' : 'Switch to Editable'}
        </button>

        <span style={{ color: '#94a3b8', fontSize: 13 }}>inputType:</span>
        <button onClick={() => setInputType('html')} style={btnStyle(inputType === 'html')}>html</button>
        <button onClick={() => setInputType('json')} style={btnStyle(inputType === 'json')}>json</button>

        <span style={{ color: '#94a3b8', fontSize: 13 }}>outputType:</span>
        <button onClick={() => setOutputType('html')} style={btnStyle(outputType === 'html')}>html</button>
        <button onClick={() => setOutputType('json')} style={btnStyle(outputType === 'json')}>json</button>

        <button
          onClick={() => { setHtmlContent(''); setJsonContent(null) }}
          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>

      <MagicEditor
        content={content}
        inputType={inputType}
        outputType={outputType}
        onChange={handleChange}
        placeholder="Start writing something..."
        editable={editable}
      />

      <details style={{ marginTop: 32 }}>
        <summary style={{ cursor: 'pointer', color: '#475569', fontWeight: 500, marginBottom: 8 }}>
          Output ({outputType})
        </summary>
        <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, overflow: 'auto', fontSize: 13, lineHeight: 1.6 }}>
          {outputType === 'json' ? JSON.stringify(output, null, 2) : String(output)}
        </pre>
      </details>
    </div>
  )
}
