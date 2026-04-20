import { createContext, useContext } from 'react'
import type { Translations, PartialTranslations } from './types'
import { en } from './locales/en'
import { es } from './locales/es'

// ── Registry ──────────────────────────────────────────────────────────────────

const localeRegistry = new Map<string, Translations>([
  ['en', en],
  ['es', es],
])

/**
 * Register a custom locale so it can be used via the `locale` prop.
 * Call this once at app startup before rendering any MagicTextEditor.
 *
 * @example
 * import { registerLocale } from 'tiptap-magictext'
 * import { fr } from './locales/fr'
 * registerLocale('fr', fr)
 */
export function registerLocale(locale: string, translations: Translations): void {
  localeRegistry.set(locale, translations)
}

// ── Resolution ────────────────────────────────────────────────────────────────

/**
 * Merges two Translations objects. Each top-level group is spread individually
 * so partial group overrides work (e.g. overriding one `variables.*` key without
 * re-supplying all keys in the group).
 */
function mergeTranslations(base: Translations, patch: PartialTranslations): Translations {
  return {
    toolbar:    { ...base.toolbar,    ...(patch.toolbar    ?? {}) },
    history:    { ...base.history,    ...(patch.history    ?? {}) },
    formatting: { ...base.formatting, ...(patch.formatting ?? {}) },
    headings:   { ...base.headings,   ...(patch.headings   ?? {}) },
    blocks:     { ...base.blocks,     ...(patch.blocks     ?? {}) },
    alignment:  { ...base.alignment,  ...(patch.alignment  ?? {}) },
    link:       { ...base.link,       ...(patch.link       ?? {}) },
    image:      { ...base.image,      ...(patch.image      ?? {}) },
    variables: {
      ...base.variables,
      ...(patch.variables ?? {}),
      typeLabels: {
        ...base.variables.typeLabels,
        ...(patch.variables?.typeLabels ?? {}),
      },
    },
    tts:          { ...base.tts,          ...(patch.tts          ?? {}) },
    variableNode: { ...base.variableNode, ...(patch.variableNode ?? {}) },
  }
}

/**
 * Resolves a complete Translations object by:
 * 1. Using English as the guaranteed-complete base.
 * 2. Merging the registered locale on top (if provided and found in the registry).
 * 3. Merging any consumer-supplied overrides on top of that.
 *
 * Falls back to English gracefully when a locale is not found.
 */
export function resolveTranslations(
  locale?: string,
  overrides?: PartialTranslations,
): Translations {
  const localeTranslations = locale ? localeRegistry.get(locale) : undefined
  const withLocale = localeTranslations ? mergeTranslations(en, localeTranslations) : en
  return overrides ? mergeTranslations(withLocale, overrides) : withLocale
}

// ── Context & Hook ────────────────────────────────────────────────────────────

/**
 * React context that holds the active Translations object.
 * Defaults to English so components work outside a MagicTextEditor provider.
 */
export const TranslationsContext = createContext<Translations>(en)

/**
 * Returns the active translations from the nearest MagicTextEditor ancestor.
 * Falls back to English when used outside a MagicTextEditor.
 */
export function useTranslations(): Translations {
  return useContext(TranslationsContext)
}

// ── Re-exports ────────────────────────────────────────────────────────────────

export type { Translations, PartialTranslations } from './types'
export { en } from './locales/en'
export { es } from './locales/es'
