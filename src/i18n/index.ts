import en from './en.json'
import ur from './ur.json'

// To add a language (e.g. Sindhi): copy en.json to sd.json, translate it, and add one line below.
// `speech` is the BCP-47 code used by the browser for voice input and output.
export const languages = {
  en: { label: 'English', dir: 'ltr', speech: 'en-US', strings: en },
  ur: { label: 'اردو', dir: 'rtl', speech: 'ur-PK', strings: ur },
} as const

export type LangId = keyof typeof languages
export type Strings = typeof en

export function translate(lang: LangId, key: keyof Strings): string {
  return languages[lang].strings[key]
}
