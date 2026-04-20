/**
 * A deeply-partial version of Translations intended for the `translations` prop
 * and the `overrides` argument of `resolveTranslations`. Each top-level group
 * is optional, and within a group each individual key is also optional, so you
 * can override a single label without re-specifying the entire group.
 */
export type PartialTranslations = {
  toolbar?: Partial<Translations['toolbar']>
  history?: Partial<Translations['history']>
  formatting?: Partial<Translations['formatting']>
  headings?: Partial<Translations['headings']>
  blocks?: Partial<Translations['blocks']>
  alignment?: Partial<Translations['alignment']>
  link?: Partial<Translations['link']>
  image?: Partial<Translations['image']>
  tts?: Partial<Translations['tts']>
  variables?: Partial<Omit<Translations['variables'], 'typeLabels'>> & {
    typeLabels?: Partial<Translations['variables']['typeLabels']>
  }
  variableNode?: Partial<Translations['variableNode']>
}

export interface Translations {
  toolbar: {
    /** aria-label for the toolbar wrapper element */
    ariaLabel: string
  }

  history: {
    undo: string
    redo: string
  }

  formatting: {
    bold: string
    italic: string
    underline: string
    strikethrough: string
    highlight: string
  }

  headings: {
    heading1: string
    heading2: string
    heading3: string
  }

  blocks: {
    bulletList: string
    orderedList: string
    blockquote: string
    codeBlock: string
    horizontalRule: string
  }

  alignment: {
    alignLeft: string
    alignCenter: string
    alignRight: string
  }

  link: {
    /** Tooltip and aria-label for the link toolbar button */
    insertLink: string
    /** aria-label for the link editor dialog */
    editorAriaLabel: string
    textLabel: string
    textPlaceholder: string
    urlLabel: string
    urlPlaceholder: string
    applyButton: string
    removeLinkButton: string
  }

  image: {
    /** Tooltip and aria-label for the image toolbar button */
    insertImage: string
    /** aria-label for the image inserter dialog */
    inserterAriaLabel: string
    urlTab: string
    uploadTab: string
    imageUrlLabel: string
    urlPlaceholder: string
    altTextLabel: string
    altTextPlaceholder: string
    insertButton: string
    dropzoneHint: string
  }

  variables: {
    /** Tooltip and aria-label for the variable toolbar button */
    insertVariable: string
    /** aria-label for the variable picker dialog */
    pickerAriaLabel: string
    /** Text for the "add custom variable" list item */
    addCustomVariable: string
    /** Text for the back button */
    back: string
    /** aria-label for the back button */
    backAriaLabel: string
    newVariableTitle: string
    namePlaceholder: string
    addButton: string
    addOptionButton: string
    addOptionPlaceholder: string
    /** Returns the aria-label for removing a select option */
    removeOption: (option: string) => string
    typeLabels: {
      text: string
      textarea: string
      select: string
      date: string
      daterange: string
    }
  }

  /**
   * Strings for the TTS mark popover.
   */
  tts: {
    /** Tooltip and aria-label for the TTS toolbar button */
    insertTTS: string
    /** aria-label for the TTS popover dialog */
    popoverAriaLabel: string
    characterLabel: string
    characterPlaceholder: string
    voiceLabel: string
    voiceSelectDefault: string
    inflectionLabel: string
    inflectionSelectDefault: string
    applyButton: string
    removeButton: string
  }

  /**
   * Strings used inside variable chips (rendered by VariableExtension).
   * These are delivered via TipTap extension options, not React context,
   * because the node view runs in a separate React root.
   */
  variableNode: {
    fromLabel: string
    toLabel: string
    /** Returns the chip tooltip when the variable has no value yet */
    clickToFill: (label: string) => string
    /** Returns the chip tooltip when the variable has a value */
    variableTitle: (label: string, value: string) => string
  }
}
