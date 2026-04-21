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
| `style`            | `CSSProperties`                                   | —                     | Inline styles for the root wrapper. Useful for overriding CSS custom properties.         |
| `className`        | `string`                                          | —                     | Extra class for the root wrapper.                                                        |
| `toolbarClassName` | `string`                                          | —                     | Extra class for the toolbar.                                                             |
| `contentClassName` | `string`                                          | —                     | Extra class for the content area.                                                        |
| `variables`        | `Variable[]`                                      | —                     | Variables available in the toolbar picker. Omit to hide the picker entirely.             |
| `onVariableAdd`    | `(variable: Variable) => void`                    | —                     | Called when the user adds a custom variable via the picker.                              |
| `locale`           | `string`                                          | `'en'`                | BCP 47 locale string. Built-in: `'en'`, `'es'`. Register others with `registerLocale()`. Changing after mount has no effect — use `key={locale}` to force remount. |
| `translations`     | `PartialTranslations`                             | —                     | Fine-grained string overrides applied on top of the resolved locale.                     |
| `ttsMarks`         | `TTSMark[]`                                       | —                     | Mark presets shown in the TTS popover. Enables the microphone button. Omit to hide it.   |
| `ttsInflections`   | `string[]`                                        | —                     | Global list of inflection options shown as a select. Omit to hide the inflection field.  |
| `onTTSPlay`        | `(payload: TTSPlayPayload) => void`               | —                     | Called when the user clicks **Play** in the TTS popover. Enables the Play button. Omit to hide it. |
| `onTTSStop`        | `() => void`                                      | —                     | Called when the user clicks **Stop** while audio is playing.                             |
| `ttsPlaying`       | `boolean`                                         | `false`               | Controlled playing state. When `true`, the Play button switches to Stop.                 |

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

The TTS extension is an optional feature for audiobook and TTS workflows. It lets authors mark text ranges with a voice, character, and inflection. The backend receives the data as HTML attributes for processing.

### Setup

Pass a list of mark presets to enable the microphone button in the toolbar:

```tsx
import type { TTSMark } from 'tiptap-magictext'

const marks: TTSMark[] = [
  { id: 'narrator', name: 'Narrator', voices: ['en-us-neutral-1', 'en-us-neutral-2'] },
  { id: 'alice',    name: 'Alice',    voices: ['en-us-female-1', 'en-us-female-3'] },
]

const inflections = ['neutral', 'excited', 'sad', 'whispering', 'dramatic']

<MagicTextEditor ttsMarks={marks} ttsInflections={inflections} />
```

Omit the prop (or pass `undefined`) to hide the button entirely.

### `TTSMark` preset type

| Field    | Type       | Description                                                                  |
| -------- | ---------- | ---------------------------------------------------------------------------- |
| `id`     | `string`   | Unique identifier written to `data-character-id` in the output HTML.         |
| `name`   | `string`   | Display name shown in the **Saved marks** tab and as the badge above marked text. |
| `voices` | `string[]` | Available TTS voice/model options. Rendered as a select in the popover. Omit to hide the voice field. |

### Usage

There are three ways to open the TTS popover:

| Trigger | Requirement | How |
| ------- | ----------- | --- |
| **Hover icon** | Text must be selected | Hover over the selection — a floating TTS icon button appears above it. Click the icon to open the popover. Both the icon and the popover remain visible side by side. |
| **Toolbar button** | — | Click the microphone button in the toolbar. |
| **Click existing mark** | — | Click any TTS-marked span in the editor to edit its values. |

The popover opens beside the hover icon. Its vertical alignment adapts to viewport position: it extends **downward** when the selection is in the upper half, and **upward** when in the lower half, so it never overflows the screen.

The popover has two tabs:

- **Assign** — type a mark name, pick a color, select a voice and inflection, then click **Apply**.
- **Saved marks** — pick from the presets passed via `ttsMarks`. Selecting one pre-fills the Assign tab and switches to it automatically.

The end user picks the color for each mark from within the popover. The color is stored in `data-color` and restored when the HTML is re-loaded into the editor.

The **Remove** button appears when the cursor is inside an existing TTS mark and strips the mark from the selection.

### Play / Stop

When `onTTSPlay` is provided, a **Play** button appears in the Assign tab. Clicking it fires `onTTSPlay` with a `TTSPlayPayload` containing the selected text and the current voice assignment. The consumer is responsible for starting audio and setting `ttsPlaying={true}`.

While `ttsPlaying` is `true` the button switches to **Stop**. Clicking it fires `onTTSStop`. When playback ends naturally, set `ttsPlaying` back to `false`.

```tsx
const [ttsPlaying, setTtsPlaying] = useState(false)

<MagicTextEditor
  ttsMarks={marks}
  ttsPlaying={ttsPlaying}
  onTTSPlay={(payload) => {
    startAudio(payload)   // your audio engine
    setTtsPlaying(true)
  }}
  onTTSStop={() => {
    stopAudio()
    setTtsPlaying(false)
  }}
/>
```

#### `TTSPlayPayload`

| Field | Type | Description |
| --- | --- | --- |
| `text` | `string` | Plain text of the current selection. |
| `characterId` | `string` | Mark identifier (from `TTSMark.id` or auto-generated from the name). |
| `characterName` | `string` | Mark display name. |
| `voice` | `string \| null` | Selected voice/model, or `null` if none chosen. |
| `inflection` | `string \| null` | Selected inflection, or `null` if none chosen. |
| `color` | `string` | Hex color chosen by the user. |

