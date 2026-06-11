# Weiß Forst GbR – Website

Moderne Website der **Weiß Forst GbR** (Forstdienstleistungen).
Neuaufbau mit **React + Vite + Framer Motion**, Backend über **Firebase**.

## Tech-Stack

- **React 18** + **Vite 5**
- **React Router** (Mehrseiten-Navigation mit Seitenübergängen)
- **Framer Motion** (Animationen, Scroll-Reveals, Page-Transitions)
- **lucide-react** (Vektor-Icons)
- **Firebase** (Firestore, Storage, Auth) – Galerie, Beiträge, Kontaktanfragen

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
  pages/           Home, About, Services, Gallery, Contact, Admin, …
  lib/             firebase.js (Backend), useAuth.js
  data/            site.js (Inhalte, Kontaktdaten, Services)
  styles/          global.css (Design-Tokens), pages.css
```
