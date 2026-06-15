// Zentrale SEO-/GEO-/AEO-Konfiguration.
//
// Diese Datei ist bewusst frei von JSX und React, damit sie sowohl im Browser
// (Komponente <Seo>) als auch im Node-Prerender-Skript (scripts/prerender.mjs)
// direkt importiert werden kann. Sie liefert pro Route:
//   - Titel, Meta-Description, Canonical, Open-Graph-/Twitter-Daten
//   - passende JSON-LD-Structured-Data (LocalBusiness, Service, FAQ, Breadcrumb)
//
// Ziel:
//   SEO – saubere Titel/Descriptions/Canonicals, Sitemap, sprechende Auszeichnung
//   GEO – maschinenlesbare Fakten (JSON-LD) für generative/KI-Suchsysteme
//   AEO – FAQ-Structured-Data & klar beantwortete Fragen für Answer-Engines

import { company, services, faqs } from './data/site.js'

// Kanonische Domain (Apex ohne www, wie bei All-Inkl registriert).
export const BASE_URL = 'https://weiss-forst.de'
export const SITE_NAME = 'Weiß Forst GbR'
export const LOCALE = 'de_DE'
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/forstdienstleistung.jpg`
const LOGO_URL = `${BASE_URL}/logo.jpeg`

const abs = (path) => (path?.startsWith('http') ? path : `${BASE_URL}${path || '/'}`)

/* --------------------------- Globale Structured Data --------------------------- */

// LocalBusiness/ProfessionalService – das zentrale „Wer sind wir"-Objekt.
// Wird auf jeder Seite ausgegeben, damit Such- und KI-Systeme die Eckdaten
// (Leistungen, Region, Kontakt, Zertifizierung) zuverlässig erfassen.
export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${BASE_URL}/#business`,
  name: company.name,
  legalName: 'Matthias u. Silke Weiß Forst GbR',
  alternateName: ['Forstservice Weiß', 'WinWood'],
  description:
    'Familiengeführter Forstbetrieb in Merkendorf (Mittelfranken) für nachhaltige Forstdienstleistungen: Holzernte, Waldpflege, Pflanzung, Forstzaunbau sowie Brennholz und Hackschnitzel. RAL-gütezeichengeprüfte Holzernte und Holzrückung.',
  url: `${BASE_URL}/`,
  logo: LOGO_URL,
  image: DEFAULT_OG_IMAGE,
  telephone: '+49 174 7468091',
  email: company.email,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address.line1,
    postalCode: '91732',
    addressLocality: 'Merkendorf',
    addressRegion: 'Bayern',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 49.1735,
    longitude: 10.6771,
  },
  areaServed: [
    { '@type': 'City', name: 'Merkendorf' },
    { '@type': 'AdministrativeArea', name: 'Landkreis Ansbach' },
    { '@type': 'AdministrativeArea', name: 'Mittelfranken' },
    { '@type': 'State', name: 'Bayern' },
  ],
  knowsAbout: [
    'Forstdienstleistungen',
    'Holzernte',
    'Durchforstung',
    'Waldpflege',
    'Jungbestandspflege',
    'Forstzaunbau',
    'Aufforstung',
    'Brennholz',
    'Hackschnitzel',
  ],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'RAL-Gütezeichen 244 – Wald- und Landschaftspflege (Holzernte GZ 244/1, Holzrücken GZ 244/2)',
    credentialCategory: 'Gütezeichen',
    recognizedBy: {
      '@type': 'Organization',
      name: 'Gütegemeinschaft Wald- und Landschaftspflege e. V.',
    },
  },
  founder: {
    '@type': 'Person',
    name: company.address.person,
  },
}

// Leistungsangebot als OfferCatalog – maschinenlesbare Liste aller Services.
export const serviceCatalogLd = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  '@id': `${BASE_URL}/leistungen#catalog`,
  name: 'Forstdienstleistungen der Weiß Forst GbR',
  url: `${BASE_URL}/leistungen`,
  itemListElement: services.map((s, i) => ({
    '@type': 'Offer',
    position: i + 1,
    itemOffered: {
      '@type': 'Service',
      name: s.title,
      description: s.description,
      serviceType: s.title,
      areaServed: 'Mittelfranken, Bayern',
      provider: { '@id': `${BASE_URL}/#business` },
    },
  })),
}

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: `${BASE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'de-DE',
  publisher: { '@id': `${BASE_URL}/#business` },
}

