import { languages, type LangId } from '../i18n'
import { speak } from '../lib/speech'

export default function LanguageScreen({ onPick }: { onPick: (l: LangId) => void }) {
  return (
    <main className="screen">
      <div className="logo">🏥</div>
      <h1>Hospital Guide · ہسپتال گائیڈ</h1>
      {(Object.keys(languages) as LangId[]).map((id) => (
        <button
          key={id}
          className="btn big"
          onClick={() => {
            speak(languages[id].strings.languageSelected, languages[id].speech) // the choice is spoken aloud
            onPick(id)
          }}
        >
          {languages[id].label}
        </button>
      ))}
    </main>
  )
}
