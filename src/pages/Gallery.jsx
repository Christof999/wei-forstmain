import { useEffect, useState } from 'react'
import PageTransition from '../components/PageTransition.jsx'
import Reveal from '../components/Reveal.jsx'
import Lightbox from '../components/Lightbox.jsx'
import Seo from '../components/Seo.jsx'
import { galleryFallback, getGalleryAlt } from '../data/site.js'
import { fetchGalleryImages } from '../lib/firebase.js'
import './Gallery.css'

export default function Gallery() {
  const [images, setImages] = useState(galleryFallback)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const alts = images.map((src, i) => getGalleryAlt(src, i))

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
      <Seo path="/galerie" />
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
                className="gallery-grid__item"
              >
                <button
                  type="button"
                  onClick={() => open(i)}
                  aria-label={`${alts[i]} vergrößern`}
                >
                  <img src={src} alt={alts[i]} loading="lazy" />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={images}
        alts={alts}
        index={lightboxIndex}
        onClose={close}
        onNext={next}
        onPrev={prev}
      />
    </PageTransition>
  )
}
