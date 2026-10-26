import type { LangId } from '../i18n'
import type { Department, T } from './types'

export const floorLabel = (dept: Department, t: T) =>
  dept.floor === 'G' ? t('ground') : `${t('floor')} ${dept.floor}`

// The sentence read aloud on the result screen.
export function describeDept(dept: Department, lang: LangId, t: T, urgent: boolean) {
  const parts = [urgent ? t('urgent') : '', dept.name[lang], `${floorLabel(dept, t)}, ${dept.wing[lang]}`, ...dept.directions[lang]]
  return parts.filter(Boolean).join('. ')
}
