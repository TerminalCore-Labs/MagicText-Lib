import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'

import type { MagicEditorProps } from '../../types'
import { Toolbar } from '../Toolbar'

const EXTENSIONS = [
  StarterKit,
  Underline,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Highlight.configure({ multicolor: true }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
  }),
  Image,
  TextStyle,
  Color,
]

export function MagicEditor({
  content = '',
  inputType = 'html',
  outputType = 'html',
  onChange,
  onBlur,
  onFocus,
  placeholder = 'Write something...',
  editable = true,
  autofocus = false,
  className,
  toolbarClassName,
  contentClassName,
}: MagicEditorProps) {
  const getOutput = (editor: ReturnType<typeof useEditor>) =>
    outputType === 'json' ? editor!.getJSON() : editor!.getHTML()

  const editor = useEditor({
    extensions: [
      ...EXTENSIONS,
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable,
    autofocus,
    onUpdate({ editor }) {
      onChange?.(getOutput(editor))
    },
    onBlur({ editor }) {
      onBlur?.(getOutput(editor))
    },
    onFocus({ editor }) {
      onFocus?.(getOutput(editor))
    },
  })

  // Emit current content when outputType changes so the consumer stays in sync
  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    onChange?.(outputType === 'json' ? editor.getJSON() : editor.getHTML())
  }, [outputType]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync editable prop after mount
  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    editor.setEditable(editable)
  }, [editor, editable])

  // Sync content prop when it changes from outside
  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    const isDifferent =
      inputType === 'json'
        ? JSON.stringify(content) !== JSON.stringify(editor.getJSON())
        : content !== editor.getHTML()
    if (isDifferent) {
      editor.commands.setContent(content as string, false)
    }
  }, [content]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`magic-editor${className ? ` ${className}` : ''}`}>
      {editable && <Toolbar editor={editor} className={toolbarClassName} />}
      <EditorContent
        editor={editor}
        className={`magic-editor__content${contentClassName ? ` ${contentClassName}` : ''}`}
      />
    </div>
  )
}
