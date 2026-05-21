# PGD Versioning Spec
#pgd

## Konzept

Jede Änderung am Trainingsplan wird als **Tages-Snapshot** gespeichert.  
Der Basisplan bleibt immer unverändert als Referenz erhalten.  
In der Applikation wird immer der Snapshot mit den letzten Änderungen des Users gespeichert.
Die KI analysiert das Delta zwischen Basis und aktueller Version.

---

## Dateistruktur

```
pgd-features/training-plan/
├── pgd-fitnessplan.js        ← App · Source of Truth (readonly, nie überschreiben)
├── pgd-fitnessplan.md        ← Obsidian-Referenz (readonly)
└── versions/
    ├── base.json             ← Basisplan als JSON (readonly, KI-Referenz)
    ├── 2026-05-20.json       ← Change-Snapshot Tag 1
    ├── 2026-05-22.json       ← Change-Snapshot Tag 2
    └── ...
```

---

## Regeln

1. `base.json` wird **einmalig** generiert – nie überschreiben
2. `pgd-fitnessplan.js` wird **nie** verändert – die App rendert immer `current`
3. Pro Tag **maximal eine** Change-Datei – alle Änderungen des Tages in einem Snapshot
4. Dateiname immer `YYYY-MM-DD.json`
5. Kein Change an einem Tag → keine Datei

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
    "versionNumber": 2,
    "createdAt": "YYYY-MM-DD",
    "basedOn": "base | YYYY-MM-DD",
    "changedBy": "string",
    "trigger": "user-edit | coach-suggestion | review",
    "summary": "Kurzbeschreibung der Änderungen"
  },
  "changes": [
    {
      "id": "c1",
      "unitId": "w1-d1-u0",
      "field": "category | title | duration | detail | dayIdx",
      "from": "Ursprungswert",
      "to": "Neuer Wert",
      "reason": "Warum wurde geändert"
    }
  ],
  "delta": {
    "categoryShifts": {
      "mobility": 0,
      "yoga": 0,
      "rad": 0,
      "paddeln": 0,
      "kraft": 0,
      "hiit": 0,
      "erholung": 0
    },
    "durationDeltaMin": 0,
    "unitsAdded": 0,
    "unitsRemoved": 0
  },
  "goalImpact": {
    "overall": "positiv | neutral | negativ",
    "paddlePower": {
      "impact": "positiv | neutral | negativ",
      "reason": "string",
      "score": "+1 | 0 | -1"
    },
    "surfStrength": {
      "impact": "positiv | neutral | negativ",
      "reason": "string",
      "score": "+1 | 0 | -1"
    },
    "mobility": {
      "impact": "positiv | neutral | negativ",
      "reason": "string",
      "score": "+1 | 0 | -1"
    },
    "riskFlags": [
      { "flag": "string", "mitigation": "string" }
    ],
    "recommendation": "string"
  }
}
```

---

## `changes[].field` Werte

| Wert | Bedeutung |
|------|-----------|
| `category` | Kategorie geändert – muss ein gültiger Key aus Kategorien-Tabelle sein |
| `title` | Titel der Einheit geändert |
| `duration` | Dauer in Minuten geändert |
| `detail` | Detailliste geändert |
| `completed` | Erledigt-Häkchen toggle (Boolean, Progress-Tracking) |
| `dayIdx` | Einheit auf anderen Wochentag verschoben (0=Mo … 6=So) |
| `removed` | Einheit entfernt (`to: null`) |
| `added` | Neue Einheit hinzugefügt (`from: null`) |

---

## App-Logik (für Cursor)

### Server-Setup (Pflicht)
Die App wird über `start-app.command` (Doppelklick) gestartet. Das ruft `server.py` auf, der einen kleinen HTTP-Server auf `http://localhost:8765` startet und Chrome/Safari öffnet.

- **GET** `/pgd-features/training-plan/trainingsplan-changes/base.json` → liefert base.json
- **GET** `/pgd-features/training-plan/trainingsplan-changes/_list` → JSON-Array aller Snapshot-Dateien
- **PUT** `/pgd-features/training-plan/trainingsplan-changes/YYYY-MM-DD.json` → schreibt Snapshot (base.json gesperrt)
- **DELETE** `/pgd-features/training-plan/trainingsplan-changes/YYYY-MM-DD.json` → löscht Snapshot

**Kein localStorage mehr** — JSON-Dateien sind die Wahrheit. Sobald die App lädt, holt sie base.json + alle YYYY-MM-DD.json und rendert das Ergebnis.

### Aktuellen Plan laden
```js
const base = await fetch(`${CHANGES_PATH}/base.json`).then(r => r.json())
const files = await fetch(`${CHANGES_PATH}/_list`).then(r => r.json())
const snapshots = await Promise.all(
  files.filter(n => /^\d{4}-\d{2}-\d{2}\.json$/.test(n))
       .map(n => fetch(`${CHANGES_PATH}/${n}`).then(r => r.json()))
)
const current = applyChanges(base, snapshots)
renderPlan(current)
```

### Bei Nutzer-Änderung (Edit-Modal Submit)
```js
const today = '2026-05-22' // YYYY-MM-DD
const todayFile = `versions/${today}.json`

// Bestehenden Snapshot laden oder neu anlegen
const snapshot = await loadJSON(todayFile) || createEmptySnapshot(today)

// Change anhängen
snapshot.changes.push({
  id: `c${snapshot.changes.length + 1}`,
  unitId: `w${weekIdx}-d${dayIdx}-u${unitIdx}`,
  field: changedField,
  from: oldValue,
  to: newValue,
  reason: 'user-edit'
})

// Delta berechnen
snapshot.delta = calculateDelta(base, snapshot.changes)

// goalImpact via Claude API (Goal Coach)
snapshot.goalImpact = await goalCoach(base, snapshot)

// Speichern
await saveJSON(todayFile, snapshot)
```

### `applyChanges(base, changeFiles)`
```js
// 1. changeFiles nach Datum sortieren (älteste zuerst)
// 2. Für jede Datei: changes[] iterieren
// 3. unitId auflösen → weeks[w].days[d].units[u]
// 4. field anwenden (category, title, duration, detail, dayIdx)
// 5. Modifiziertes base-Objekt zurückgeben
```

---

## Goal Coach Prompt

```
Du bist ein Fitness-Coach. Analysiere folgende Planänderungen.

PROFIL: Advanced Training · Intermediate Surf · Max HF 176 bpm
ZIEL: Malediven Surftrip · 20. Juni 2026 · 5 Tage · 3h/Tag

ÄNDERUNGEN:
{changes[]}

Berechne goalImpact als JSON:
- overall: positiv | neutral | negativ
- paddlePower, surfStrength, mobility: je impact + reason + score
- riskFlags falls vorhanden
- recommendation (1–2 Sätze)

Antworte NUR als JSON, kein Text davor oder danach.
```

---

## Versionsverlauf

```
base            → seedState aus pgd-fitnessplan.js · schemaVersion 4
2026-05-20      → Surf-Kategorien hinzugefügt · Kalender-Fix · schemaVersion 4
2026-05-XX      → nächster Change-Tag
```