export const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${BASE_URL}/#faq`,
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const breadcrumbLd = (path, label) => {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Start', item: `${BASE_URL}/` },
  ]
  if (path !== '/') {
    items.push({ '@type': 'ListItem', position: 2, name: label, item: abs(path) })
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

/* ------------------------------- Routen-Metadaten ------------------------------- */

const routes = {
  '/': {
    label: 'Start',
    title: 'Weiß Forst GbR – Forstdienstleistungen in Merkendorf & Mittelfranken',
    description:
      'Nachhaltige Forstdienstleistungen vom Familienbetrieb: Holzernte, Waldpflege, Pflanzung, Forstzaunbau sowie Brennholz & Hackschnitzel in Merkendorf, Mittelfranken. RAL-gütezeichengeprüft. Jetzt anfragen.',
    extraLd: [serviceCatalogLd, faqLd],
  },
  '/ueber-uns': {
    label: 'Über Uns',
    title: 'Über uns – Familienbetrieb für nachhaltige Forstwirtschaft | Weiß Forst GbR',
    description:
      'Lernen Sie die Weiß Forst GbR kennen: familiengeführter Forstbetrieb aus Merkendorf mit RAL-Gütezeichen 244 für Holzernte und Holzrücken. Werte, Zertifizierung und persönliche Betreuung.',
  },
  '/leistungen': {
    label: 'Dienstleistungen',
    title: 'Forstdienstleistungen – Holzernte, Waldpflege, Zaunbau, Brennholz | Weiß Forst GbR',
    description:
      'Unsere Leistungen im Überblick: Holzernte & Durchforstung, Waldpflege, Jungbaumpflanzung & Forstzaunbau sowie Brennholz und Hackschnitzel. Moderne Technik, nachhaltiger Ansatz in Mittelfranken.',
    ogImage: `${BASE_URL}/images/waldpflege.jpg`,
    extraLd: [serviceCatalogLd],
  },
  '/galerie': {
    label: 'Galerie',
    title: 'Galerie – Projekte aus Wald und Flur | Weiß Forst GbR',
    description:
      'Einblicke in erfolgreich umgesetzte Forstprojekte der Weiß Forst GbR: Holzernte, Waldpflege, Pflanzung und Zaunbau in Mittelfranken.',
  },
  '/kontakt': {
    label: 'Kontakt',
    title: 'Kontakt & Angebot anfragen | Weiß Forst GbR Merkendorf',
    description:
      'Kontaktieren Sie die Weiß Forst GbR in Merkendorf für eine unverbindliche Beratung oder ein Angebot zu Holzernte, Waldpflege, Zaunbau und Brennholz. Telefon, E-Mail und Kontaktformular.',
  },
  '/impressum': {
    label: 'Impressum',
    title: 'Impressum | Weiß Forst GbR',
    description: 'Impressum und Anbieterkennzeichnung der Weiß Forst GbR, Merkendorf.',
    robots: 'noindex,follow',
  },
  '/datenschutz': {
    label: 'Datenschutz',
    title: 'Datenschutzerklärung | Weiß Forst GbR',
    description:
      'Informationen zur Verarbeitung personenbezogener Daten auf der Website der Weiß Forst GbR gemäß DSGVO.',
    robots: 'noindex,follow',
  },
}

// Liste der prerender-/sitemap-relevanten Pfade (ohne 404).
export const seoRoutes = Object.keys(routes)

// Liefert das vollständige, aufgelöste SEO-Objekt für einen Pfad.
export function getRouteSeo(pathname) {
  const path = pathname || '/'
  const r = routes[path] || {
    label: 'Seite nicht gefunden',
    title: 'Seite nicht gefunden | Weiß Forst GbR',
    description: 'Die gewünschte Seite existiert nicht oder wurde verschoben.',
    robots: 'noindex,follow',
  }
  const url = abs(path)
  const jsonLd = [organizationLd, websiteLd, breadcrumbLd(path, r.label), ...(r.extraLd || [])]
  return {
    path,
    title: r.title,
    description: r.description,
    canonical: url,
    robots: r.robots || 'index,follow',
    ogImage: r.ogImage || DEFAULT_OG_IMAGE,
    jsonLd,
  }
}
