import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon.jsx'
import { useFocusTrap } from '../lib/useFocusTrap.js'
import './Lightbox.css'

export default function Lightbox({ images, alts, index, onClose, onNext, onPrev }) {
  const open = index !== null && index >= 0
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  const handleClose = useCallback(() => onClose(), [onClose])

  useFocusTrap(open, panelRef, {
    onEscape: handleClose,
    initialFocusRef: closeRef,
  })

  const handleKey = useCallback(
    (e) => {
      if (!open) return
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    },
    [open, onNext, onPrev],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const src = open ? images[index] : null
  const alt = open ? alts?.[index] || `Galeriebild ${index + 1}` : ''
  const label = open ? `Bildansicht, Bild ${index + 1} von ${images.length}` : 'Bildansicht'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
        >
          <p className="visually-hidden" aria-live="polite">
            {label}: {alt}
          </p>
          <button
            ref={closeRef}
            className="lightbox__btn lightbox__close"
            aria-label="Schließen"
            onClick={handleClose}
          >
            <Icon name="X" />
          </button>
          <button
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
    </AnimatePresence>
  )
}
