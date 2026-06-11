# Firebase einrichten

Die Seite nutzt **Firebase** als Backend für:

- **Kontaktanfragen** (Firestore-Sammlung `contactRequests`)
- **Galerie** (Firebase Storage + Firestore-Sammlung `gallery`)
- **Aktuelle Beiträge** (Firestore-Sammlung `posts`)
- **Admin-Login** (Firebase Authentication)

Solange keine gültige Konfiguration hinterlegt ist, läuft die Seite im
**Demo-Modus**: Galerie/Beiträge nutzen Fallback-Daten und das Kontaktformular
öffnet den E-Mail-Client.

---

## 1. Projekt anlegen

1. <https://console.firebase.google.com> öffnen → **Projekt hinzufügen**.
2. Name z. B. `weiss-forst`, Google Analytics optional.

## 2. Web-App registrieren

1. Im Projekt auf das **Web-Symbol `</>`** klicken.
2. App-Name vergeben (z. B. „Website"), **Hosting nicht** nötig.
3. Die angezeigte `firebaseConfig` enthält die Werte für die `.env`.

## 3. `.env` anlegen

Kopiere `.env.example` zu `.env` und trage die Werte ein:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=weiss-forst.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=weiss-forst
VITE_FIREBASE_STORAGE_BUCKET=weiss-forst.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
```

> Diese Werte sind **nicht geheim** – der Schutz läuft über die Security Rules.

Für das **Deployment** dieselben Werte in **Vercel** hinterlegen
(Project → Settings → Environment Variables), Namen identisch, für alle
Environments (Production, Preview, Development).

## 4. Dienste aktivieren

- **Firestore Database** → „Datenbank erstellen" → Production-Modus, Region `eur3`.
- **Storage** → aktivieren.
- **Authentication** → „E-Mail/Passwort" aktivieren → unter **Users** einen
  Admin-Benutzer anlegen (E-Mail + Passwort). Damit meldest du dich unter
  `/login` an.

## 5. Sicherheitsregeln

**Firestore** (Database → Regeln):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Beiträge & Galerie: öffentlich lesbar, nur Admins schreiben
    match /posts/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /gallery/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Kontaktanfragen: jeder darf senden, nur Admins lesen/löschen
    match /contactRequests/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

**Storage** (Storage → Regeln):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{file} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 6. Erlaubte Domains

Authentication → Settings → **Authorized domains**: die Live-Domain
(`www.xn--wei-forst-i1a.de`), die Vercel-Domain (`<projekt>.vercel.app`)
und `localhost` hinzufügen.

---

Danach: `npm run dev`, unter `/login` anmelden und im Admin-Bereich Bilder,
Beiträge sowie eingegangene Anfragen verwalten.
