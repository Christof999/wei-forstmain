# Weiß Forst GbR – Website

Moderne Website der **Weiß Forst GbR** (Forstdienstleistungen).
Neuaufbau mit **React + Vite + Framer Motion**, Backend über **Firebase**.

## Tech-Stack

- **React 18** + **Vite 5**
- **React Router** (Mehrseiten-Navigation mit Seitenübergängen)
- **Framer Motion** (Animationen, Scroll-Reveals, Page-Transitions)
- **lucide-react** (Vektor-Icons)
- **Firebase** (Firestore, Storage) – Galerie, Beiträge, Kontaktanfragen
  (öffentlich, ohne Login – Inhalte werden in der Firebase Console gepflegt)

## Lokale Entwicklung

```bash
npm install
cp .env.example .env   # Firebase-Werte eintragen (optional, siehe unten)
npm run dev            # http://localhost:5173
npm run build          # Produktions-Build nach dist/
npm run preview        # Build lokal testen
```

Ohne Firebase-Konfiguration läuft die Seite im **Demo-Modus**
(Fallback-Galerie, Kontaktformular öffnet den E-Mail-Client).

## Backend / Firebase

Die Einrichtung von Firebase (Projekt, Firestore, Storage, Auth, Security
Rules) ist Schritt für Schritt in **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**
beschrieben. Hintergrund: Das frühere AWS-Backend ist nicht mehr zugänglich
und wurde durch Firebase ersetzt. Bestehende Galeriebilder werden vorerst
weiter von ihren öffentlichen S3-URLs geladen; neue Bilder laufen über Firebase.

## SEO / GEO / AEO & Crawlbarkeit

Die Seite ist eine React-SPA, wird beim Build aber zu echten, sofort
crawlbaren HTML-Dateien **vorgerendert** (Static Prerendering):

```bash
npm run build
# 1) vite build                      -> dist/ (Client-Assets + index.html)
# 2) vite build --ssr entry-server   -> dist-ssr/ (Render-Funktion)
# 3) node scripts/prerender.mjs      -> dist/<route>/index.html + sitemap.xml
```

Jede Route (`/`, `/ueber-uns`, `/leistungen`, …) erhält eine eigene HTML-Datei
mit vollständig gerendertem Inhalt im `#root` – Suchmaschinen und KI-/Answer-
Engines sehen den Text auch ohne JavaScript.

- **`src/seo.js`** – zentrale SEO-Konfiguration: Titel, Descriptions,
  Canonicals, Open-Graph/Twitter sowie JSON-LD Structured Data
  (LocalBusiness, OfferCatalog/Service, FAQPage, BreadcrumbList, WebSite).
- **`src/components/Seo.jsx`** – hält den `<head>` bei SPA-Navigation aktuell.
- **`scripts/prerender.mjs`** – erzeugt die statischen HTML-Dateien,
  `sitemap.xml` und die `404.html`.
- **`public/robots.txt`** – verweist auf die Sitemap, erlaubt alle Crawler.
- Sichtbarer **FAQ-Bereich** auf der Startseite (+ FAQ-Structured-Data) für
  Answer-Engine-Optimierung.

## Deployment (Vercel)

Gehostet auf **Vercel**. Vercel erkennt Vite automatisch; die SPA-Rewrites
stehen in `vercel.json`.

Einmalig nötig:

1. Auf <https://vercel.com> das GitHub-Repo importieren (Framework: **Vite**).
2. Firebase-Werte unter **Project → Settings → Environment Variables**
   hinterlegen (gleiche Namen wie in `.env.example`), für alle Environments.
3. Custom-Domain unter **Project → Settings → Domains** hinzufügen.

**Branch-Previews:** Jeder Push auf einen Branch bzw. jeder Pull Request
erhält automatisch eine eigene Preview-URL. `main` (bzw. der Production-Branch)
wird auf die Live-Domain deployed.

## Projektstruktur

```
public/            statische Assets (Logo, Header-Video, CNAME)
src/
  components/      Navbar, Footer, Lightbox, Reveal, Icon, …
  pages/           Home, About, Services, Gallery, Contact, Impressum, …
  lib/             firebase.js (Backend), useAuth.js
  data/            site.js (Inhalte, Kontaktdaten, Services)
  styles/          global.css (Design-Tokens), pages.css
```
