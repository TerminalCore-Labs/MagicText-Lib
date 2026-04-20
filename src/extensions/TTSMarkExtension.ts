import { Mark, mergeAttributes } from '@tiptap/core'

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace(/^#/, '')
  const full = cleaned.length === 3
    ? cleaned.split('').map(c => c + c).join('')
    : cleaned
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(139, 92, 246, ${alpha})`
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * TipTap mark that tags a text range with TTS metadata.
 * The backend can read the data-* attributes to assign TTS models and inflections.
 *
 * Output HTML example:
 *   <span data-type="tts" data-character-id="alice" data-character-name="Alice"
 *         data-voice="en-us-female-1" data-inflection="excited">...</span>
 */
export const TTSMarkExtension = Mark.create({
  name: 'tts',

  // Do not extend to newly typed text at the mark boundaries
  inclusive: false,

  addAttributes() {
    return {
      characterId: {
        default: null,
        parseHTML: el => el.getAttribute('data-character-id'),
        renderHTML: attrs => attrs.characterId ? { 'data-character-id': attrs.characterId } : {},
      },
      characterName: {
        default: null,
        parseHTML: el => el.getAttribute('data-character-name'),
        renderHTML: attrs => attrs.characterName ? { 'data-character-name': attrs.characterName } : {},
      },
      voice: {
        default: null,
        parseHTML: el => el.getAttribute('data-voice'),
        renderHTML: attrs => attrs.voice ? { 'data-voice': attrs.voice } : {},
      },
      inflection: {
        default: null,
        parseHTML: el => el.getAttribute('data-inflection'),
        renderHTML: attrs => attrs.inflection ? { 'data-inflection': attrs.inflection } : {},
      },
      /**
       * Visual color for the editor UI. Stored in data-color so it round-trips
       * through HTML. The backend can safely ignore this attribute.
       */
      color: {
        default: null,
        parseHTML: el => el.getAttribute('data-color'),
        renderHTML: attrs => attrs.color ? { 'data-color': attrs.color } : {},
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="tts"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const color = HTMLAttributes['data-color'] as string | undefined
    const style = color
      ? `--tts-color: ${color}; --tts-bg: ${hexToRgba(color, 0.13)}; --tts-bg-hover: ${hexToRgba(color, 0.23)};`
      : undefined

    return [
      'span',
      mergeAttributes(
        {
          'data-type': 'tts',
          class: 'magic-text-editor__tts',
          ...(style ? { style } : {}),
        },
        HTMLAttributes,
      ),
    ]
  },
})
