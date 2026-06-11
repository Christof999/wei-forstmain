import { useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon.jsx'
import './Lightbox.css'

export default function Lightbox({ images, index, onClose, onNext, onPrev }) {
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

  const src = open ? images[index] : null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Bildansicht"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <button className="lightbox__btn lightbox__close" aria-label="Schließen" onClick={onClose}>
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
            alt="Vergrößerte Galerieansicht"
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
