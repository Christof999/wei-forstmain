import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon.jsx'
import './Lightbox.css'

export default function Lightbox({ images, alts, index, onClose, onNext, onPrev }) {
  const open = index !== null && index >= 0

  const handleKey = useCallback(
    (e) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    },
    [open, onClose, onNext, onPrev],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [open])

  const src = open ? images[index] : null
  const alt = open ? alts?.[index] || `Galeriebild ${index + 1}` : ''
  const label = open ? `Bildansicht, Bild ${index + 1} von ${images.length}` : 'Bildansicht'

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <p className="visually-hidden" aria-live="polite">
            {label}: {alt}
          </p>
          <button
            type="button"
            className="lightbox__btn lightbox__close"
            aria-label="Schließen"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            <Icon name="X" />
          </button>
          <button
            type="button"
            className="lightbox__btn lightbox__prev"
            aria-label="Vorheriges Bild"
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
          >
            <Icon name="ChevronLeft" />
          </button>
          <motion.img
            key={src}
            src={src}
            alt={alt}
            className="lightbox__img"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox__btn lightbox__next"
            aria-label="Nächstes Bild"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
          >
            <Icon name="ChevronRight" />
          </button>
          <p className="lightbox__counter" aria-hidden="true">
            {index + 1} / {images.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
