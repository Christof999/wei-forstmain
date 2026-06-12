// Zentrale Inhalts- und Konfigurationsdaten der Seite.

const S3 = 'https://website-imageslw.s3.eu-central-1.amazonaws.com'

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
  // Dienstleistungs-Fotos (direkt vom Kunden hochgeladen, fürs Web optimiert)
  svcForstdienstleistung: '/images/forstdienstleistung.jpg',
  svcBrennholz: '/images/brennholz.jpg',
  svcWaldpflege: '/images/waldpflege.jpg',
  zertifikat: '/images/zertifikat-holzernte.jpg',
  team: `${S3}/gallery/Weiß_Forst_Gbr_055.JPG`,
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

export const sloganLines = [
  { letter: 'W', text: 'ir packen an – zuverlässig und professionell.' },
  { letter: 'E', text: 'insatz mit Herz, Hand und Verstand.' },
  { letter: 'I', text: 'ndividuelle Lösungen für jeden Bestand.' },
  { letter: 'S', text: 'tarke Wurzeln – als Familie und Betrieb.' },
  { letter: 'S', text: 'icher, sauber, nachhaltig.' },
]
