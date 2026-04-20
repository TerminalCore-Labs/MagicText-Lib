# MagicText

Rich text editor component for React, built on top of [TipTap](https://tiptap.dev).

## Installation

```bash
npm i tiptap-magictext
```

> **Peer dependencies:** `react` and `react-dom` >= 18 must be installed in your project.

## Usage

```tsx
import { MagicTextEditor } from 'tiptap-magictext'

export default function App() {
  return (
    <MagicTextEditor
      placeholder="Start writing..."
      onChange={(value) => console.log(value)}
    />
  )
}
```

### Controlled mode (HTML)

```tsx
const [html, setHtml] = useState('')

<MagicTextEditor
  content={html}
  onChange={(value) => setHtml(value as string)}
/>
```

### Controlled mode (JSON)

Use `inputType` and `outputType` to work with TipTap's JSON format instead of HTML strings:

```tsx
import type { JSONContent } from 'tiptap-magictext'

const [doc, setDoc] = useState<JSONContent | null>(null)

<MagicTextEditor
  content={doc ?? undefined}
  inputType="json"
  outputType="json"
  onChange={(value) => setDoc(value as JSONContent)}
/>
```

### Read-only mode

```tsx
<MagicTextEditor content={html} editable={false} />
```

### Variables

Pass a list of variables to enable the variable picker in the toolbar. Variables are inserted as interactive chips; clicking a chip lets you fill in its value. Chips are non-interactive in read-only mode.

Each variable can optionally have a `type` that controls the input rendered when filling it:

```tsx
import type { Variable } from 'tiptap-magictext'

const variables: Variable[] = [
  { label: 'First name' },
  { label: 'Last name' },
  { label: 'Bio', type: 'textarea' },
  { label: 'Country', type: 'select', options: ['US', 'MX', 'AR'] },
  { label: 'Birthday', type: 'date' },
  { label: 'Vacation period', type: 'daterange' },
]

<MagicTextEditor
  variables={variables}
  onVariableAdd={(v) => console.log('new variable:', v)}
/>
```

#### Variable types

| `type`       | Input rendered when filling the chip |
| ------------ | ------------------------------------ |
| `'text'`     | Single-line text input (default)     |
| `'textarea'` | Multi-line text area                 |
| `'select'`   | Dropdown — requires `options: string[]` |
| `'date'`     | Date picker                          |
| `'daterange'`| Two date pickers (From / To)         |

The toolbar picker also lets users create **custom variables** on the fly. Clicking **+ Add custom variable…** opens a form where the user can set a name and choose a type. For `select` variables, options can be added before inserting.

## Props

| Prop               | Type                                              | Default               | Description                                                                              |
| ------------------ | ------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `content`          | `string \| JSONContent`                           | `''`                  | Content to display. Pass an HTML string or a JSONContent object depending on `inputType`. |
| `inputType`        | `'html' \| 'json'`                                | `'html'`              | Format of the `content` prop.                                                            |
| `outputType`       | `'html' \| 'json'`                                | `'html'`              | Format emitted by `onChange`, `onBlur`, and `onFocus` callbacks.                         |
| `onChange`         | `(value: string \| JSONContent) => void`          | —                     | Fired on every content change. Receives HTML string or JSONContent based on `outputType`.|
| `onBlur`           | `(value: string \| JSONContent) => void`          | —                     | Fired when the editor loses focus.                                                       |
| `onFocus`          | `(value: string \| JSONContent) => void`          | —                     | Fired when the editor gains focus.                                                       |
| `placeholder`      | `string`                                          | `'Write something...'`| Placeholder shown when the editor is empty.                                              |
| `editable`         | `boolean`                                         | `true`                | Toggles edit mode. Hides toolbar when `false`. Variables become non-interactive.         |
| `autofocus`        | `boolean \| 'start' \| 'end' \| 'all' \| number` | `false`               | Autofocus the editor on mount.                                                           |
| `className`        | `string`                                          | —                     | Extra class for the root wrapper.                                                        |
| `toolbarClassName` | `string`                                          | —                     | Extra class for the toolbar.                                                             |
| `contentClassName` | `string`                                          | —                     | Extra class for the content area.                                                        |
| `variables`        | `Variable[]`                                      | —                     | Variables available in the toolbar picker. Omit to hide the picker entirely.             |
| `onVariableAdd`    | `(variable: Variable) => void`                    | —                     | Called when the user adds a custom variable via the picker.                              |
| `locale`           | `string`                                          | `'en'`                | BCP 47 locale string. Built-in: `'en'`, `'es'`. Register others with `registerLocale()`. Changing after mount has no effect — use `key={locale}` to force remount. |
| `translations`     | `PartialTranslations`                             | —                     | Fine-grained string overrides applied on top of the resolved locale.                     |
| `ttsCharacters`    | `TTSCharacter[]`                                  | —                     | Characters for the TTS voice-assignment toolbar button. Omit to hide the button.         |
| `ttsInflections`   | `string[]`                                        | —                     | Global list of inflection options shown as a select. Omit to hide the inflection field.  |

### inputType / outputType

These two props decouple the format used to **feed** the component from the format used to **read** it back:

| `inputType` | `content` expects   |
| ----------- | ------------------- |
| `'html'`    | HTML string         |
| `'json'`    | `JSONContent` object|

| `outputType` | callbacks receive   |
| ------------ | ------------------- |
| `'html'`     | HTML string         |
| `'json'`     | `JSONContent` object|

When `outputType` changes at runtime the component immediately fires `onChange` with the current content in the new format so the consumer stays in sync.

## TTS extension

The TTS extension is an optional feature for audiobook and TTS workflows. It lets authors mark text ranges with a character, voice model, and inflection. The backend receives the data as HTML attributes for processing.

### Setup

Pass a list of characters to enable the microphone button in the toolbar:

```tsx
import type { TTSCharacter } from 'tiptap-magictext'

const characters: TTSCharacter[] = [
  { id: 'narrator', name: 'Narrator', voices: ['en-us-neutral-1', 'en-us-neutral-2'], color: '#6366f1' },
  { id: 'alice',    name: 'Alice',    voices: ['en-us-female-1', 'en-us-female-3'],   color: '#10b981' },
]

const inflections = ['neutral', 'excited', 'sad', 'whispering', 'dramatic']

<MagicTextEditor ttsCharacters={characters} ttsInflections={inflections} />
```

Omit the prop (or pass `undefined`) to hide the button entirely.

### `TTSCharacter` type

| Field    | Type       | Description                                                                  |
| -------- | ---------- | ---------------------------------------------------------------------------- |
| `id`     | `string`   | Unique identifier written to `data-character-id` in the output HTML.         |
| `name`   | `string`   | Display name shown in the editor popover and as the badge above marked text. |
| `voices` | `string[]` | Available TTS voice/model options. Rendered as a select when a character is selected. Omit to hide the voice field for that character. |
| `color`  | `string`   | Hex color for the editor highlight. Auto-assigned from a palette if omitted. |

### Usage

There are three ways to open the TTS popover:

| Trigger | How |
| ------- | --- |
| **Hover** | Select text, then hover over the selection for ~600 ms. The popover appears anchored to the selected text automatically. |
| **Toolbar button** | Click the microphone button in the toolbar at any time. |
| **Click existing mark** | Click any TTS-marked span in the editor to edit it. |

Once the popover is open:

1. Choose a character from the grid (or type a custom name).
2. If the character has `voices`, pick one from the dropdown. When no character is selected, all voices from all characters are shown.
3. If `ttsInflections` was provided, pick an inflection.
4. Click **Apply**.

The **Remove** button appears when the cursor is inside an existing TTS mark and strips the mark from the range.

### Output HTML

Each marked range is wrapped in a `<span>` with `data-*` attributes:

```html
<span
  data-type="tts"
  data-character-id="alice"
  data-character-name="Alice"
  data-voice="en-us-female-1"
  data-inflection="excited"
>Curiouser and curiouser!</span>
```

All four attributes are optional — only the ones with non-empty values are emitted.

### Advanced: standalone extension

`TTSMarkExtension` is exported as a standalone TipTap extension for cases where you build a custom editor with `useEditor` directly:

```ts
import { TTSMarkExtension } from 'tiptap-magictext'

const editor = useEditor({
  extensions: [StarterKit, TTSMarkExtension, /* … */],
})
```

## Internationalisation

The editor UI ships in **English** (default) and **Spanish**. Pass `locale` to switch:

```tsx
<MagicTextEditor locale="es" />
```

### Override specific strings

Use `translations` to replace individual strings without creating a full locale:

```tsx
<MagicTextEditor
  locale="es"
  translations={{ link: { applyButton: 'Confirmar' } }}
/>
```

Any key not provided falls back to the resolved locale value. Groups are merged shallowly, so you only need to supply the keys you want to change.

### Register a community locale

Call `registerLocale` once at app startup (before rendering any editor):

```tsx
import { registerLocale } from 'tiptap-magictext'
import type { Translations } from 'tiptap-magictext'

const fr: Translations = {
  toolbar: { ariaLabel: 'Mise en forme' },
  history: { undo: 'Annuler', redo: 'Rétablir' },
  // ... all keys required (see Translations type)
}

registerLocale('fr', fr)
```

Then use it as any other locale:

```tsx
<MagicTextEditor locale="fr" />
```

If the locale is not found in the registry the editor falls back to English gracefully.

### Switching locale at runtime

TipTap initialises extensions once. To switch locale after mount, remount the editor with a `key`:

```tsx
<MagicTextEditor key={locale} locale={locale} />
```

### Translations type

The `Translations` interface is fully typed and exported. Use it when writing a new locale to get autocomplete and ensure no key is missing:

```ts
import type { Translations } from 'tiptap-magictext'

export const de: Translations = { ... }
```

## Exported API

```ts
// Component
import { MagicTextEditor } from 'tiptap-magictext'

// Types
import type { MagicTextEditorProps, Variable, VariableType, JSONContent, ContentType, Translations, PartialTranslations, TTSCharacter } from 'tiptap-magictext'

// i18n utilities
import { registerLocale, resolveTranslations, useTranslations } from 'tiptap-magictext'

// Built-in locale objects (useful as a base for partial overrides)
import { en, es } from 'tiptap-magictext'

// Toolbar sub-components (advanced usage)
import { Toolbar, ToolbarButton, ToolbarDivider, VariableDropdown, TTSPopover } from 'tiptap-magictext'

// Standalone TipTap extension
import { TTSMarkExtension } from 'tiptap-magictext'
```

## Toolbar features

| Group       | Actions                                              |
| ----------- | ---------------------------------------------------- |
| History     | Undo, Redo                                           |
| Formatting  | Bold, Italic, Underline, Strikethrough, Highlight    |
| Headings    | H1, H2, H3                                           |
| Lists       | Bullet list, Ordered list                            |
| Blocks      | Blockquote, Code block, Horizontal rule              |
| Alignment   | Left, Center, Right                                  |
| Insert      | Link (popover with text + URL), Image (URL or file upload) |
| Variables   | Variable picker (when `variables` prop is set)       |
| TTS         | Voice/character assignment (when `ttsCharacters` prop is set)       |

### Link popover

Clicking the link button opens a floating popover anchored to the selected text. It shows two fields — **Text** (pre-filled with the current selection) and **URL**. Clicking an existing link in the editor also opens the popover, pre-filled with its text and URL. A **Remove link** button is shown when the cursor is inside an existing link.

### Image popover

Clicking the image button opens a dropdown with two tabs:

- **URL** — paste an image URL and optional alt text.
- **Upload** — pick or drag a local file. The image is embedded as a base64 data URL and rendered inline in the editor immediately.

## Styles

Styles are injected automatically when the component is imported — no extra CSS import needed.

### Tailwind / custom classes

All default rules are wrapped in `:where()`, so their specificity is **zero**. Any class you pass — including Tailwind utilities — always wins without needing `!important`.

```tsx
<MagicTextEditor
  className="rounded-none border-gray-300"
  toolbarClassName="bg-gray-100"
  contentClassName="min-h-64 text-sm"
/>
```

### CSS custom properties

Every visual token is exposed as a CSS variable scoped to `.magic-text-editor`. Override them on your wrapper to theme the editor:

```css
.my-editor {
  --mte-bg: transparent;
  --mte-border-color: #d1d5db;
  --mte-radius: 4px;
  --mte-toolbar-bg: #f9fafb;
  --mte-btn-active-bg: #fef3c7;
  --mte-btn-active-color: #92400e;
}
```

| Variable | Default | Description |
| --- | --- | --- |
| `--mte-border-color` | `#e2e8f0` | Border color of the root wrapper |
| `--mte-radius` | `8px` | Border radius |
| `--mte-bg` | `#ffffff` | Editor background |
| `--mte-color` | `#0f172a` | Default text color |
| `--mte-toolbar-bg` | `#f8fafc` | Toolbar background |
| `--mte-toolbar-border` | `#e2e8f0` | Toolbar bottom border |
| `--mte-btn-color` | `#475569` | Toolbar button color |
| `--mte-btn-hover-bg` | `#e2e8f0` | Toolbar button hover background |
| `--mte-btn-active-bg` | `#dbeafe` | Active toolbar button background |
| `--mte-btn-active-color` | `#1d4ed8` | Active toolbar button color |
| `--mte-caret-color` | `#2563eb` | Cursor color |
| `--mte-selection-bg` | `#bfdbfe` | Text selection background |
| `--mte-placeholder-color` | `#94a3b8` | Placeholder text color |
| `--mte-link-color` | `#2563eb` | Link text color |
| `--mte-link-bg` | `#dbeafe` | Link chip background |
| `--mte-link-bg-hover` | `#bfdbfe` | Link chip hover background |
| `--mte-var-chip-bg` | `#fffbda` | Variable chip background (unfilled) |
| `--mte-var-chip-color` | `#6d6d6c` | Variable chip text color (unfilled) |
| `--mte-var-chip-border` | `#01e1ff` | Variable chip border color |
| `--mte-var-filled-bg` | `#fef3c7` | Variable chip background (filled) |
| `--mte-var-filled-color` | `#92400e` | Variable chip text color (filled) |

## Development

```bash
# Start the dev playground (dev/ directory, not included in the npm package)
npm run dev

# Build the library
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type check
npm run typecheck
```

## License

MIT
