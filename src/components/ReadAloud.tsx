import { useState } from 'react'
import { speak } from '../lib/speech'
import type { T } from '../lib/types'

export default function ReadAloud({ text, speech, t, showText = true }: { text: string; speech: string; t: T; showText?: boolean }) {
  const [active, setActive] = useState(-1)
  const words = text.split(/(\s+)/u)
  let wordIndex = 0
  const read = () => speak(text, speech, setActive)
  return <>
    {showText && <div className="spoken" aria-live="polite">{words.map((part, i) => {
      if (/^\s+$/u.test(part)) return <span key={i}>{part}</span>
      const current = wordIndex === active; const elapsed = active > wordIndex
      const node = <span key={i} ref={current ? el => el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) : undefined} className={current ? 'word current' : elapsed ? 'word spoken-word' : 'word'}>{part}</span>
      wordIndex++; return node
    })}</div>}
    <button className="btn ghost" onClick={read}>🔊 {t('replay')}</button>
  </>
}
