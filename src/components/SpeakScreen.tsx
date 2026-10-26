import { useState } from 'react'
import { listen, recognitionSupported, stopListening } from '../lib/speech'
import type { T } from '../lib/types'
import Disclaimer from './Disclaimer'
import ReadAloud from './ReadAloud'

interface Props {
  speech: string
  t: T
  onQuery: (text: string) => void
  onGrid: () => void
}

export default function SpeakScreen({ speech, t, onQuery, onGrid }: Props) {
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [msg, setMsg] = useState(recognitionSupported ? '' : t('voiceUnavailable'))

  function toggleMic() {
    if (listening) return stopListening()
    setMsg('')
    setListening(true)
    let last = ''
    listen(
      speech,
      (txt, final) => {
        last = txt
        setText(txt)
        if (final) onQuery(txt)
      },
      (error) => {
        setListening(false)
        if (error === 'not-allowed' || error === 'service-not-allowed') setMsg(t('micDenied'))
        else if (error && error !== 'no-speech' && error !== 'aborted') setMsg(t('voiceUnavailable'))
        else if (!error && last) onQuery(last) // recognition ended without a "final" flag
      }
    )
  }

  return (
    <main className="screen">
      <h1>{t('speakTitle')}</h1>
      {recognitionSupported && (
        <button className={'mic' + (listening ? ' on' : '')} onClick={toggleMic} aria-label={t('tapToSpeak')}>
          🎤
        </button>
      )}
      <p className="hint">{listening ? t('listening') : recognitionSupported ? t('tapToSpeak') : ''}</p>
      {msg && <p className="note">{msg}</p>}

      <label className="hint" htmlFor="q">{t('orType')}</label>
      <div className="row">
        <input
          id="q"
          value={text}
          placeholder={t('typePlaceholder')}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && text.trim() && onQuery(text)}
        />
        <button className="btn primary" disabled={!text.trim()} onClick={() => onQuery(text)}>
          {t('go')}
        </button>
      </div>

      <button className="btn ghost" onClick={onGrid}>🗂️ {t('showDepts')}</button>
      <ReadAloud text={`${t('speakTitle')}. ${t('tapToSpeak')}`} speech={speech} t={t} />
      <Disclaimer text={t('disclaimer')} />
    </main>
  )
}
