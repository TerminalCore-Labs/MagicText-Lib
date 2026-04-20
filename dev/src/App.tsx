import { useState } from 'react'
import { MagicTextEditor, registerLocale } from 'magic-text'
import type { JSONContent, ContentType, Variable, Translations, TTSCharacter } from 'magic-text'
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
  tts: { insertTTS: 'Assigner une voix', popoverAriaLabel: 'Attribution de voix', characterLabel: 'Personnage', characterPlaceholder: 'Nom du personnage…', voiceLabel: 'Voix / modèle', voiceSelectDefault: 'Sélectionner une voix…', inflectionLabel: 'Inflexion', inflectionSelectDefault: 'Sélectionner une inflexion…', applyButton: 'Appliquer', removeButton: 'Supprimer la marque' },
  variableNode: { fromLabel: 'Du', toLabel: 'Au', clickToFill: (l) => `Cliquez pour remplir ${l}`, variableTitle: (l, v) => `${l} : ${v}` },
}

registerLocale('fr', fr)

const INITIAL_HTML = `<h2>Welcome to MagicText</h2><p>This is a <strong>rich text editor</strong> built with <em>TipTap</em>. Try editing the content!</p><ul><li>Bold, italic, underline</li><li>Headings and lists</li><li>Links and images</li></ul><p><span data-type="tts" data-character-id="narrator" data-character-name="Narrator" data-voice="en-us-neutral-1" data-color="#6366f1" style="--tts-color: #6366f1; --tts-bg: rgba(99,102,241,0.13);" class="magic-text-editor__tts">In the beginning, there was silence.</span> Then, from the depths of the forest, a voice rang out:</p><p><span data-type="tts" data-character-id="alice" data-character-name="Alice" data-voice="en-us-female-1" data-inflection="excited" data-color="#10b981" style="--tts-color: #10b981; --tts-bg: rgba(16,185,129,0.13);" class="magic-text-editor__tts">Curiouser and curiouser!</span></p>`

const TTS_CHARACTERS: TTSCharacter[] = [
  { id: 'narrator', name: 'Narrator', voices: ['en-us-neutral-1', 'en-us-neutral-2'], color: '#6366f1' },
  { id: 'alice', name: 'Alice', voices: ['en-us-female-1', 'en-us-female-3'], color: '#10b981' },
  { id: 'cheshire', name: 'Cheshire Cat', voices: ['en-us-male-2', 'en-us-male-4'], color: '#f59e0b' },
  { id: 'queen', name: 'Queen of Hearts', voices: ['en-us-female-2'], color: '#ef4444' },
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

export default function App() {
  const [locale, setLocale] = useState<Locale>('en')
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
        key={locale}
        locale={locale}
        content={content}
        inputType={inputType}
        outputType={outputType}
        onChange={handleChange}
        placeholder="Start writing something..."
        editable={editable}
        variables={EXAMPLE_VARIABLES}
        onVariableAdd={(v) => console.log('[dev] variable added:', v)}
        ttsCharacters={TTS_CHARACTERS}
        ttsInflections={TTS_INFLECTIONS}
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
