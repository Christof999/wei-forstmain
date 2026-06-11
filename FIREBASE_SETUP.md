# Firebase einrichten

Die Seite nutzt **Firebase** als Backend für:

- **Kontaktanfragen** (Firestore-Sammlung `contactRequests`) – vom Besucher
  abgeschickt, von dir in der Firebase Console eingesehen
- **Galerie** (Firebase Storage, Ordner `gallery/`) – nur lesend
- **Aktuelle Beiträge** (Firestore-Sammlung `posts`) – nur lesend

**Keine Authentifizierung.** Die Seite ist öffentlich und liest nur. Inhalte
(Bilder, Beiträge) pflegst du direkt in der **Firebase Console** – dort hast du
ohnehin Admin-Rechte, die die Security Rules umgehen.

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

## 3. Env-Variablen eintragen

Aus der `firebaseConfig` die folgenden Werte übernehmen:

| Variable | Firebase-Config-Feld |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

- **Lokal:** Datei `.env` anlegen (Vorlage `.env.example`).
- **Vercel:** Project → **Settings → Environment Variables** (Production,
  Preview, Development).

> Diese Werte sind **nicht geheim** – der Schutz läuft über die Security Rules.

## 4. Dienste aktivieren

- **Firestore Database** → „Datenbank erstellen" → Production-Modus, Region `eur3`.
- **Storage** → aktivieren.
- (Authentication wird **nicht** benötigt.)

## 5. Sicherheitsregeln

Diese Regeln erlauben öffentliches **Lesen** von Galerie/Beiträgen und das
**Anlegen** von Kontaktanfragen – aber kein öffentliches Schreiben/Löschen.
Du selbst bearbeitest Inhalte in der Console (Admin-Rechte umgehen die Regeln).

**Firestore** (Database → Regeln):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{doc} {
      allow read: if true;
      allow write: if false;
    }
    match /gallery/{doc} {
      allow read: if true;
      allow write: if false;
    }
    match /contactRequests/{doc} {
      allow create: if true;            // jeder darf eine Anfrage senden
      allow read, update, delete: if false;  // Verwaltung nur in der Console
    }
  }
}
```

**Storage** (Storage → Regeln):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{allPaths=**} {
      allow read: if true;        // get + list -> Auflisten des Ordners
      allow write: if false;
    }
  }
}
```

## 6. Inhalte pflegen (in der Firebase Console)

**Beitrag anlegen:** Firestore → Sammlung `posts` → Dokument hinzufügen mit den
Feldern `title` (string), `text` (string), `image` (string, Bild-URL, optional)
und `createdAt` (timestamp).

**Galeriebild hinzufügen:** Storage → Ordner `gallery/` → Bild(er) hochladen.
Mehr nicht – die Seite listet den Ordner automatisch auf und zeigt die Bilder
an. (Kein Firestore-Eintrag nötig.)

**Kontaktanfragen ansehen:** Firestore → Sammlung `contactRequests`.

---

Danach: `npm run dev` starten – Galerie und Beiträge werden aus Firebase
geladen, Anfragen aus dem Kontaktformular landen in `contactRequests`.
