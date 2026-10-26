// Browser speech: Web Speech API (recognition) and speechSynthesis (voice output).
// Best supported in Chrome on Android. Other languages have limited voice support.
/* eslint-disable @typescript-eslint/no-explicit-any */

const Rec: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

export const recognitionSupported = !!Rec
export const speakSupported = 'speechSynthesis' in window

let current: any = null

export function listen(
  lang: string,
  onText: (text: string, final: boolean) => void,
  onEnd: (error?: string) => void
) {
  stopListening()
  const r = new Rec()
  current = r
  r.lang = lang
  r.interimResults = true
  r.maxAlternatives = 1
  let error: string | undefined
  r.onresult = (e: any) => {
    const res = e.results[e.results.length - 1]
    onText(res[0].transcript, res.isFinal)
  }
  r.onerror = (e: any) => { error = e.error }
  r.onend = () => { current = null; onEnd(error) }
  r.start()
}

export function stopListening() {
  if (current) {
    try { current.stop() } catch { /* already stopped */ }
    current = null
  }
}

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const base = lang.split('-')[0]
  return (
    voices.find((v) => v.lang.replace('_', '-') === lang) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(base)) ||
    // Many phones have no Urdu voice; Hindi voices read Urdu words reasonably well.
    (base === 'ur' ? voices.find((v) => v.lang.toLowerCase().startsWith('hi')) : undefined)
  )
}

export function speak(text: string, lang: string) {
  if (!speakSupported || !text) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  const v = pickVoice(lang)
  if (v) { u.voice = v; u.lang = v.lang }
  u.rate = 0.9
  window.speechSynthesis.speak(u)
}
