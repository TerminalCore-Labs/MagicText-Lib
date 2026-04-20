import type { JSONContent } from '@tiptap/core'
import type { Translations, PartialTranslations } from '../i18n/types'

export type ContentType = 'html' | 'json'

export type VariableType = 'text' | 'textarea' | 'select' | 'date' | 'daterange'

export interface Variable {
  /** Display name shown in the variable picker and as the chip label in the editor. */
  label: string
  /** Input type for the variable. */
  type?: VariableType
  /** Options for variables of type 'select'. */
  options?: string[]
}

/**
 * Configuration for a single TTS mark preset shown in the voice-assignment popover.
 */
export interface TTSMark {
  /** Unique identifier written to data-character-id in the output HTML. */
  id: string
  /** Display name shown in the popover grid and as the badge above marked text. */
  name: string
  /** Available voice/model options for this mark. Rendered as a select in the popover. */
  voices?: string[]
  /** Hex color for the editor highlight. Auto-assigned from a built-in palette if omitted. */
  color?: string
}

export interface MagicTextEditorProps {
  /** Content to display. Pass an HTML string when inputType="html" (default), or a JSONContent object when inputType="json". */
  content?: string | JSONContent
  /** Format of the incoming content prop. @default 'html' */
  inputType?: ContentType
  /** Format emitted by onChange/onBlur/onFocus callbacks. @default 'html' */
  outputType?: ContentType
  /** Callback fired on every content change. Receives an HTML string or JSONContent depending on outputType. */
  onChange?: (value: string | JSONContent) => void
  /** Callback fired when the editor loses focus. */
  onBlur?: (value: string | JSONContent) => void
  /** Callback fired when the editor gains focus. */
  onFocus?: (value: string | JSONContent) => void
  /** Placeholder text shown when the editor is empty. */
  placeholder?: string
  /** Whether the editor is editable. Hides the toolbar when false. @default true */
  editable?: boolean
  /** Autofocus the editor on mount. @default false */
  autofocus?: boolean | 'start' | 'end' | 'all' | number
  /** Extra class name for the root wrapper. */
  className?: string
  /** Extra class name for the toolbar. */
  toolbarClassName?: string
  /** Extra class name for the content area. */
  contentClassName?: string
  /** List of variables available in the toolbar variable picker. */
  variables?: Variable[]
  /** Called when the user adds a custom variable via the picker. */
  onVariableAdd?: (variable: Variable) => void
  /**
   * Mark presets available in the TTS voice-assignment toolbar button.
   * When provided, the microphone button appears in the toolbar.
   * Omit (or leave undefined) to hide the TTS button entirely.
   */
  ttsMarks?: TTSMark[]
  /**
   * Global list of inflection options shown as a select in the TTS popover.
   * Omit to hide the inflection field.
   */
  ttsInflections?: string[]
  /**
   * BCP 47 locale string for the editor UI (e.g. 'en', 'es').
   * Built-in locales: 'en' (default), 'es'.
   * Register additional locales with `registerLocale()` before use.
   * Changing this prop after mount has no effect — remount the component to switch locale.
   */
  locale?: string
  /**
   * Fine-grained translation overrides applied on top of the resolved locale.
   * Each top-level group is optional, and within a group each individual key
   * is also optional — override only what you need.
   */
  translations?: PartialTranslations
}

export type { JSONContent }
export type { Translations, PartialTranslations }

