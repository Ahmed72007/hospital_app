import { useEffect, useState } from 'react'
import { languages, translate, type LangId, type Strings } from './i18n'
import { findDept } from './lib/data'
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

type Screen = 'lang' | 'hospital' | 'speak' | 'result' | 'details' | 'grid'

export default function App() {
  const [screen, setScreen] = useState<Screen>('lang')
  const [lang, setLang] = useState<LangId>('en')
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [gridMsg, setGridMsg] = useState('')

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
    const m = matchText(text)
    if (m.typeId) return showResult(m.typeId, m.urgent)
    setGridMsg(t('noMatch'))
    go('grid')
    speak(t('noMatch'), speech)
  }

  function back() {
    if (screen === 'details') go('result')
    else if (screen === 'result' || screen === 'grid') go('speak')
    else if (screen === 'speak') go('hospital')
    else go('lang')
  }

  return (
    <div className="app">
      {screen !== 'lang' && (
        <TopBar t={t} onBack={back} onEmergency={hospital ? () => showResult('emergency', true) : undefined} />
      )}

      {screen === 'lang' && (
        <LanguageScreen onPick={(l) => { setLang(l); setScreen('hospital') }} />
      )}
      {screen === 'hospital' && (
        <HospitalScreen lang={lang} speech={speech} t={t} onPick={(h) => { setHospital(h); setScreen('speak') }} />
      )}
      {screen === 'speak' && <SpeakScreen speech={speech} t={t} onQuery={handleQuery} onGrid={() => { setGridMsg(''); go('grid') }} />}
      {screen === 'grid' && hospital && (
        <DeptGrid lang={lang} speech={speech} t={t} hospital={hospital} message={gridMsg} onPick={(id) => showResult(id, false)} />
      )}
      {screen === 'result' && hospital && result && (
        <ResultScreen lang={lang} speech={speech} t={t} hospital={hospital} result={result}
          onDetails={() => go('details')} onGrid={() => go('grid')} />
      )}
      {screen === 'details' && result?.dept && (
        <DetailsScreen lang={lang} speech={speech} t={t} dept={result.dept} />
      )}
    </div>
  )
}
