import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(container) {
  return [...container.querySelectorAll(FOCUSABLE)].filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  )
}

function setInert(active) {
  const targets = [
    document.getElementById('main'),
    document.querySelector('header.nav'),
    document.querySelector('footer.footer'),
  ].filter(Boolean)

  targets.forEach((el) => {
    if (active) el.setAttribute('inert', '')
    else el.removeAttribute('inert')
  })

  return targets
}

/** Fokus-Fang, Escape-Handler, Fokus-Rückgabe und inert-Hintergrund für Modale. */
export function useFocusTrap(active, containerRef, { onEscape, initialFocusRef } = {}) {
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    previousFocus.current = document.activeElement
    const container = containerRef.current
    const inertTargets = setInert(true)

    const focusTarget = () => {
      const preferred = initialFocusRef?.current
      if (preferred && container.contains(preferred)) {
        preferred.focus()
        return
      }
      const focusables = getFocusable(container)
      if (focusables.length) focusables[0].focus()
      else container.focus()
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onEscape?.()
        return
      }
      if (e.key !== 'Tab') return

      const focusables = getFocusable(container)
      if (!focusables.length) {
        e.preventDefault()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    focusTarget()
    container.addEventListener('keydown', onKeyDown)

    return () => {
      container.removeEventListener('keydown', onKeyDown)
      inertTargets.forEach((el) => el.removeAttribute('inert'))
      if (previousFocus.current?.focus) {
        previousFocus.current.focus()
      }
    }
  }, [active, containerRef, onEscape, initialFocusRef])
}
