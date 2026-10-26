import { useState } from 'react'
import { hospitals, nearestHospital } from '../lib/data'
import type { Hospital, T } from '../lib/types'
import type { LangId } from '../i18n'
import ReadAloud from './ReadAloud'

interface Props {
  lang: LangId
  speech: string
  t: T
  onPick: (h: Hospital) => void
}

export default function HospitalScreen({ lang, speech, t, onPick }: Props) {
  const [msg, setMsg] = useState('')

  function findNearest() {
    if (!navigator.geolocation) return setMsg(t('locationFail'))
    setMsg(t('locating'))
    navigator.geolocation.getCurrentPosition(
      (p) => onPick(nearestHospital(p.coords.latitude, p.coords.longitude)),
      () => setMsg(t('locationFail')),
      { timeout: 10000 }
    )
  }

  return (
    <main className="screen">
      <h1>{t('chooseHospital')}</h1>
      <button className="btn big primary" onClick={findNearest}>
        📍 {t('nearest')}
      </button>
      {msg && <p className="note">{msg}</p>}
      {hospitals.map((h) => (
        <button key={h.id} className="btn big card" onClick={() => onPick(h)}>
          🏥 {h.name[lang]}
          <small>{h.address[lang]}</small>
        </button>
      ))}
      <ReadAloud text={t('chooseHospital')} speech={speech} t={t} />
    </main>
  )
}
