import { useState, useEffect, type CSSProperties } from 'react'
import { MagicTextEditor, registerLocale } from 'magic-text'
import type { JSONContent, ContentType, Variable, Translations, TTSMark } from 'magic-text'
import '../../src/styles/editor.css'

// Example of a community-contributed locale (French)
const fr: Translations = {
  toolbar: { ariaLabel: 'Mise en forme' },
  history: { undo: 'Annuler', redo: 'Rétablir' },
  formatting: { bold: 'Gras', italic: 'Italique', underline: 'Souligné', strikethrough: 'Barré', highlight: 'Surligner' },
  headings: { heading1: 'Titre 1', heading2: 'Titre 2', heading3: 'Titre 3' },
  blocks: { bulletList: 'Liste à puces', orderedList: 'Liste numérotée', blockquote: 'Citation', codeBlock: 'Bloc de code', horizontalRule: 'Ligne horizontale' },
  alignment: { alignLeft: 'Aligner à gauche', alignCenter: 'Centrer', alignRight: 'Aligner à droite' },
  link: { insertLink: 'Insérer un lien', editorAriaLabel: 'Éditeur de lien', textLabel: 'Texte', textPlaceholder: 'Texte du lien…', urlLabel: 'URL', urlPlaceholder: 'https://…', applyButton: 'Appliquer', removeLinkButton: 'Supprimer le lien' },
  image: { insertImage: 'Insérer une image', inserterAriaLabel: 'Insertion d\'image', urlTab: 'URL', uploadTab: 'Téléverser', imageUrlLabel: 'URL de l\'image', urlPlaceholder: 'https://…', altTextLabel: 'Texte alternatif', altTextPlaceholder: 'Description de l\'image…', insertButton: 'Insérer', dropzoneHint: 'Cliquez ou glissez une image ici' },
  variables: { insertVariable: 'Insérer une variable', pickerAriaLabel: 'Sélecteur de variables', addCustomVariable: '+ Ajouter une variable…', back: '← Retour', backAriaLabel: 'Retour à la liste', newVariableTitle: 'Nouvelle variable', namePlaceholder: 'Nom de la variable…', addButton: 'Ajouter', addOptionButton: '+', addOptionPlaceholder: 'Ajouter une option…', removeOption: (o) => `Supprimer ${o}`, typeLabels: { text: 'Champ texte', textarea: 'Zone de texte', select: 'Liste déroulante', date: 'Date', daterange: 'Plage de dates' } },
  tts: { insertTTS: 'Assigner une voix', popoverAriaLabel: 'Attribution de voix', marksTab: 'Marques enregistrées', assignTab: 'Assigner', markLabel: 'Marque', markPlaceholder: 'Nom de la marque…', voiceLabel: 'Voix / modèle', voiceSelectDefault: 'Sélectionner une voix…', inflectionLabel: 'Inflexion', inflectionSelectDefault: 'Sélectionner une inflexion…', applyButton: 'Appliquer', playButton: 'Lire', stopButton: 'Arrêter', removeButton: 'Supprimer la marque' },
  variableNode: { fromLabel: 'Du', toLabel: 'Au', clickToFill: (l) => `Cliquez pour remplir ${l}`, variableTitle: (l, v) => `${l} : ${v}` },
}

registerLocale('fr', fr)

const INITIAL_HTML = `<h2>Welcome to MagicText</h2><p>This is a <strong>rich text editor</strong> built with <em>TipTap</em>. Try editing the content!</p><ul><li>Bold, italic, underline</li><li>Headings and lists</li><li>Links and images</li></ul><p><span data-type="tts" data-character-id="narrator" data-character-name="Narrator" data-voice="en-us-neutral-1" data-color="#6366f1" style="--tts-color: #6366f1; --tts-bg: rgba(99,102,241,0.13);" class="magic-text-editor__tts">In the beginning, there was silence.</span> Then, from the depths of the forest, a voice rang out:</p><p><span data-type="tts" data-character-id="alice" data-character-name="Alice" data-voice="en-us-female-1" data-inflection="excited" data-color="#10b981" style="--tts-color: #10b981; --tts-bg: rgba(16,185,129,0.13);" class="magic-text-editor__tts">Curiouser and curiouser!</span></p>`

const TTS_CHARACTERS: TTSMark[] = [
  { id: 'narrator', name: 'Narrator', voices: ['en-us-neutral-1', 'en-us-neutral-2'] },
  { id: 'alice', name: 'Alice', voices: ['en-us-female-1', 'en-us-female-3'] },
  { id: 'cheshire', name: 'Cheshire Cat', voices: ['en-us-male-2', 'en-us-male-4'] },
  { id: 'queen', name: 'Queen of Hearts', voices: ['en-us-female-2'] },
]

const TTS_INFLECTIONS = ['neutral', 'excited', 'sad', 'angry', 'whispering', 'dramatic']

const EXAMPLE_VARIABLES: Variable[] = [
  { label: 'First name' },
  { label: 'Last name' },
  { label: 'Email' },
  { label: 'Company' },
  { label: 'Phone' },
]

