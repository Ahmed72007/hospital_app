// Web Speech API support varies by browser and installed language packs.
/* eslint-disable @typescript-eslint/no-explicit-any */
const Rec: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
export const recognitionSupported = !!Rec
export const speakSupported = 'speechSynthesis' in window
let current: any = null

export function listen(lang: string, onText: (text: string, final: boolean) => void, onEnd: (error?: string) => void) {
  stopListening()
  if (!Rec) { onEnd('unsupported'); return }
  const r = new Rec(); current = r; r.lang = lang; r.interimResults = true; r.maxAlternatives = 1
  let error: string | undefined
  r.onresult = (e: any) => { const res = e.results[e.results.length - 1]; onText(res[0].transcript, res.isFinal) }
  r.onerror = (e: any) => { error = e.error }
  r.onend = () => { current = null; onEnd(error) }
  try { r.start() } catch { current = null; onEnd('unsupported') }
}
export function stopListening() { if (current) { try { current.stop() } catch {} current = null } }

function voiceFor(lang: string) {
  const voices = window.speechSynthesis.getVoices(); const base = lang.split('-')[0]
  return voices.find(v => v.lang.toLowerCase() === lang.toLowerCase()) || voices.find(v => v.lang.toLowerCase().startsWith(base)) || (base === 'ur' ? voices.find(v => v.lang.toLowerCase().startsWith('hi')) : undefined)
}

export function speak(text: string, lang: string, onWord?: (index: number) => void, onDone?: () => void) {
  if (!speakSupported || !text) { onDone?.(); return }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text); utterance.lang = lang; utterance.rate = 0.88
  const voice = voiceFor(lang); if (voice) { utterance.voice = voice; utterance.lang = voice.lang }
  const words = [...text.matchAll(/\S+/gu)].map(m => ({ start: m.index ?? 0, length: m[0].length }))
  let lastEvent = Date.now(); let fallback: number | undefined
  const schedule = () => {
    if (fallback) clearTimeout(fallback)
    fallback = window.setTimeout(() => {
      if (Date.now() - lastEvent < 1800) { schedule(); return }
      const elapsed = Math.max(0, Date.now() - started - 250)
      const estimated = Math.min(words.length - 1, Math.floor(elapsed / Math.max(260, 360 / utterance.rate)))
      onWord?.(estimated); schedule()
    }, 320)
  }
  const started = Date.now()
  utterance.onboundary = e => {
    if (e.name !== 'word') return
    lastEvent = Date.now()
    const ix = words.findIndex(w => e.charIndex >= w.start && e.charIndex < w.start + w.length)
    if (ix >= 0) onWord?.(ix)
  }
  utterance.onstart = schedule
  utterance.onend = utterance.onerror = () => { if (fallback) clearTimeout(fallback); onWord?.(-1); onDone?.() }
  window.speechSynthesis.speak(utterance)
}
