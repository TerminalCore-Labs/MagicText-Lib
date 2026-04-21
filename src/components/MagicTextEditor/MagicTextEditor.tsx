import { useEffect, useMemo } from 'react'
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

import type { MagicTextEditorProps } from '../../types'
import { Toolbar } from '../Toolbar'
import { VariableExtension } from '../../extensions/VariableExtension'
import { TTSMarkExtension } from '../../extensions/TTSMarkExtension'
import { TranslationsContext, resolveTranslations } from '../../i18n'

export function MagicTextEditor({
  content = '',
  inputType = 'html',
  outputType = 'html',
  onChange,
  onBlur,
  onFocus,
  placeholder = 'Write something...',
  editable = true,
  autofocus = false,
  style,
  className,
  toolbarClassName,
  contentClassName,
  variables,
  onVariableAdd,
  ttsMarks,
  ttsInflections,
  onTTSPlay,
  onTTSStop,
  ttsPlaying,
  locale,
  translations: translationOverrides,
}: MagicTextEditorProps) {
  const t = useMemo(
    () => resolveTranslations(locale, translationOverrides),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  )

  const getOutput = (editor: ReturnType<typeof useEditor>) =>
    outputType === 'json' ? editor!.getJSON() : editor!.getHTML()

  const editor = useEditor({
    extensions: [
      StarterKit,
      TTSMarkExtension,
      VariableExtension.configure({ translations: t.variableNode }),
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
    <TranslationsContext.Provider value={t}>
      <div className={`magic-text-editor${className ? ` ${className}` : ''}`} style={style}>
        {editable && (
          <Toolbar
            editor={editor}
            className={toolbarClassName}
            variables={variables}
            onVariableAdd={onVariableAdd}
            ttsMarks={ttsMarks}
            ttsInflections={ttsInflections}
            onTTSPlay={onTTSPlay}
            onTTSStop={onTTSStop}
            ttsPlaying={ttsPlaying}
          />
        )}
        <EditorContent
          editor={editor}
          className={`magic-text-editor__content${contentClassName ? ` ${contentClassName}` : ''}`}
        />
      </div>
    </TranslationsContext.Provider>
  )
}