const LOCALES = ['en', 'es', 'fr'] as const
type Locale = typeof LOCALES[number]

type ColorScheme = 'light' | 'dark'

const DARK_TOKENS: Record<string, string> = {
  '--mte-bg': '#1f2937',
  '--mte-color': '#f1f5f9',
  '--mte-border-color': '#4b5563',
  '--mte-toolbar-bg': '#111827',
  '--mte-toolbar-border': '#374151',
  '--mte-btn-color': '#cbd5e1',
  '--mte-btn-hover-bg': '#374151',
  '--mte-btn-hover-color': '#f8fafc',
  '--mte-btn-active-bg': '#1e3a5f',
  '--mte-btn-active-color': '#bfdbfe',
  '--mte-icon-color': '#cbd5e1',
  '--mte-divider-color': '#4b5563',
  '--mte-caret-color': '#60a5fa',
  '--mte-selection-bg': '#1e3a5f',
  '--mte-placeholder-color': '#9ca3af',
  '--mte-var-chip-bg': '#374151',
  '--mte-var-chip-color': '#e5e7eb',
  '--mte-var-chip-border': '#6b7280',
  '--mte-var-chip-hover-bg': '#4b5563',
  '--mte-var-filled-bg': '#14532d',
  '--mte-var-filled-color': '#86efac',
  '--mte-var-filled-border': '#166534',
  '--mte-var-filled-hover-bg': '#166534',
  '--mte-dropdown-bg': '#1f2937',
  '--mte-dropdown-border': '#4b5563',
  '--mte-dropdown-shadow': '0 2px 8px rgba(0,0,0,0.5)',
  '--mte-dropdown-btn-hover-bg': '#374151',
  '--mte-dropdown-add-btn-bg': '#3b82f6',
  '--mte-dropdown-add-btn-hover-bg': '#2563eb',
}

export default function App() {
  const [scheme, setScheme] = useState<ColorScheme>('light')
  const [locale, setLocale] = useState<Locale>('en')
  const [editable, setEditable] = useState(true)

  useEffect(() => {
    document.body.style.background = scheme === 'dark' ? '#0f172a' : '#f8fafc'
    document.body.style.color = scheme === 'dark' ? '#f1f5f9' : '#0f172a'
    return () => {
      document.body.style.background = ''
      document.body.style.color = ''
    }
  }, [scheme])
  const [ttsPlaying, setTtsPlaying] = useState(false)
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

  const editorTokens = scheme === 'dark' ? DARK_TOKENS : {}

  return (
    <div style={{ maxWidth: 860, margin: '40px auto', padding: '0 24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ margin: 0 }}>MagicText Dev</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setScheme('light')} style={btnStyle(scheme === 'light')}>☀ Light</button>
          <button onClick={() => setScheme('dark')} style={{ ...btnStyle(scheme === 'dark'), background: scheme === 'dark' ? '#1e3a5f' : '#1e293b', color: scheme === 'dark' ? '#93c5fd' : '#f1f5f9', borderColor: scheme === 'dark' ? '#1e3a5f' : '#334155' }}>☾ Dark</button>
        </div>
      </div>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Development playground — not included in the npm package.</p>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setEditable((v) => !v)} style={btnStyle(!editable)}>
          {editable ? 'Switch to Read-only' : 'Switch to Editable'}
        </button>

        <span style={{ color: '#94a3b8', fontSize: 13 }}>inputType:</span>
        <button onClick={() => setInputType('html')} style={btnStyle(inputType === 'html')}>html</button>
        <button onClick={() => setInputType('json')} style={btnStyle(inputType === 'json')}>json</button>

        <button
          onClick={() => { setHtmlContent(''); setJsonContent(null) }}
          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>locale:</span>
        {LOCALES.map((l) => (
          <button key={l} onClick={() => setLocale(l)} style={btnStyle(locale === l)}>{l}</button>
        ))}
        <span style={{ color: '#94a3b8', fontSize: 12 }}>
          ({locale === 'fr' ? 'registered via registerLocale()' : 'built-in'})
        </span>
      </div>

      <MagicTextEditor
        key={locale + scheme}
        locale={locale}
        content={content}
        inputType={inputType}
        outputType={outputType}
        onChange={handleChange}
        placeholder="Start writing something..."
        editable={editable}
        variables={EXAMPLE_VARIABLES}
        onVariableAdd={(v) => console.log('[dev] variable added:', v)}
        ttsPlaying={ttsPlaying}
        onTTSPlay={(p) => { console.log('[dev] TTS play:', p); setTtsPlaying(true) }}
        onTTSStop={() => { console.log('[dev] TTS stop'); setTtsPlaying(false) }}
        ttsMarks={TTS_CHARACTERS}
        ttsInflections={TTS_INFLECTIONS}
        style={editorTokens as CSSProperties}
      />

      <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>outputType:</span>
        <button onClick={() => setOutputType('html')} style={btnStyle(outputType === 'html')}>html</button>
        <button onClick={() => setOutputType('json')} style={btnStyle(outputType === 'json')}>json</button>
      </div>
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
