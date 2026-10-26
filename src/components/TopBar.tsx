import type { T } from '../lib/types'

interface Props {
  t: T
  onBack?: () => void
  onEmergency?: () => void
}

// Back button on the left, always-visible red Emergency button on the right.
export default function TopBar({ t, onBack, onEmergency }: Props) {
  return (
    <header className="topbar">
      {onBack ? (
        <button className="back" onClick={onBack} aria-label={t('back')}>
          ← {t('back')}
        </button>
      ) : (
        <span className="title">{t('appTitle')}</span>
      )}
      {onEmergency && (
        <button className="emergency" onClick={onEmergency}>
          🚑 {t('emergency')}
        </button>
      )}
    </header>
  )
}
