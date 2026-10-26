import en from './en.json'
import ur from './ur.json'

export const languages = {
  en: { label: 'English', dir: 'ltr', speech: 'en-US', strings: en },
  ur: { label: 'اردو', dir: 'rtl', speech: 'ur-PK', strings: ur },
} as const

export type LangId = keyof typeof languages
export type Strings = typeof en

export function translate(lang: LangId, key: keyof Strings): string {
  return (languages[lang].strings as Record<string, string>)[key]
}
