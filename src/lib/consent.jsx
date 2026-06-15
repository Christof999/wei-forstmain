import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// Zentrale Einwilligungs-Verwaltung (DSGVO).
//
// Es werden KEINE einwilligungspflichtigen Dienste geladen, bevor der Besucher
// zugestimmt hat. Optionale Kategorien:
//   - fonts: Google Fonts (Fraunces & Inter) – überträgt die IP an Google
//   - maps:  Google Maps (Karteneinbettung auf der Kontaktseite)
// Die Entscheidung wird in localStorage gespeichert (technisch notwendig,
// daher selbst einwilligungsfrei). Vor der Entscheidung greifen System-Fonts.

const STORAGE_KEY = 'wf_consent_v1'
const DEFAULTS = { necessary: true, fonts: false, maps: false }

const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap'

const ConsentContext = createContext(null)

function readStored() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return { ...DEFAULTS, ...parsed, necessary: true }
  } catch {
    return null
  }
}

// Google Fonts erst nach Zustimmung dynamisch nachladen.
function loadGoogleFonts() {
  if (typeof document === 'undefined') return
  if (document.getElementById('google-fonts')) return
  const pre1 = document.createElement('link')
  pre1.rel = 'preconnect'
  pre1.href = 'https://fonts.googleapis.com'
  const pre2 = document.createElement('link')
  pre2.rel = 'preconnect'
  pre2.href = 'https://fonts.gstatic.com'
  pre2.crossOrigin = 'anonymous'
  const sheet = document.createElement('link')
  sheet.id = 'google-fonts'
  sheet.rel = 'stylesheet'
  sheet.href = GOOGLE_FONTS_HREF
  document.head.append(pre1, pre2, sheet)
}

export function ConsentProvider({ children }) {
  const [consent, setConsent] = useState(() => readStored()) // null = noch keine Wahl
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Bei (bereits) erteilter Font-Zustimmung die Schriften laden.
  useEffect(() => {
    if (consent?.fonts) loadGoogleFonts()
  }, [consent?.fonts])

  const persist = useCallback((next) => {
    const value = { ...DEFAULTS, ...next, necessary: true }
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...value, ts: Date.now() }),
      )
    } catch {
      /* localStorage nicht verfügbar – Wahl gilt für diese Sitzung */
    }
    setConsent(value)
  }, [])

  const acceptAll = useCallback(() => persist({ fonts: true, maps: true }), [persist])
  const rejectAll = useCallback(() => persist({ fonts: false, maps: false }), [persist])
  const save = useCallback((prefs) => persist(prefs), [persist])
  // Einzelne Kategorie nachträglich erteilen (z. B. „Karte laden"-Button).
  const grant = useCallback(
    (key) => persist({ ...(consent || DEFAULTS), [key]: true }),
    [consent, persist],
  )

  const value = {
    consent: consent || DEFAULTS,
    decided: consent !== null,
    acceptAll,
    rejectAll,
    save,
    grant,
    settingsOpen,
    openSettings: () => setSettingsOpen(true),
    closeSettings: () => setSettingsOpen(false),
  }

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsent muss innerhalb von ConsentProvider verwendet werden')
  return ctx
}
