import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { company, services, values, galleryFallback, img } from '../data/site.js'
import { fetchPosts } from '../lib/firebase.js'
import './Home.css'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let active = true
    fetchPosts()
      .then((data) => active && setPosts(data))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return (
    <PageTransition>
      {/* ---------------------------------- Hero --------------------------------- */}
      <section className="hero">
        <div className="hero__media">
          <video
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={img.forestry}
          >
            <source
              src={img.headerVideoMobile}
              type="video/mp4"
              media="(max-width: 768px)"
            />
            <source src={img.headerVideo} type="video/mp4" />
          </video>
          <div className="hero__overlay" />
        </div>

        <div className="container hero__content">
          <motion.span
            className="hero__eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Forstdienstleistungen · Familienbetrieb
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Verantwortung für den Wald –<br />
            heute und für kommende Generationen
          </motion.h1>
          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            Moderne, nachhaltige Forstwirtschaft mit Herz, Hand und Verstand.
            Von der Holzernte über Waldpflege bis zu Pflanzung und Zaunbau.
          </motion.p>
          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Link to="/kontakt" className="btn btn-primary">
              Anfrage senden <Icon name="ArrowRight" />
            </Link>
            <Link to="/leistungen" className="btn btn-ghost">
              Unsere Leistungen
            </Link>
          </motion.div>
        </div>

        <div className="hero__scroll" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* --------------------------------- Werte --------------------------------- */}
      <section className="section values">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Wofür wir stehen</span>
            <h2>Werte, die in jedem Auftrag stecken</h2>
            <p>
              Als familiengeführtes Unternehmen liefern wir Qualität, arbeiten
              zuverlässig und mit echter Leidenschaft.
            </p>
          </Reveal>
          <div className="values__grid">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="value-card card">
                <div className="value-card__icon">
                  <Icon name={v.icon} />
                </div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Dienstleistungen ------------------------- */}
      <section className="section services-preview">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Unsere Leistungen</span>
            <h2>Alles rund um Ihren Wald – aus einer Hand</h2>
          </Reveal>
          <div className="services-preview__grid">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <Link to={`/leistungen#${s.id}`} className="service-tile">
                  <div className="service-tile__img">
                    <img src={s.image} alt={s.title} loading="lazy" />
                    <span className="service-tile__icon">
                      <Icon name={s.icon} />
                    </span>
                  </div>
                  <div className="service-tile__body">
                    <h3>{s.title}</h3>
                    <p>{s.teaser}</p>
                    <span className="service-tile__more">
                      Mehr erfahren <Icon name="ArrowRight" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- Aktuelle Beiträge ------------------------- */}
      {posts.length > 0 && (
        <section className="section posts">
          <div className="container">
            <Reveal className="section-head center">
              <span className="eyebrow">Aktuelles</span>
              <h2>Neuigkeiten & Projekte</h2>
            </Reveal>
            <div className="posts__grid">
              {posts.slice(0, 3).map((post, i) => (
                <Reveal key={post.id} delay={i * 0.08} className="post-card card">
                  {post.image && (
                    <div className="post-card__img">
                      <img src={post.image} alt={post.title} loading="lazy" />
                    </div>
                  )}
                  <div className="post-card__body">
                    <h3>{post.title}</h3>
                    <p>{post.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------- Galerie-Vorschau -------------------------- */}
      <section className="section gallery-preview">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Galerie</span>
            <h2>Ein Blick auf unsere Arbeit</h2>
            <p>Erfolgreich umgesetzte Projekte aus Wald und Flur.</p>
          </Reveal>
          <div className="gallery-preview__grid">
            {galleryFallback.slice(0, 5).map((src, i) => (
              <Reveal
                key={src}
                delay={i * 0.05}
                className={`gallery-preview__item gp-${i}`}
              >
                <img src={src} alt="Projektimpression Weiß Forst" loading="lazy" />
              </Reveal>
            ))}
          </div>
          <div className="gallery-preview__cta">
            <Link to="/galerie" className="btn btn-outline">
              Zur ganzen Galerie <Icon name="ArrowRight" />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------------------------- CTA --------------------------------- */}
      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <h2>Maßgeschneiderte Lösungen für Ihren Wald</h2>
            <p>
              Jeder Wald ist einzigartig. Kontaktieren Sie uns für eine
              persönliche Beratung – wir freuen uns auf Ihr Projekt.
            </p>
          </div>
          <div className="cta-band__actions">
            <Link to="/kontakt" className="btn btn-primary">
              Jetzt Kontakt aufnehmen <Icon name="ArrowRight" />
            </Link>
            <a href={company.phoneHref} className="cta-band__phone">
              <Icon name="Phone" /> {company.phone}
            </a>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
