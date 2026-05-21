# PGD Versioning Spec
#pgd

## Konzept

Jede Änderung am Trainingsplan wird als **Tages-Snapshot** unter dem jeweiligen User gespeichert. Der initiale Plan `plan-v1.json` bleibt als Referenz erhalten. Die App rendert immer `current = applyChanges(plan-v1, snapshots)`. Die KI analysiert das Delta zwischen Initialplan und aktueller Version.

---

## Datei- und Ordnerstruktur

```
2026_PGD-FitnessPlanner/
├── server.py                ← lokaler Mini-Server (HTTP + Claude-API-Proxy)
├── start-app.command        ← Start-Skript (macOS)
├── .env                     ← ANTHROPIC_API_KEY (gitignored)
├── index.html
├── shared/styles.css
├── pgd-features/
│   ├── inputform/
│   │   ├── pgd-inputform.html
│   │   └── pgd-inputform.js
│   └── training-plan/
│       ├── pgd-fitnessplan.js     ← App-Code (readonly für Daten)
│       ├── pgd-trainingsplan1.md  ← Quell-Plan-Referenz
│       ├── pgd-versioning.md      ← Diese Spec
│       └── users/
│           ├── katharina/
│           │   ├── profile.json        ← Persönliche Daten
│           │   ├── plan-v1.json        ← Initialer Plan (readonly als Referenz)
│           │   └── changes/
│           │       └── YYYY-MM-DD.json ← Tages-Snapshot mit Deltas
│           └── anna/
│               └── ...
```

---

## Regeln

1. `plan-v1.json` wird **einmalig** generiert (via Claude API, basierend auf profile.json)
2. `pgd-fitnessplan.js` wird **nicht durch Daten** verändert – die App rendert immer `current = applyChanges(plan-v1, snapshots)`
3. Pro Tag **eine** Change-Datei pro User – alle Änderungen des Tages in einem Snapshot
4. Dateiname immer `YYYY-MM-DD.json` (ohne Suffix)
5. Kein Change → keine Datei

---

## User-Management

- **Discovery:** App liest `users/`-Unterordner via `GET /pgd-features/training-plan/users/_list`
- **URL-Parameter:** `index.html?user=katharina` lädt diesen User. Dropdown im Header wechselt.
- **Default-User:** `localStorage.getItem('lastUser')` wird verwendet, wenn keine URL-Parameter
- **Neuer User:** Inputform `?new=1` → profile.json + Claude API → plan-v1.json
- **User löschen:** Button im Profil-Bereich → `DELETE /users/{id}` (rekursiv) → localStorage clearen
- **User-ID:** `slugifyName(name)` = lowercase, Bindestriche statt Sonderzeichen, max 40 Zeichen

---

## Kategorien (aus `pgd-fitnessplan.js`)

| Key | Label | SubGoal |
|-----|-------|---------|
| `mobility` | Mobility | Stabilität & Beweglichkeit |
| `yoga` | Yoga | Stabilität & Beweglichkeit |
| `balance` | Balance | Stabilität & Beweglichkeit |
| `rad` | Cardio Radfahren | Paddel Power |
| `laufen` | Cardio Laufen | Paddel Power |
| `paddeln` | Paddeln | Paddel Power |
| `schwimmen` | Schwimmen | Paddel Power |
| `kraft` | Kraft | Paddel Power |
| `kraft-upper` | Kraft Upper | Paddel Power |
| `kraft-lower` | Kraft Lower | Surf Strength |
| `hiit` | HIIT | Surf Strength |
| `popup` | Pop-up Training | Surf Strength |
| `surfen-eisbach` | Surfen Eisbach | Surf Strength |
| `surfen-o2` | Surfen o2 Surftown | Surf Strength |
| `surfen-jochen` | Surfen Jochen Schweizer | Surf Strength |
| `erholung` | Erholung | — (excluded) |

---

## unitId Format

```
w{weekIdx}-d{dayIdx}-u{unitIdx}
```

- `weekIdx` 0–5 (6 Wochen)
- `dayIdx` 0–6 (Mo=0 … So=6)
- `unitIdx` 0-basiert je Tag

Beispiele: `w0-d4-u0`, `w1-d2-u0`, `w3-d6-u1`

---

## Change-Datei Schema

