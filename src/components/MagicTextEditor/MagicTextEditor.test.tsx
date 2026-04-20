import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MagicTextEditor } from './MagicTextEditor'
import type { Variable, TTSCharacter } from '../../types'

describe('MagicTextEditor', () => {
  // ─── Root & layout ──────────────────────────────────────────────────────────

  it('renders the root element', () => {
    const { container } = render(<MagicTextEditor />)
    expect(container.querySelector('.magic-text-editor')).toBeInTheDocument()
  })

  it('renders the content area', () => {
    const { container } = render(<MagicTextEditor />)
    expect(container.querySelector('.magic-text-editor__content')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(<MagicTextEditor className="my-custom-class" />)
    expect(container.querySelector('.magic-text-editor.my-custom-class')).toBeInTheDocument()
  })

  it('accepts custom toolbarClassName', () => {
    const { container } = render(<MagicTextEditor toolbarClassName="my-toolbar" />)
    expect(container.querySelector('.magic-text-editor__toolbar.my-toolbar')).toBeInTheDocument()
  })

  it('accepts custom contentClassName', () => {
    const { container } = render(<MagicTextEditor contentClassName="my-content" />)
    expect(container.querySelector('.magic-text-editor__content.my-content')).toBeInTheDocument()
  })

  // ─── Toolbar visibility ──────────────────────────────────────────────────────

  it('renders the toolbar when editable', () => {
    const { container } = render(<MagicTextEditor editable={true} />)
    expect(container.querySelector('.magic-text-editor__toolbar')).toBeInTheDocument()
  })

  it('hides the toolbar when not editable', () => {
    const { container } = render(<MagicTextEditor editable={false} />)
    expect(container.querySelector('.magic-text-editor__toolbar')).not.toBeInTheDocument()
  })

  // ─── Toolbar buttons ─────────────────────────────────────────────────────────

  it('renders undo and redo buttons in the toolbar', () => {
    render(<MagicTextEditor editable={true} />)
    expect(screen.getByTitle('Undo')).toBeInTheDocument()
    expect(screen.getByTitle('Redo')).toBeInTheDocument()
  })

  it('renders heading buttons in the toolbar', () => {
    render(<MagicTextEditor editable={true} />)
    expect(screen.getByTitle('Heading 1')).toBeInTheDocument()
    expect(screen.getByTitle('Heading 2')).toBeInTheDocument()
    expect(screen.getByTitle('Heading 3')).toBeInTheDocument()
  })

  it('renders the link button in the toolbar', () => {
    render(<MagicTextEditor editable={true} />)
    expect(screen.getByTitle('Insert link')).toBeInTheDocument()
  })

  it('renders the image button in the toolbar', () => {
    render(<MagicTextEditor editable={true} />)
    expect(screen.getByTitle('Insert image')).toBeInTheDocument()
  })

  // ─── Callbacks ───────────────────────────────────────────────────────────────

  it('accepts an onChange handler without throwing', () => {
    const onChange = vi.fn()
    expect(() => render(<MagicTextEditor onChange={onChange} />)).not.toThrow()
  })

  it('accepts an onBlur handler without throwing', () => {
    const onBlur = vi.fn()
    expect(() => render(<MagicTextEditor onBlur={onBlur} />)).not.toThrow()
  })

  it('accepts an onFocus handler without throwing', () => {
    const onFocus = vi.fn()
    expect(() => render(<MagicTextEditor onFocus={onFocus} />)).not.toThrow()
  })

  // ─── Input / output types ────────────────────────────────────────────────────

  it('accepts inputType="html" without throwing', () => {
    expect(() => render(<MagicTextEditor inputType="html" content="<p>hello</p>" />)).not.toThrow()
  })

  it('accepts inputType="json" without throwing', () => {
    const json = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }] }
    expect(() => render(<MagicTextEditor inputType="json" content={json} />)).not.toThrow()
  })

  it('accepts outputType="html" without throwing', () => {
    const onChange = vi.fn()
    expect(() => render(<MagicTextEditor outputType="html" onChange={onChange} />)).not.toThrow()
  })

  it('accepts outputType="json" without throwing', () => {
    const onChange = vi.fn()
    expect(() => render(<MagicTextEditor outputType="json" onChange={onChange} />)).not.toThrow()
  })

  // ─── Variables ───────────────────────────────────────────────────────────────

  it('renders the variable picker button when variables prop is provided', () => {
    const variables: Variable[] = [{ label: 'First name' }]
    render(<MagicTextEditor variables={variables} />)
    expect(screen.getByTitle('Insert variable')).toBeInTheDocument()
  })

  it('does not render the variable picker when variables prop is omitted', () => {
    render(<MagicTextEditor />)
    expect(screen.queryByTitle('Insert variable')).not.toBeInTheDocument()
  })

  it('accepts variables with type without throwing', () => {
    const variables: Variable[] = [
      { label: 'Name', type: 'text' },
      { label: 'Bio', type: 'textarea' },
      { label: 'Country', type: 'select', options: ['US', 'MX', 'AR'] },
      { label: 'Birthday', type: 'date' },
      { label: 'Vacation', type: 'daterange' },
    ]
    expect(() => render(<MagicTextEditor variables={variables} />)).not.toThrow()
  })

  it('accepts an onVariableAdd callback without throwing', () => {
    const onVariableAdd = vi.fn()
    expect(() => render(<MagicTextEditor variables={[]} onVariableAdd={onVariableAdd} />)).not.toThrow()
  })

  // ─── TTS extension ──────────────────────────────────────────────────────────

  it('renders the TTS button when ttsCharacters prop is provided', () => {
    const characters: TTSCharacter[] = [{ id: 'narrator', name: 'Narrator' }]
    render(<MagicTextEditor ttsCharacters={characters} />)
    expect(screen.getByTitle('Assign voice')).toBeInTheDocument()
  })

  it('does not render the TTS button when ttsCharacters prop is omitted', () => {
    render(<MagicTextEditor />)
    expect(screen.queryByTitle('Assign voice')).not.toBeInTheDocument()
  })

  it('renders the TTS button with Spanish title when locale="es"', () => {
    const characters: TTSCharacter[] = [{ id: 'narrator', name: 'Narrator' }]
    render(<MagicTextEditor locale="es" ttsCharacters={characters} />)
    expect(screen.getByTitle('Asignar voz')).toBeInTheDocument()
  })

  it('accepts ttsCharacters with voices and color without throwing', () => {
    const characters: TTSCharacter[] = [
      { id: 'alice', name: 'Alice', voices: ['en-us-female-1', 'en-us-female-3'], color: '#10b981' },
    ]
    expect(() => render(<MagicTextEditor ttsCharacters={characters} />)).not.toThrow()
  })

  it('accepts ttsInflections without throwing', () => {
    const characters: TTSCharacter[] = [{ id: 'narrator', name: 'Narrator' }]
    expect(() =>
      render(<MagicTextEditor ttsCharacters={characters} ttsInflections={['neutral', 'excited']} />)
    ).not.toThrow()
  })

  // ─── Internationalisation ────────────────────────────────────────────────────

  it('renders English UI by default', () => {
    render(<MagicTextEditor />)
    expect(screen.getByTitle('Undo')).toBeInTheDocument()
    expect(screen.getByTitle('Bold')).toBeInTheDocument()
  })

  it('renders Spanish UI when locale="es"', () => {
    render(<MagicTextEditor locale="es" />)
    expect(screen.getByTitle('Deshacer')).toBeInTheDocument()
    expect(screen.getByTitle('Negrita')).toBeInTheDocument()
    expect(screen.getByTitle('Encabezado 1')).toBeInTheDocument()
  })

  it('renders Spanish link and image buttons when locale="es"', () => {
    render(<MagicTextEditor locale="es" />)
    expect(screen.getByTitle('Insertar enlace')).toBeInTheDocument()
    expect(screen.getByTitle('Insertar imagen')).toBeInTheDocument()
  })

  it('renders Spanish variable button when locale="es" and variables are provided', () => {
    render(<MagicTextEditor locale="es" variables={[{ label: 'Nombre' }]} />)
    expect(screen.getByTitle('Insertar variable')).toBeInTheDocument()
  })

  it('applies a translations override on top of the default locale', () => {
    render(<MagicTextEditor translations={{ history: { undo: 'Go back', redo: 'Go forward' } }} />)
    expect(screen.getByTitle('Go back')).toBeInTheDocument()
    expect(screen.getByTitle('Go forward')).toBeInTheDocument()
  })

  it('applies a translations override on top of a non-default locale', () => {
    render(<MagicTextEditor locale="es" translations={{ history: { undo: 'Atrás', redo: 'Adelante' } }} />)
    expect(screen.getByTitle('Atrás')).toBeInTheDocument()
    // Keys not overridden still use the locale value
    expect(screen.getByTitle('Negrita')).toBeInTheDocument()
  })

  it('falls back to English for an unknown locale', () => {
    render(<MagicTextEditor locale="zz-unknown" />)
    expect(screen.getByTitle('Undo')).toBeInTheDocument()
  })

  it('renders the toolbar aria-label in Spanish when locale="es"', () => {
    const { container } = render(<MagicTextEditor locale="es" />)
    const toolbar = container.querySelector('[role="toolbar"]')
    expect(toolbar).toHaveAttribute('aria-label', 'Formato de texto')
  })
})
