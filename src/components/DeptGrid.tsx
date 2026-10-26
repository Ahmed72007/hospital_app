import { deptsOf, deptTypes } from '../lib/data'
import type { Hospital, T } from '../lib/types'
import type { LangId } from '../i18n'
import Disclaimer from './Disclaimer'
import ReadAloud from './ReadAloud'

interface Props {
  lang: LangId
  speech: string
  t: T
  hospital: Hospital
  message?: string
  onPick: (typeId: string) => void
}

// Picture grid: works with no reading and no microphone.
export default function DeptGrid({ lang, speech, t, hospital, message, onPick }: Props) {
  return (
    <main className="screen">
      <h1>{t('pickDept')}</h1>
      {message && <p className="note">{message}</p>}
      <div className="grid">
        {deptsOf(hospital.id).map((d) => {
          const ty = deptTypes[d.typeId]
          return (
            <button key={d.id} className="tile" style={{ borderColor: ty.color }} onClick={() => onPick(d.typeId)}>
              <span className="icon" style={{ background: ty.color }}>{ty.icon}</span>
              {d.name[lang]}
            </button>
          )
        })}
      </div>
      <a className="btn ghost" href={`tel:${hospital.phone}`}>📞 {t('hospitalPhone')}: <bdi dir="ltr">{hospital.phone}</bdi></a>
      <ReadAloud text={t('pickDept')} speech={speech} t={t} />
      <Disclaimer text={t('disclaimer')} />
    </main>
  )
}
