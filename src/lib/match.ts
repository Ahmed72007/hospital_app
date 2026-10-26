import symptomsJson from '../data/symptoms.json'

const symptoms = symptomsJson as {
  critical: Record<string, string[]>
  types: Record<string, Record<string, string[]>>
}

// When two types score the same, the one earlier in this list wins
// (e.g. "my child has fever": Pediatrics beats General Medicine).
const PRIORITY = ['pediatrics', 'gynecology', 'cardiology', 'orthopedics', 'eye', 'ent', 'dental', 'laboratory', 'pharmacy', 'general', 'emergency']

export interface Match {
  typeId: string | null
  urgent: boolean
}

const normalize = (s: string) =>
  s.toLowerCase().replace(/[۔،,.?!؟]/g, ' ').replace(/\s+/g, ' ').trim()

// A keyword counts when it starts at a word boundary ("ear" matches "ears" but not "heart").
const hit = (text: string, word: string) => (' ' + text).includes(' ' + word.toLowerCase())

const allLangs = (entry: Record<string, string[]>) => Object.values(entry).flat()

export function matchText(raw: string): Match {
  const text = normalize(raw)
  if (!text) return { typeId: null, urgent: false }

  if (allLangs(symptoms.critical).some((w) => hit(text, w))) return { typeId: 'emergency', urgent: true }

  let best: string | null = null
  let bestScore = 0
  for (const id of PRIORITY) {
    const entry = symptoms.types[id]
    if (!entry) continue
    const score = allLangs(entry).filter((w) => hit(text, w)).length
    if (score > bestScore) {
      best = id
      bestScore = score
    }
  }
  return { typeId: best, urgent: best === 'emergency' }
}
