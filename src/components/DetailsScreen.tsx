import { deptTypes, doctorsOf, tipsOf } from '../lib/data'
import type { Department, T } from '../lib/types'
import type { LangId } from '../i18n'
import Disclaimer from './Disclaimer'
import ReadAloud from './ReadAloud'

interface Props {
  lang: LangId
  speech: string
  t: T
  dept: Department
}

export default function DetailsScreen({ lang, speech, t, dept }: Props) {
  const ty = deptTypes[dept.typeId]
  const docs = doctorsOf(dept.id)
  const tips = tipsOf(dept.typeId)?.[lang] ?? []
  const spoken = [dept.name[lang], `${t('phoneIs')} ${dept.phone.replace(/-/g, ' ')}`, dept.timings[lang], ...tips].join('. ')

  return (
    <main className="screen">
      <div className="bigicon" style={{ background: ty.color }}>{ty.icon}</div>
      <h1>{dept.name[lang]}</h1>
      <a className="btn primary big" href={`tel:${dept.phone}`}>📞 {t('call')}: <bdi dir="ltr">{dept.phone}</bdi></a>
      <p className="place">{dept.timings[lang]}</p>

      <h2>{t('doctors')}</h2>
      <ul className="list">
        {docs.map((d) => (
          <li key={d.id}>
            <strong>{d.name}</strong>
            <span>{d.specialty[lang]}</span>
            <span>{d.days[lang]} · {d.timings[lang]}</span>
          </li>
        ))}
      </ul>

      <h2>{t('tips')}</h2>
      <ul className="list">{tips.map((x, i) => <li key={i}>{x}</li>)}</ul>

      <ReadAloud text={spoken} speech={speech} t={t} />
      <Disclaimer text={t('disclaimer')} />
    </main>
  )
}
