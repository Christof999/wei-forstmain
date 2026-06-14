import { useEffect } from 'react'
import { getRouteSeo, SITE_NAME, LOCALE } from '../seo.js'

// Hält <head> bei der Client-seitigen Navigation aktuell (Titel, Description,
// Canonical, Open Graph/Twitter, JSON-LD). Beim ersten Aufruf liegen diese
// Tags bereits aus dem Prerender im HTML – hier werden sie nur synchron
// gehalten, wenn der Nutzer per React Router weiternavigiert.
//
// Verwendung auf jeder Seite: <Seo path="/leistungen" />

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({ path }) {
  useEffect(() => {
    const seo = getRouteSeo(path)

    document.title = seo.title
    document.documentElement.lang = 'de'

    upsertMeta('name', 'description', seo.description)
    upsertMeta('name', 'robots', seo.robots)
    upsertLink('canonical', seo.canonical)

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:locale', LOCALE)
    upsertMeta('property', 'og:title', seo.title)
    upsertMeta('property', 'og:description', seo.description)
    upsertMeta('property', 'og:url', seo.canonical)
    upsertMeta('property', 'og:image', seo.ogImage)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', seo.title)
    upsertMeta('name', 'twitter:description', seo.description)
    upsertMeta('name', 'twitter:image', seo.ogImage)

    // JSON-LD: vorhandene, von uns verwaltete Blöcke ersetzen.
    document.head
      .querySelectorAll('script[type="application/ld+json"][data-seo]')
      .forEach((el) => el.remove())
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo', '')
    script.textContent = JSON.stringify(seo.jsonLd)
    document.head.appendChild(script)
  }, [path])

  return null
}
