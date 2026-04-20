import { describe, it, expect, beforeEach } from 'vitest'
import { resolveTranslations, registerLocale } from './index'
import type { Translations } from './types'
import { en } from './locales/en'
import { es } from './locales/es'

describe('resolveTranslations', () => {
  // ─── Defaults ───────────────────────────────────────────────────────────────

  it('returns English when called with no arguments', () => {
    const t = resolveTranslations()
    expect(t.history.undo).toBe('Undo')
    expect(t.formatting.bold).toBe('Bold')
  })

  it('returns English when locale is undefined', () => {
    const t = resolveTranslations(undefined)
    expect(t.history.undo).toBe(en.history.undo)
  })

  // ─── Built-in locales ────────────────────────────────────────────────────────

  it('returns Spanish strings for locale="es"', () => {
    const t = resolveTranslations('es')
    expect(t.history.undo).toBe('Deshacer')
    expect(t.history.redo).toBe('Rehacer')
  })

  it('returns all Spanish formatting strings for locale="es"', () => {
    const t = resolveTranslations('es')
    expect(t.formatting.bold).toBe('Negrita')
    expect(t.formatting.italic).toBe('Cursiva')
    expect(t.formatting.underline).toBe('Subrayado')
    expect(t.formatting.strikethrough).toBe('Tachado')
    expect(t.formatting.highlight).toBe('Resaltado')
  })

  it('returns Spanish heading labels for locale="es"', () => {
    const t = resolveTranslations('es')
    expect(t.headings.heading1).toBe('Encabezado 1')
    expect(t.headings.heading2).toBe('Encabezado 2')
    expect(t.headings.heading3).toBe('Encabezado 3')
  })

  it('returns Spanish variable type labels for locale="es"', () => {
    const t = resolveTranslations('es')
    expect(t.variables.typeLabels.text).toBe('Campo de texto')
    expect(t.variables.typeLabels.select).toBe('Lista desplegable')
    expect(t.variables.typeLabels.daterange).toBe('Rango de fechas')
  })

  it('returns Spanish variableNode labels for locale="es"', () => {
    const t = resolveTranslations('es')
    expect(t.variableNode.fromLabel).toBe('Desde')
    expect(t.variableNode.toLabel).toBe('Hasta')
    expect(t.variableNode.clickToFill('Nombre')).toBe('Clic para completar Nombre')
  })

  it('returns Spanish tts labels for locale="es"', () => {
    const t = resolveTranslations('es')
    expect(t.tts.insertTTS).toBe('Asignar voz')
    expect(t.tts.characterLabel).toBe('Personaje')
    expect(t.tts.voiceSelectDefault).toBe('Selecciona una voz…')
    expect(t.tts.inflectionSelectDefault).toBe('Selecciona una inflexión…')
    expect(t.tts.applyButton).toBe('Aplicar')
  })

  it('returns English for locale="en" explicitly', () => {
    const t = resolveTranslations('en')
    expect(t.history.undo).toBe('Undo')
  })

  // ─── Fallback ────────────────────────────────────────────────────────────────

  it('falls back to English for an unknown locale', () => {
    const t = resolveTranslations('zz-unknown')
    expect(t.history.undo).toBe(en.history.undo)
    expect(t.formatting.bold).toBe(en.formatting.bold)
  })

  it('returns a complete object (no undefined values) for an unknown locale', () => {
    const t = resolveTranslations('does-not-exist')
    expect(t.toolbar.ariaLabel).toBeDefined()
    expect(t.variableNode.clickToFill).toBeTypeOf('function')
  })

  // ─── Overrides ───────────────────────────────────────────────────────────────

  it('applies overrides on top of the default English locale', () => {
    const t = resolveTranslations(undefined, {
      history: { undo: 'Go back', redo: 'Go forward' },
    })
    expect(t.history.undo).toBe('Go back')
    expect(t.history.redo).toBe('Go forward')
    // Non-overridden keys remain intact
    expect(t.formatting.bold).toBe('Bold')
  })

  it('applies overrides on top of a non-default locale', () => {
    const t = resolveTranslations('es', {
      history: { undo: 'Atrás', redo: 'Adelante' },
    })
    expect(t.history.undo).toBe('Atrás')
    // Non-overridden keys still use the locale value
    expect(t.formatting.bold).toBe(es.formatting.bold)
  })

  it('supports partial group overrides without losing other keys in the group', () => {
    const t = resolveTranslations('es', {
      variables: { addButton: 'Guardar' },
    })
    expect(t.variables.addButton).toBe('Guardar')
    // Other variables keys are preserved from the locale
    expect(t.variables.back).toBe(es.variables.back)
    expect(t.variables.typeLabels.text).toBe(es.variables.typeLabels.text)
  })

  it('supports partial typeLabels overrides without losing other typeLabels', () => {
    const t = resolveTranslations('es', {
      variables: { typeLabels: { date: 'Fecha personalizada' } },
    })
    expect(t.variables.typeLabels.date).toBe('Fecha personalizada')
    expect(t.variables.typeLabels.text).toBe(es.variables.typeLabels.text)
  })

  it('supports overriding a function key', () => {
    const custom = (label: string) => `Fill: ${label}`
    const t = resolveTranslations(undefined, {
      variableNode: { clickToFill: custom },
    })
    expect(t.variableNode.clickToFill('X')).toBe('Fill: X')
  })

  it('supports overriding tts keys without losing others', () => {
    const t = resolveTranslations('es', {
      tts: { insertTTS: 'Asignar TTS' },
    })
    expect(t.tts.insertTTS).toBe('Asignar TTS')
    expect(t.tts.characterLabel).toBe(es.tts.characterLabel)
  })
})

describe('registerLocale', () => {
  const fr: Translations = {
    ...en,
    history: { undo: 'Annuler', redo: 'Rétablir' },
    formatting: { ...en.formatting, bold: 'Gras' },
  }

  beforeEach(() => {
    registerLocale('fr-test', fr)
  })

  it('makes the registered locale available via resolveTranslations', () => {
    const t = resolveTranslations('fr-test')
    expect(t.history.undo).toBe('Annuler')
    expect(t.formatting.bold).toBe('Gras')
  })

  it('inherits unspecified keys from the registered locale object', () => {
    const t = resolveTranslations('fr-test')
    // fr spreads en so all keys are present
    expect(t.formatting.italic).toBe(en.formatting.italic)
  })

  it('overrides can still be applied on top of a registered locale', () => {
    const t = resolveTranslations('fr-test', { history: { undo: 'custom', redo: 'custom2' } })
    expect(t.history.undo).toBe('custom')
    expect(t.formatting.bold).toBe('Gras')
  })
})
