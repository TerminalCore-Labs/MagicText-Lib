import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MagicEditor } from './MagicEditor'

describe('MagicEditor', () => {
  it('renders the root element', () => {
    const { container } = render(<MagicEditor />)
    expect(container.querySelector('.magic-editor')).toBeInTheDocument()
  })

  it('renders the toolbar when editable', () => {
    const { container } = render(<MagicEditor editable={true} />)
    expect(container.querySelector('.magic-editor__toolbar')).toBeInTheDocument()
  })

  it('hides the toolbar when not editable', () => {
    const { container } = render(<MagicEditor editable={false} />)
    expect(container.querySelector('.magic-editor__toolbar')).not.toBeInTheDocument()
  })

  it('renders the content area', () => {
    const { container } = render(<MagicEditor />)
    expect(container.querySelector('.magic-editor__content')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(<MagicEditor className="my-custom-class" />)
    expect(container.querySelector('.magic-editor.my-custom-class')).toBeInTheDocument()
  })

  it('accepts custom toolbarClassName', () => {
    const { container } = render(<MagicEditor toolbarClassName="my-toolbar" />)
    expect(container.querySelector('.magic-editor__toolbar.my-toolbar')).toBeInTheDocument()
  })

  it('accepts custom contentClassName', () => {
    const { container } = render(<MagicEditor contentClassName="my-content" />)
    expect(container.querySelector('.magic-editor__content.my-content')).toBeInTheDocument()
  })

  it('accepts an onChange handler without throwing', () => {
    const onChange = vi.fn()
    expect(() => render(<MagicEditor onChange={onChange} />)).not.toThrow()
  })

  it('accepts an onBlur handler without throwing', () => {
    const onBlur = vi.fn()
    expect(() => render(<MagicEditor onBlur={onBlur} />)).not.toThrow()
  })

  it('accepts an onFocus handler without throwing', () => {
    const onFocus = vi.fn()
    expect(() => render(<MagicEditor onFocus={onFocus} />)).not.toThrow()
  })

  it('accepts inputType="html" without throwing', () => {
    expect(() => render(<MagicEditor inputType="html" content="<p>hello</p>" />)).not.toThrow()
  })

  it('accepts inputType="json" without throwing', () => {
    const json = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }] }
    expect(() => render(<MagicEditor inputType="json" content={json} />)).not.toThrow()
  })

  it('accepts outputType="html" without throwing', () => {
    const onChange = vi.fn()
    expect(() => render(<MagicEditor outputType="html" onChange={onChange} />)).not.toThrow()
  })

  it('accepts outputType="json" without throwing', () => {
    const onChange = vi.fn()
    expect(() => render(<MagicEditor outputType="json" onChange={onChange} />)).not.toThrow()
  })

  it('renders undo and redo buttons in the toolbar', () => {
    render(<MagicEditor editable={true} />)
    expect(screen.getByTitle('Undo')).toBeInTheDocument()
    expect(screen.getByTitle('Redo')).toBeInTheDocument()
  })

  it('renders heading buttons in the toolbar', () => {
    render(<MagicEditor editable={true} />)
    expect(screen.getByTitle('Heading 1')).toBeInTheDocument()
    expect(screen.getByTitle('Heading 2')).toBeInTheDocument()
    expect(screen.getByTitle('Heading 3')).toBeInTheDocument()
  })
})
