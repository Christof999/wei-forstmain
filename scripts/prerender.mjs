// Statisches Prerendering aller Routen.
//
// Ablauf (siehe package.json -> "build"):
//   1. vite build              -> dist/ (Client-Assets + index.html-Template)
//   2. vite build --ssr ...    -> dist-ssr/entry-server.js (Render-Funktion)
//   3. node scripts/prerender.mjs (dieses Skript)
//
// Für jede Route wird der React-Baum zu HTML gerendert und zusammen mit den
// passenden <head>-Tags (Titel, Description, Canonical, Open Graph, JSON-LD)
// in das index.html-Template eingesetzt. Ergebnis: echte, sofort crawlbare
// HTML-Dateien pro Seite (dist/<route>/index.html) – ideal für Suchmaschinen
// und KI-/Answer-Engines, auch ohne JavaScript-Ausführung.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')

const { render } = await import(join(distDir, '..', 'dist-ssr', 'entry-server.js'))
const { getRouteSeo, seoRoutes, BASE_URL, SITE_NAME, LOCALE } = await import(
  join(root, 'src', 'seo.js')
)

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const jsonLdScript = (data) =>
  `<script type="application/ld+json" data-seo>${JSON.stringify(data).replace(
    /</g,
    '\\u003c',
  )}</script>`

function buildHead(seo) {
  const lines = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${esc(seo.robots)}" />`,
    `<link rel="canonical" href="${esc(seo.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${esc(LOCALE)}" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${esc(seo.canonical)}" />`,
    `<meta property="og:image" content="${esc(seo.ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${esc(seo.ogImage)}" />`,
    jsonLdScript(seo.jsonLd),
  ]
  return lines.join('\n    ')
}

const SEO_RE = /<!--seo:start-->[\s\S]*?<!--seo:end-->/

function compose(template, seo, appHtml) {
  return template
    .replace(SEO_RE, `<!--seo:start-->\n    ${buildHead(seo)}\n    <!--seo:end-->`)
    .replace('<!--app-html-->', appHtml)
}

async function writePage(routePath, html) {
  const outDir = routePath === '/' ? distDir : join(distDir, routePath)
  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'index.html'), html, 'utf8')
}

const template = await readFile(join(distDir, 'index.html'), 'utf8')

// 1) Alle definierten Routen prerendern.
for (const routePath of seoRoutes) {
  const seo = getRouteSeo(routePath)
  const appHtml = render(routePath)
  await writePage(routePath, compose(template, seo, appHtml))
  console.log(`prerendered ${routePath}`)
}

// 2) 404-Seite (SPA-Fallback für GitHub Pages / direkte Aufrufe).
const notFoundSeo = getRouteSeo('__notfound__')
const notFoundHtml = compose(template, notFoundSeo, render('/__notfound__'))
await writeFile(join(distDir, '404.html'), notFoundHtml, 'utf8')
console.log('prerendered 404.html')

// 3) sitemap.xml generieren.
const today = new Date().toISOString().slice(0, 10)
const urls = seoRoutes
  .map((p) => {
    const loc = p === '/' ? `${BASE_URL}/` : `${BASE_URL}${p}`
    const priority = p === '/' ? '1.0' : p === '/impressum' || p === '/datenschutz' ? '0.3' : '0.8'
    const changefreq = p === '/' ? 'weekly' : 'monthly'
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
await writeFile(join(distDir, 'sitemap.xml'), sitemap, 'utf8')
console.log('generated sitemap.xml')
