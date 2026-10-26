import { deptTypes } from '../lib/data'
import { describeDept, floorLabel } from '../lib/describe'
import type { Hospital, Result, T } from '../lib/types'
import type { LangId } from '../i18n'
import Disclaimer from './Disclaimer'
import ReadAloud from './ReadAloud'

interface Props {
  lang: LangId
  speech: string
  t: T
  hospital: Hospital
  result: Result
  onDetails: () => void
  onGrid: () => void
}

export default function ResultScreen({ lang, speech, t, hospital, result, onDetails, onGrid }: Props) {
  const { dept, urgent } = result
  const ty = deptTypes[result.typeId]
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`

  if (!dept) {
    return (
      <main className="screen">
        <div className="bigicon" style={{ background: ty.color }}>{ty.icon}</div>
        <h1>{ty.name[lang]}</h1>
        <p className="note">{t('notAvailable')}</p>
        <a className="btn primary" href={`tel:${hospital.phone}`}>📞 <bdi dir="ltr">{hospital.phone}</bdi></a>
        <button className="btn ghost" onClick={onGrid}>🗂️ {t('showDepts')}</button>
      </main>
    )
  }

  return (
    <main className="screen">
      {urgent && <div className="alert">{t('urgent')}</div>}
      {result.typeId === 'emergency' && (
        <a className="btn danger big" href={`tel:${hospital.emergencyPhone}`}>
          📞 {t('callEmergency')}: <bdi dir="ltr">{hospital.emergencyPhone}</bdi>
        </a>
      )}
      <div className="bigicon" style={{ background: ty.color }}>{ty.icon}</div>
      <h1>{dept.name[lang]}</h1>
      <p className="place">{floorLabel(dept, t)} · {dept.wing[lang]}</p>

      <h2>{t('directions')}</h2>
      <ol className="steps">
        {dept.directions[lang].map((s, i) => <li key={i}>{s}</li>)}
      </ol>

      <ReadAloud text={describeDept(dept, lang, t, urgent)} speech={speech} t={t} />
      <button className="btn primary" onClick={onDetails}>📋 {t('details')}</button>
      <a className="btn ghost" href={mapsUrl} target="_blank" rel="noreferrer">🗺️ {t('reach')}</a>
      <Disclaimer text={t('disclaimer')} />
    </main>
  )
}
