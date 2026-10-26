import { useEffect, useState } from 'react'
import { languages, translate, type LangId, type Strings } from './i18n'
import { deptTypes, findDept } from './lib/data'
import { describeDept } from './lib/describe'
import { matchText } from './lib/match'
import { speak, stopListening } from './lib/speech'
import type { Hospital, Result } from './lib/types'
import TopBar from './components/TopBar'
import LanguageScreen from './components/LanguageScreen'
import HospitalScreen from './components/HospitalScreen'
import SpeakScreen from './components/SpeakScreen'
import ResultScreen from './components/ResultScreen'
import DetailsScreen from './components/DetailsScreen'
import DeptGrid from './components/DeptGrid'
import ReadAloud from './components/ReadAloud'

type Screen = 'lang' | 'hospital' | 'patient' | 'speak' | 'confirm' | 'result' | 'details' | 'grid' | 'staff'

export default function App() {
  const [screen, setScreen] = useState<Screen>('lang')
  const [lang, setLang] = useState<LangId>('en')
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [gridMsg, setGridMsg] = useState('')
  const [query, setQuery] = useState('')
  const [patient, setPatient] = useState('')

  const t = (key: keyof Strings) => translate(lang, key)
  const speech = languages[lang].speech

  // Urdu is right to left.
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = languages[lang].dir
  }, [lang])

  function go(s: Screen) {
    stopListening()
    window.speechSynthesis?.cancel()
    setScreen(s)
  }

  function showResult(typeId: string, urgent: boolean) {
    if (!hospital) return
    const dept = findDept(hospital.id, typeId)
    setResult({ typeId, dept, urgent })
    go('result')
    speak(dept ? describeDept(dept, lang, t, urgent) : t('notAvailable'), speech)
  }

  function handleQuery(text: string) {
    setQuery(text)
    setScreen('confirm')
  }

  function confirmQuery() {
    const m = matchText(query)
    if (m.typeId === 'general' && patient === 'child') m.typeId = 'pediatrics'
    if (!m.typeId && patient === 'pregnant') m.typeId = 'gynecology'
    if (m.typeId) return showResult(m.typeId, m.urgent)
    setGridMsg(t('noMatch'))
    go('grid')
    speak(t('noMatch'), speech)
  }

  function back() {
    if (screen === 'staff') go('result')
    else if (screen === 'confirm') go('speak')
    else if (screen === 'patient') go('hospital')
    else if (screen === 'details') go('result')
    else if (screen === 'result' || screen === 'grid') go('speak')
    else if (screen === 'speak') go('hospital')
    else go('lang')
  }

  return (
    <div className="app">
      {screen !== 'lang' && (
        <TopBar t={t} onBack={back} onEmergency={hospital ? () => showResult('emergency', true) : undefined} />
      )}
      {screen !== 'lang' && <p className="demo-banner">{t('demoNotice')}</p>}

      {screen === 'lang' && (
        <LanguageScreen onPick={(l) => { setLang(l); setScreen('hospital') }} />
      )}
      {screen === 'hospital' && (
        <HospitalScreen lang={lang} speech={speech} t={t} onPick={(h) => { speak(h.name[lang], speech); setHospital(h); setScreen('patient') }} />
      )}
      {screen === 'patient' && <main className="screen"><h1>{t('patient')}</h1><div className="grid">{[['👶','child'],['👩','woman'],['🤰','pregnant'],['👨','man'],['🧓','elderly']].map(([icon,key])=><button className="tile" key={key} onClick={()=>{setPatient(key);go('speak')}}><span className="icon">{icon}</span>{t(key as keyof Strings)}</button>)}</div><button className="btn ghost" onClick={()=>{setPatient('');go('speak')}}>{t('skip')}</button><ReadAloud text={t('patient')} speech={speech} t={t}/></main>}
      {screen === 'speak' && <SpeakScreen speech={speech} t={t} onQuery={handleQuery} onGrid={() => { setGridMsg(''); go('grid') }} />}
      {screen === 'confirm' && <main className="screen"><h1>{t('confirm')}</h1><ReadAloud text={query} speech={speech} t={t}/><button className="btn primary big" onClick={confirmQuery}>✅ {t('yes')}</button><button className="btn danger big" onClick={()=>go('speak')}>❌ {t('no')}</button></main>}
      {screen === 'grid' && hospital && (
        <DeptGrid lang={lang} speech={speech} t={t} hospital={hospital} message={gridMsg} onPick={(id) => showResult(id, false)} />
      )}
      {screen === 'result' && hospital && result && (
        <ResultScreen lang={lang} speech={speech} t={t} hospital={hospital} result={result}
          onDetails={() => go('details')} onGrid={() => go('grid')} onStaff={() => go('staff')} />
      )}
      {screen === 'staff' && result?.dept && <main className="staff-screen" onClick={()=>go('result')}><p>{t('staffCard')}</p><div className="staff-icon" style={{background:deptTypes[result.typeId].color}}>{deptTypes[result.typeId].icon}</div><h1>{result.dept.name.en}</h1><h1 dir="rtl">{result.dept.name.ur}</h1><button className="btn primary">{t('back')}</button></main>}
      {screen === 'details' && result?.dept && (
        <DetailsScreen lang={lang} speech={speech} t={t} dept={result.dept} />
      )}
    </div>
  )
}
