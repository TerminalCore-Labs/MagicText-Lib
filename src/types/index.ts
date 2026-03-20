import type { JSONContent } from '@tiptap/core'

export type ContentType = 'html' | 'json'

export interface MagicEditorProps {
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
}

export type { JSONContent }