### Visual appearance

Each marked span renders with a colored underline (`border-bottom`) and a small superscript badge showing the mark name. The color is chosen by the end user in the popover.

### Output HTML

Each marked range is wrapped in a `<span>` with `data-*` attributes:

```html
<span
  data-type="tts"
  data-character-id="alice"
  data-character-name="Alice"
  data-voice="en-us-female-1"
  data-inflection="excited"
  data-color="#10b981"
>Curiouser and curiouser!</span>
```

`data-character-id`, `data-character-name`, `data-voice`, and `data-inflection` are only emitted when non-empty. `data-color` stores the user-chosen color and is used to restore the visual underline when the HTML is re-loaded. The backend can safely ignore it.

### TTS CSS custom property

The extension writes one inline CSS variable onto each marked `<span>`:

| Variable | Default (no color set) | Description |
| --- | --- | --- |
| `--tts-color` | `#8b5cf6` | Underline and badge color |

Because this is an inline style it overrides any CSS rule. The fallback applies only when no color is stored. To change the fallback, override the variable in your stylesheet:

```css
.magic-text-editor {
  --tts-color: #0ea5e9;
}
```

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
import type { MagicTextEditorProps, Variable, VariableType, JSONContent, ContentType, Translations, PartialTranslations, TTSMark, TTSPlayPayload } from 'tiptap-magictext'

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
| TTS         | Voice/mark assignment (when `ttsMarks` prop is set)  |

### Link popover

Clicking the link button opens a floating popover anchored to the selected text. It shows two fields — **Text** (pre-filled with the current selection) and **URL**. Clicking an existing link in the editor also opens the popover, pre-filled with its text and URL. A **Remove link** button is shown when the cursor is inside an existing link.

### Image popover

Clicking the image button opens a dropdown with two tabs:

- **URL** — paste an image URL and optional alt text.
- **Upload** — pick or drag a local file. The image is embedded as a base64 data URL and rendered inline in the editor immediately.

## Styles

Styles are bundled into the JavaScript package and injected into the page automatically when the component is first imported. No separate CSS import is required:

```ts
// This single import brings in both the component and its styles
import { MagicTextEditor } from 'tiptap-magictext'
```

### HTML elements

The editor applies **no default styles** to HTML elements (`h1`–`h3`, `p`, `ul`, `ol`, `blockquote`, `code`, `pre`, `a`, `img`, `hr`). They render with the browser defaults and whatever your own stylesheet provides, giving you full control.

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
  --mte-radius: 6px;
  --mte-toolbar-bg: #f9fafb;
  --mte-btn-active-bg: #dbeafe;
  --mte-btn-active-color: #111827;
}
```

You can also pass them inline via the `style` prop:

```tsx
<MagicTextEditor
  style={{ '--mte-bg': '#1f2937', '--mte-color': '#f1f5f9' } as React.CSSProperties}
/>
```

| Variable | Default | Description |
| --- | --- | --- |
| `--mte-border-color` | `#d1d5db` | Border color of the root wrapper |
| `--mte-radius` | `6px` | Border radius |
| `--mte-bg` | `transparent` | Editor background |
| `--mte-color` | `#111827` | Default text color |
| `--mte-toolbar-bg` | `transparent` | Toolbar background |
| `--mte-toolbar-border` | `#d1d5db` | Toolbar bottom border |
| `--mte-btn-color` | `#6b7280` | Toolbar button base color (also the default for `--mte-icon-color`) |
| `--mte-icon-color` | `var(--mte-btn-color)` | Icon and label color for toolbar buttons |
| `--mte-btn-hover-bg` | `#f3f4f6` | Toolbar button hover background |
| `--mte-btn-active-bg` | `#e5e7eb` | Active toolbar button background |
| `--mte-btn-active-color` | `#111827` | Active toolbar button text color |
| `--mte-caret-color` | `#3b82f6` | Cursor color |
| `--mte-selection-bg` | `#dbeafe` | Text selection background |
| `--mte-placeholder-color` | `#9ca3af` | Placeholder text color |
| `--mte-var-chip-bg` | `#f3f4f6` | Variable chip background (unfilled) |
| `--mte-var-chip-color` | `#374151` | Variable chip text color (unfilled) |
| `--mte-var-chip-border` | `#9ca3af` | Variable chip border color |
| `--mte-var-filled-bg` | `#f0fdf4` | Variable chip background (filled) |
| `--mte-var-filled-color` | `#166534` | Variable chip text color (filled) |
| `--mte-dropdown-bg` | `#ffffff` | Dropdown / popover background |
| `--mte-dropdown-border` | `#e5e7eb` | Dropdown border color |
| `--mte-dropdown-shadow` | `0 2px 8px rgba(0,0,0,0.08)` | Dropdown box shadow |
| `--mte-dropdown-add-btn-bg` | `#3b82f6` | "Add" button background in dropdowns |

### Light / dark mode

Override tokens on your wrapper element (or via the `style` prop) to support dark mode:

```css
@media (prefers-color-scheme: dark) {
  .magic-text-editor {
    --mte-bg: #1f2937;
    --mte-color: #f1f5f9;
    --mte-toolbar-bg: #111827;
    --mte-border-color: #4b5563;
    --mte-icon-color: #cbd5e1;
    --mte-btn-hover-bg: #374151;
    --mte-dropdown-bg: #1f2937;
    --mte-dropdown-border: #4b5563;
  }
}
```

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
