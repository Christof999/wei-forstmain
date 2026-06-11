import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

function scrollToHashTarget(hash, signal) {
  const id = hash.slice(1)
  if (!id) {
    scrollPageToTop()
    return
  }

  let attempts = 0
  const maxAttempts = 40

  const tryScroll = () => {
    if (signal.aborted) return

    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    attempts += 1
    if (attempts < maxAttempts) {
      window.setTimeout(tryScroll, 50)
      return
    }

    scrollPageToTop()
  }

  // PageTransition (mode="wait") braucht ~400ms bis die neue Seite im DOM ist
  window.setTimeout(tryScroll, 420)
}

// Scrollt bei Routenwechsel an den Seitenanfang – oder, wenn ein #Anker
// vorhanden ist, zum entsprechenden Abschnitt (z. B. /leistungen#forestry).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const run = () => {
      if (signal.aborted) return

      // Mobile-Menü sperrt den Body – erst scrollen, wenn wieder freigegeben
      if (document.body.style.position === 'fixed') {
        window.setTimeout(run, 16)
        return
      }

      if (hash) {
        scrollToHashTarget(hash, signal)
      } else {
        scrollPageToTop()
      }
    }

    run()
    return () => controller.abort()
  }, [pathname, hash])

  return null
}
