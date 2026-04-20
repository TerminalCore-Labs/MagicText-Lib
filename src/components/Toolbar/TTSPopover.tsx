import { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import type { TTSCharacter } from '../../types'
import { TTSIcon } from './icons'
import { useTranslations } from '../../i18n'

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899']
const HOVER_DELAY = 600

function getCharacterColor(character: TTSCharacter, all: TTSCharacter[]): string {
  if (character.color) return character.color
  const index = all.indexOf(character)
  return PALETTE[index % PALETTE.length]
}

/** Returns viewport {top, left} centered on the current DOM selection. */
function getSelectionPopoverPosition(): { top: number; left: number } | null {
  const domSel = window.getSelection()
  if (!domSel || domSel.rangeCount === 0) return null
  const rect = domSel.getRangeAt(0).getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return null
  return { top: rect.top, left: rect.left + rect.width / 2 }
}

interface Props {
  editor: Editor
  characters?: TTSCharacter[]
  inflections?: string[]
}

export function TTSPopover({ editor, characters = [], inflections = [] }: Props) {
  const t = useTranslations()

  const [open, setOpen] = useState(false)
  const [characterId, setCharacterId] = useState('')
  const [characterName, setCharacterName] = useState('')
  const [voice, setVoice] = useState('')
  const [inflection, setInflection] = useState('')
  const [activeColor, setActiveColor] = useState<string | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const btnRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isActive = editor.isActive('tts')

  const selectedCharacter = characters.find(c => c.id === characterId) ?? null
  const allVoices = [...new Set(characters.flatMap(c => c.voices ?? []))]
  const availableVoices = selectedCharacter ? (selectedCharacter.voices ?? []) : allVoices

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }

  const fillFromAttrs = (attrs: Record<string, unknown>) => {
    setCharacterId((attrs.characterId as string) ?? '')
    setCharacterName((attrs.characterName as string) ?? '')
    setVoice((attrs.voice as string) ?? '')
    setInflection((attrs.inflection as string) ?? '')
    setActiveColor((attrs.color as string) ?? null)
  }

  const openAt = (pos: { top: number; left: number }) => {
    setPosition(pos)
    if (editor.isActive('tts')) {
      fillFromAttrs(editor.getAttributes('tts'))
    } else {
      setCharacterId('')
      setCharacterName('')
      setVoice('')
      setInflection('')
      setActiveColor(null)
    }
    setOpen(true)
  }

  // ── Close on outside click ────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (!btnRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // ── Hover over selection → open after delay ───────────────────────────────────

  useEffect(() => {
    const editorDom = editor.view.dom

    const handleMouseMove = (e: MouseEvent) => {
      if (!editor.isEditable || open) { clearHoverTimer(); return }

      const { from, to } = editor.state.selection
      if (from === to) { clearHoverTimer(); return }

      // Check if mouse is over the selected text using ProseMirror's hit test
      const hit = editor.view.posAtCoords({ left: e.clientX, top: e.clientY })
      const isOverSelection = hit !== null && hit.pos >= from && hit.pos <= to

      if (isOverSelection) {
        if (!hoverTimerRef.current) {
          hoverTimerRef.current = setTimeout(() => {
            hoverTimerRef.current = null
            const pos = getSelectionPopoverPosition()
            if (pos) openAt(pos)
          }, HOVER_DELAY)
        }
      } else {
        clearHoverTimer()
      }
    }

    editorDom.addEventListener('mousemove', handleMouseMove)
    return () => {
      editorDom.removeEventListener('mousemove', handleMouseMove)
      clearHoverTimer()
    }
  }, [editor, open]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Click on existing TTS mark ────────────────────────────────────────────────

  useEffect(() => {
    const editorDom = editor.view.dom
    const handleClick = (e: MouseEvent) => {
      if (!editor.isEditable) return
      const target = (e.target as HTMLElement).closest('span[data-type="tts"]')
      if (!target) return
      e.preventDefault()
      editor.chain().extendMarkRange('tts').run()
      const pos = getSelectionPopoverPosition()
      if (pos) {
        fillFromAttrs(editor.getAttributes('tts'))
        setPosition(pos)
        setOpen(true)
      }
    }
    editorDom.addEventListener('click', handleClick)
    return () => editorDom.removeEventListener('click', handleClick)
  }, [editor]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toolbar button ────────────────────────────────────────────────────────────

  const openFromButton = () => {
    if (open) { setOpen(false); return }
    const pos = getSelectionPopoverPosition() ?? (() => {
      const { from, to } = editor.state.selection
      const start = editor.view.coordsAtPos(from)
      const end = editor.view.coordsAtPos(to)
      return { top: start.top, left: (start.left + end.left) / 2 }
    })()
    openAt(pos)
  }

  // ── Apply / Remove ────────────────────────────────────────────────────────────

  const selectCharacter = (character: TTSCharacter) => {
    const color = getCharacterColor(character, characters)
    setCharacterId(character.id)
    setCharacterName(character.name)
    const charVoices = character.voices ?? []
    if (charVoices.length > 0 && !charVoices.includes(voice)) setVoice('')
    setActiveColor(color)
  }

  const apply = () => {
    const name = characterName.trim()
    if (!name) return
    const id = characterId || name.toLowerCase().replace(/\s+/g, '-')
    const color = activeColor ?? PALETTE[0]
    editor.chain().focus()
      .setMark('tts', { characterId: id, characterName: name, voice: voice || null, inflection: inflection || null, color })
      .run()
    setOpen(false)
  }

  const remove = () => {
    editor.chain().focus().extendMarkRange('tts').unsetMark('tts').run()
    setOpen(false)
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      <div ref={btnRef}>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); openFromButton() }}
          title={t.tts.insertTTS}
          aria-label={t.tts.insertTTS}
          aria-pressed={open}
          className={`magic-text-editor__btn${isActive || open ? ' magic-text-editor__btn--active' : ''}`}
        >
          <TTSIcon />
        </button>
      </div>

      {open && (
        <div
          ref={popoverRef}
          className="magic-text-editor__link-float magic-text-editor__tts-popover"
          style={{ top: position.top, left: position.left }}
          role="dialog"
          aria-label={t.tts.popoverAriaLabel}
          onKeyDown={(e) => e.key === 'Escape' && (e.preventDefault(), setOpen(false))}
        >
          {/* Character quick-select grid */}
          {characters.length > 0 && (
            <div className="magic-text-editor__tts-chars">
              {characters.map((char) => {
                const color = getCharacterColor(char, characters)
                const selected = characterId === char.id
                return (
                  <button
                    key={char.id}
                    type="button"
                    className={`magic-text-editor__tts-char-btn${selected ? ' magic-text-editor__tts-char-btn--active' : ''}`}
                    style={{
                      borderColor: color,
                      backgroundColor: selected ? color : `${color}22`,
                      color: selected ? '#fff' : color,
                    } as React.CSSProperties}
                    onMouseDown={(e) => { e.preventDefault(); selectCharacter(char) }}
                  >
                    {char.name}
                  </button>
                )
              })}
            </div>
          )}

          {/* Fields */}
          <div className="magic-text-editor__link-body" style={{ flexDirection: 'column' }}>
            <div className="magic-text-editor__link-fields">

              <div className="magic-text-editor__link-field">
                <label className="magic-text-editor__link-label">{t.tts.characterLabel}</label>
                <input
                  className="magic-text-editor__var-input"
                  placeholder={t.tts.characterPlaceholder}
                  value={characterName}
                  onChange={e => {
                    setCharacterName(e.target.value)
                    if (characterId && characters.find(c => c.id === characterId)?.name !== e.target.value) {
                      setCharacterId('')
                      setVoice('')
                      setActiveColor(null)
                    }
                  }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), apply())}
                />
              </div>

              {availableVoices.length > 0 && (
                <div className="magic-text-editor__link-field">
                  <label className="magic-text-editor__link-label">{t.tts.voiceLabel}</label>
                  <select
                    className="magic-text-editor__var-input"
                    value={voice}
                    onChange={e => setVoice(e.target.value)}
                  >
                    <option value="">{t.tts.voiceSelectDefault}</option>
                    {availableVoices.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              )}

              {inflections.length > 0 && (
                <div className="magic-text-editor__link-field">
                  <label className="magic-text-editor__link-label">{t.tts.inflectionLabel}</label>
                  <select
                    className="magic-text-editor__var-input"
                    value={inflection}
                    onChange={e => setInflection(e.target.value)}
                  >
                    <option value="">{t.tts.inflectionSelectDefault}</option>
                    {inflections.map(infl => (
                      <option key={infl} value={infl}>{infl}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="button"
              className="magic-text-editor__var-add-btn"
              onMouseDown={(e) => { e.preventDefault(); apply() }}
              disabled={!characterName.trim()}
            >
              {t.tts.applyButton}
            </button>
          </div>

          {isActive && (
            <button
              type="button"
              className="magic-text-editor__link-remove-btn"
              onMouseDown={(e) => { e.preventDefault(); remove() }}
            >
              {t.tts.removeButton}
            </button>
          )}
        </div>
      )}
    </>
  )
}
