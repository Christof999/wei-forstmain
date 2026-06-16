// Zentrale Inhalts- und Konfigurationsdaten der Seite.

const S3 = 'https://website-imageslw.s3.eu-central-1.amazonaws.com'
const FB = 'https://firebasestorage.googleapis.com/v0/b/weissforstmain.firebasestorage.app/o'

export const company = {
  name: 'Weiß Forst GbR',
  tagline: 'Ihr Partner für professionelle Forstdienstleistungen',
  email: 'L.Weiss-Forstservice@gmx.de',
  phone: '01747468091',
  phoneHref: 'tel:+491747468091',
  address: {
    line1: 'Heglauer Straße 7',
    line2: '91732 Merkendorf',
    person: 'Lukas Weiß',
  },
}

export const nav = [
  { to: '/', label: 'Start' },
  { to: '/ueber-uns', label: 'Über Uns' },
  { to: '/leistungen', label: 'Dienstleistungen' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/kontakt', label: 'Kontakt' },
]

// Bestehende Bilder liegen weiterhin auf AWS S3 (öffentliche URLs).
export const img = {
  logo: '/logo.jpeg',
  headerVideo: '/media/header.mp4',
  headerVideoMobile: '/media/header.mobile.mp4',
  zaunbau: '/images/zaunbau.png',
  // Dienstleistungs-Fotos & Zertifikat
  // Forstdienstleistung: lokal aus public/images (die frühere Firebase-Galerie-
  // Datei wurde gelöscht -> 404). Lokale Bilder sind im Build gebündelt und
  // unabhängig von der Galerie-Verwaltung im Admin-Bereich.
  svcForstdienstleistung: '/images/forstdienstleistung.jpg',
  svcBrennholz: '/images/brennholz.jpg',
  svcWaldpflege: `${FB}/gallery%2F1781352295716_IMG_9227.jpeg?alt=media&token=053ad6b5-b657-4d87-99d7-f98b2d45d9e5`,
  zertifikat: `${FB}/gallery%2F1781352297349_IMG_9228.jpeg?alt=media&token=922404db-7b78-4804-be6d-f1b9806be5d3`,
  forestry: `${S3}/gallery/Weiß_Forst_Gbr_048.JPG`,
  waldpflege: `${S3}/gallery/Weiß_Forst_Gbr_008.JPG`,
  firewood: `${S3}/gallery/Weiß_Forst_Gbr_002.JPG`,
  consultation: `${S3}/gallery/Weiß_Forst_Gbr_030.JPG`,
}

// Fallback-Galerie (bis Bilder über Firebase gepflegt werden).
export const galleryFallback = [
  `${S3}/gallery/Weiß_Forst_Gbr_055.JPG`,
  `${S3}/gallery/Weiß_Forst_Gbr_048.JPG`,
  `${S3}/gallery/Weiß_Forst_Gbr_030.JPG`,
  `${S3}/gallery/Weiß_Forst_Gbr_008.JPG`,
  `${S3}/gallery/Weiß_Forst_Gbr_002.JPG`,
]

const galleryAltBySrc = {
  [`${S3}/gallery/Weiß_Forst_Gbr_055.JPG`]:
    'Holzrückung mit Forwarder im Wald – Weiß Forst GbR',
  [`${S3}/gallery/Weiß_Forst_Gbr_048.JPG`]:
    'Forstdienstleistung mit Harvester bei der Holzernte',
  [`${S3}/gallery/Weiß_Forst_Gbr_030.JPG`]:
    'Beratung und Planung am Waldrand in Mittelfranken',
  [`${S3}/gallery/Weiß_Forst_Gbr_008.JPG`]:
    'Waldpflege und Bestandsarbeiten im Forst',
  [`${S3}/gallery/Weiß_Forst_Gbr_002.JPG`]:
    'Brennholz-Aufarbeitung und Forstdienstleistung',
}

export function getGalleryAlt(src, index) {
  return galleryAltBySrc[src] || `Forstprojekt ${index + 1} – Weiß Forst GbR`
}

export const services = [
  {
    id: 'forestry',
    icon: 'Trees',
    title: 'Forstdienstleistungen',
    teaser: 'Effizient und nachhaltig – Ihre Holzernte in besten Händen.',
    image: img.svcForstdienstleistung,
    description:
      'Mit unserer Weiß Forst GbR und dem RAL-zertifizierten Forstservice Weiß bieten wir professionelle Forstdienstleistungen aus einer Hand. Ob Pflege junger Bestände, Durchforstung oder Holzernte – wir sorgen für gesunde Wälder, stabile Bestände und eine nachhaltige Nutzung Ihrer Ressourcen.',
    features: [
      'Jungbestandspflege',
      'Durchforstung und Holzeinschlag',
      'Holzrückung und Transport',
    ],
  },
  {
    id: 'firewood',
    icon: 'Flame',
    title: 'Brennholz & Hackschnitzel',
    teaser: 'Hochwertige Energie aus nachhaltiger Forstwirtschaft.',
    image: img.svcBrennholz,
    description:
      'Wir bieten hochwertiges Brennholz und Hackschnitzel aus nachhaltiger Forstwirtschaft. Ideal für die umweltfreundliche Beheizung von Wohnräumen und für industrielle Heizsysteme.',
    features: [
      'Verschiedene Holzarten und Längen verfügbar',
      'Getrocknetes und frisches Holz',
      'Lieferung oder Selbstabholung',
    ],
  },
  {
    id: 'reforestation',
    icon: 'Sprout',
    title: 'Pflanzung & Zaunbau',
    teaser: 'Professionelle Umsetzung Ihrer Zaun- und Pflanzprojekte.',
    image: img.zaunbau,
    description:
      'Wir übernehmen die Anpflanzung von Jungbäumen und die Errichtung von Forstzäunen, um neue Bestände zu sichern und vor Wildverbiss zu schützen. So sorgen wir dafür, dass Ihr Wald gesund wächst und sich optimal entwickeln kann.',
    features: [
      'Jungbaumpflanzung für stabile und vitale Bestände',
      'Forstzaunbau – Schutz vor Wildverbiss',
      'Pflege und Kontrolle der Zäune',
    ],
  },
  {
    id: 'forest-care',
    icon: 'Leaf',
    title: 'Waldpflege',
    teaser: 'Gesunde Wälder für kommende Generationen.',
    image: img.svcWaldpflege,
    description:
      'Waldpflege sorgt dafür, dass Wälder stark, vital und artenreich bleiben. Sie schützt die Natur, stärkt die Widerstandskraft der Bäume und sichert den Wald als wertvollen Lebensraum für kommende Generationen.',
    features: ['Durchforstung und Bestandspflege', 'Jungbestandspflege'],
  },
]

export const values = [
  {
    icon: 'Leaf',
    title: 'Nachhaltigkeit',
    text: 'Respektvoller Umgang mit der Natur und ihren Ressourcen.',
  },
  {
    icon: 'BadgeCheck',
    title: 'Qualität',
    text: 'Höchste Standards bei allen unseren Dienstleistungen.',
  },
  {
    icon: 'Handshake',
    title: 'Zuverlässigkeit',
    text: 'Termintreue und verbindliche Zusammenarbeit.',
  },
]

// Häufige Fragen – sichtbar auf der Startseite UND als FAQPage-Structured-Data
// (wichtig für Answer-Engine-Optimierung / KI-Suchen & Google-Rich-Results).
export const faqs = [
  {
    q: 'Welche Forstdienstleistungen bietet die Weiß Forst GbR an?',
    a: 'Wir übernehmen Holzernte und Durchforstung, Holzrückung und -transport, Jungbestands- und Waldpflege, Pflanzung und Forstzaunbau sowie die Aufarbeitung von Brennholz und Hackschnitzeln – alles aus einer Hand und nach nachhaltigen Grundsätzen.',
  },
  {
    q: 'In welcher Region ist die Weiß Forst GbR tätig?',
    a: 'Wir sind als Familienbetrieb in Merkendorf (Landkreis Ansbach) ansässig und arbeiten in ganz Mittelfranken und Bayern. Sprechen Sie uns auch bei Projekten in der weiteren Umgebung gerne an.',
  },
  {
    q: 'Verkaufen Sie Brennholz und Hackschnitzel?',
    a: 'Ja. Wir liefern hochwertiges Brennholz und Hackschnitzel aus nachhaltiger Forstwirtschaft – in verschiedenen Holzarten und Längen, getrocknet oder frisch, wahlweise mit Lieferung oder zur Selbstabholung.',
  },
  {
    q: 'Was bedeutet das RAL-Gütezeichen für Holzernte und Holzrücken?',
    a: 'Unser Forstservice ist mit dem RAL-Gütezeichen 244 „Wald- und Landschaftspflege" (GZ 244/1 Holzernte und GZ 244/2 Holzrücken) ausgezeichnet. Es steht für unabhängig geprüfte Qualität, fachgerechte Ausführung und einen verantwortungsvollen Umgang mit Wald und Technik – regelmäßig kontrolliert.',
  },
  {
    q: 'Wie kann ich ein Angebot anfordern?',
    a: 'Am schnellsten erreichen Sie uns telefonisch oder über das Kontaktformular auf unserer Website. Beschreiben Sie Ihr Projekt kurz – wir melden uns zeitnah mit einer persönlichen, unverbindlichen Beratung.',
  },
]

export const sloganLines = [
  { letter: 'W', text: 'ir packen an – zuverlässig und professionell.' },
  { letter: 'E', text: 'insatz mit Herz, Hand und Verstand.' },
  { letter: 'I', text: 'ndividuelle Lösungen für jeden Bestand.' },
  { letter: 'S', text: 'tarke Wurzeln – als Familie und Betrieb.' },
  { letter: 'S', text: 'icher, sauber, nachhaltig.' },
]
