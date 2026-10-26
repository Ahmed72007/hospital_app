import { speak } from '../lib/speech'
import type { T } from '../lib/types'

// Every screen has one of these: reads the given text out loud.
export default function ReadAloud({ text, speech, t }: { text: string; speech: string; t: T }) {
  return (
    <button className="btn ghost" onClick={() => speak(text, speech)}>
      🔊 {t('replay')}
    </button>
  )
}
