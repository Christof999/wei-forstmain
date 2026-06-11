import { useEffect, useState } from 'react'
import PageTransition from '../components/PageTransition.jsx'
import Reveal from '../components/Reveal.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { galleryFallback } from '../data/site.js'
import { fetchGalleryImages } from '../lib/firebase.js'
import './Gallery.css'

export default function Gallery() {
  const [images, setImages] = useState(galleryFallback)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    let active = true
    fetchGalleryImages()
      .then((items) => {
        if (!active) return
        const urls = items.map((i) => i.url).filter(Boolean)
        if (urls.length > 0) setImages(urls)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const open = (i) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)
  const next = () => setLightboxIndex((i) => (i + 1) % images.length)
  const prev = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length)

  return (
    <PageTransition>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Galerie</span>
          <h1>Unsere Projekte</h1>
          <p>
            Werfen Sie einen Blick auf unsere erfolgreich umgesetzten Projekte
            aus Wald und Flur.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="gallery-grid">
            {images.map((src, i) => (
              <Reveal
                key={`${src}-${i}`}
                delay={(i % 6) * 0.05}
                className="gallery-grid__item"
              >
                <button
                  type="button"
                  onClick={() => open(i)}
                  aria-label={`Bild ${i + 1} vergrößern`}
                >
                  <img src={src} alt={`Galeriebild ${i + 1}`} loading="lazy" />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={close}
        onNext={next}
        onPrev={prev}
      />
    </PageTransition>
  )
}