```json
{
  "meta": {
    "version": "YYYY-MM-DD",
    "versionNumber": 1,
    "createdAt": "YYYY-MM-DD",
    "basedOn": "base | YYYY-MM-DD",
    "changedBy": "string",
    "trigger": "user-edit | coach-suggestion | review",
    "summary": "Kurzbeschreibung der Änderungen",
    "updatedAt": "ISO-Timestamp"
  },
  "changes": [
    {
      "id": "c1",
      "unitId": "w1-d1-u0",
      "field": "category | title | duration | detail | completed | dayIdx | removed | added",
      "from": "Ursprungswert",
      "to": "Neuer Wert",
      "reason": "Warum wurde geändert"
    }
  ],
  "delta": {
    "categoryShifts": { "mobility": 0, "yoga": 0 },
    "durationDeltaMin": 0,
    "unitsAdded": 0,
    "unitsRemoved": 0
  },
  "goalImpact": null
}
```

---

## `changes[].field` Werte

| Wert | Bedeutung |
|------|-----------|
| `category` | Kategorie geändert (gültiger Key aus Kategorien-Tabelle) |
| `title` | Titel der Einheit geändert |
| `duration` | Dauer in Minuten geändert |
| `detail` | Detailliste geändert |
| `completed` | Erledigt-Häkchen (Boolean) |
| `dayIdx` | Einheit auf anderen Wochentag verschoben (0=Mo … 6=So) |
| `removed` | Einheit entfernt (`to: null`) |
| `added` | Neue Einheit hinzugefügt (`from: null`) |

---

## Server-Endpoints

**Read:**
- `GET /pgd-features/training-plan/users/_list` – Liste aller User-Ordner
- `GET /pgd-features/training-plan/users/{id}/profile.json`
- `GET /pgd-features/training-plan/users/{id}/plan-v1.json`
- `GET /pgd-features/training-plan/users/{id}/changes/_list` – Liste aller Snapshot-Dateien
- `GET /pgd-features/training-plan/users/{id}/changes/YYYY-MM-DD.json`

**Write:**
- `PUT /pgd-features/training-plan/users/{id}/profile.json`
- `PUT /pgd-features/training-plan/users/{id}/plan-v1.json`
- `PUT /pgd-features/training-plan/users/{id}/changes/YYYY-MM-DD.json`

**Delete:**
- `DELETE /pgd-features/training-plan/users/{id}/changes/YYYY-MM-DD.json` (einzelne Datei)
- `DELETE /pgd-features/training-plan/users/{id}` (User-Ordner rekursiv)

**Claude API Proxy:**
- `POST /api/generate-plan` Body: `{ "profile": {...} }` → Response: `{ "plan": {...} }`

---

## App-Logik

### Aktuellen Plan laden
```js
const userId = readUserId();  // URL ?user= oder localStorage.lastUser
const plan = await fetch(`/users/${userId}/plan-v1.json`).then(r => r.json());
const files = await fetch(`/users/${userId}/changes/_list`).then(r => r.json());
const snapshots = await Promise.all(
  files.filter(n => /^\d{4}-\d{2}-\d{2}\.json$/.test(n))
       .map(n => fetch(`/users/${userId}/changes/${n}`).then(r => r.json()))
);
const current = applyChanges(plan, snapshots);
renderPlan(current);
```

### Plan-Generierung für neuen User (AI Feature 3)
```js
const profile = collectProfile();
const userId = slugifyName(profile.personal.name);
await PUT(`/users/${userId}/profile.json`, { profile, profileUpdatedAt: now });
const { plan } = await POST('/api/generate-plan', { profile });
await PUT(`/users/${userId}/plan-v1.json`, plan);
localStorage.setItem('lastUser', userId);
window.location = `/index.html?user=${userId}`;
```

### Goal-Coach-Prompt (system, cache_control: ephemeral)
Siehe `server.py` → `SYSTEM_PROMPT`. Modell: `claude-sonnet-4-6`. Antwort: striktes JSON (kein Prosa-Wrap).

### User löschen
```js
await fetch(`/users/${userId}`, { method: 'DELETE' });
localStorage.removeItem('lastUser');
window.location = '/index.html';
```

---

## Setup

1. `.env.example` → `.env` umbenennen
2. `ANTHROPIC_API_KEY=sk-ant-...` eintragen (Key aus Anthropic Console, Plans & Billing aufgeladen)
3. Doppelklick `start-app.command` → Server startet auf `http://localhost:8765`
4. Browser öffnet sich automatisch
5. Strg+C im Terminal beendet Server

---

## Versionsverlauf

```
2026-05-20  → Surf-Kategorien hinzugefügt, Kalender-Fix, schemaVersion 4
2026-05-21  → Server-Mode + Multi-User (users/{id}/), Claude-API-Plan-Generierung
```
