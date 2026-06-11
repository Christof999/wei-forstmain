import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrollt bei Routenwechsel an den Seitenanfang – oder, wenn ein #Anker
// vorhanden ist, zum entsprechenden Abschnitt (z. B. /leistungen#forestry).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Kurze Verzögerung, bis die neue Seite gerendert ist
      const t = setTimeout(() => {
        const el = document.getElementById(hash.slice(1))
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }, 140)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}
