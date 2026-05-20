# Kontext: Persönliche Fitnessplaner App

My background: I am not a developer. I work with Cursor and Claude Code to build this app. Always explain things in simple, non-technical language. No jargon. If you need to mention code, show me exactly what to write and where.

How to help me: When I describe a feature, first confirm you understood it in one sentence. Then give me the smallest possible next step — not the whole solution at once. If something is unclear, ask me one question before proceeding.

Current status: Check [CONTEXT.md](http://CONTEXT.md) for the latest project state before answering.

## Ziel

I am building a web app called PGD = Plan Goals Dynamically. The app helps users create personalized training plans and track their fitness progress towards their goal in a certain time frame. It supports to keep on track during daily dynamics of life.

Aktueller Inhalt des Prototyp: **Malediven Surftrip · 20. Juni 2025** — ein 6-Wochen-Aufbauplan (15. Mai – 22. Juni 2025) mit Rücksicht auf eine Zahn-OP vom 7.7.

## Tech & Setup

- **Stack**: Statische Web-App (HTML / CSS / Vanilla JS) — läuft per Doppelklick auf `index.html` oder live auf GitHub Pages
- **Repo**: [https://github.com/katkruACN/trainingsplan](https://github.com/katkruACN/trainingsplan) (public)
- **Speicherung**: Auto-Save in `localStorage` (Key: `trainingsplan-v2`) + JSON Import/Export
- **Sprache**: Deutsch
- **Design**: Minimalistisch & klar

## Aktuelle Features

1. **Definierter Zeitrahmen: 6 Wochen** (Mo–So), je 7 Tage; Wochen-Tabs oben mit Done-Counter pro Woche
2. **Einheiten: Max. 2 Einheiten pro Tag**
3. **Inputformular:**
4. **Zieldefinition:** Es gibt drei Ziel-Kategorien für die Sportart Surfen, gegen die das Training ausgerichtet wird. Aktivitäten die in eine Kategorie einzahlen. Diese sind farblich entsprechend zugeordnet.
  ### Paddle Power - labels Blau (#2563eb)
  - Cardio Training wie: Paddeln, Radfahren, Laufen, Schwimmen
  - Krafttraining Upper body
  ### Surf Strength - labels Orange (#f97316)
  - Surfen 
  - HIIT
  - Krafttraining Lower body
  - Pop-up Training
  ### Stabilität & Beweglichkeit - labels — Teal (#14b8a6)
  - Yoga 
  - Mobility
  - Balance

Erholung — Grün (#22c55e)

**Lieblingsort für Sporteinheiten:** können vom vom User als Zusatzinfo definiert werden. Sie haben Einfluss auf zeitliche Planung der Einheit je nach Anreise und Buchung.

1. Mobility — zu Hause
2. Yoga — Sanctuary Studio (buchen, immer 60 min. session)
3. Cardio Rad — Draussen
4. Cardio Laufen — Draussen
5. Surfen - Eisbach
6. Surfen - o2 Surftown (buchen)
7. Surfen - Jochen Schweizer (donnerstags 20-21h) 
8. Paddeln — Feldmoching (Zeit planen für Anfahrt 25 min)
9. Schwimmen — Nordbad (Anfahrt nur 10 min)
10. Kraft Upper — Leo's Fitness (Anfahrt nur 10 min)
11. Kraft Lower — Leo's Fitness
12. HIIT — Limitlezz (buchen, immer 45 min. session)
13. **Wochenziel** ist fest gesetzt je nach Phase
14. **Phasenname** im Header der jeweiligen Woche, die mit Datum angezeigt wird
15. **Datum pro Tag** (z. B. „15. Mai", „20. Mai", „20. Juni 🏄")
16. **Bearbeiten-Dialog**: Kategorie, Dauer (Min), Tauschen der Einheiten nach Wochentagen, Titel
17. **Checkbox** pro Einheit; erledigte Einheiten grün hinterlegt, ganzer Tag wird grün wenn alle Einheiten erledigt
18. **Fortschrittsbalken** über den definierten Zeitraum (`X von Y Einheiten erledigt — Z %`)
19. **Motivierender Spruch** rotiert beim jedem Fortschritt durch abgehakte Einheiten beim Laden (kein direkter Wiederholer

## Input Ziele und Trainingsplan

Quelle: [trainingsplan.md](trainingsplan.md). Hier ist der initiale Content für den Plan.

Um einen Startpunkt zu haben füllt der User das Input Formular aus: inputform.js 

Auf Basis der Daten wird der Trainings Content erstellt. 

## Inhaltliche Struktur (Seed Data)

Quelle: [trainingsplan.md](trainingsplan.md) (übernommen, in 6-Wochen-Raster überführt).


| Woche | Zeitraum          | Schwerpunkt                                               |
| ----- | ----------------- | --------------------------------------------------------- |
| 1     | 11.–17. Mai       | Sanfter Wiedereinstieg nach OP — erste Rad-Runde          |
| 2     | 18.–24. Mai       | Langsamer Einstieg in Trainingsplan                       |
| 3     | 25.–31. Mai       | Grundlagen Training: Kraft starten & erste Paddel-Session |
| 4     | 1.–7. Juni        | Intensivieren Training: HIIT & Paddel-km steigern         |
| 5     | 8.–14. Juni       | Peak-Block Trainingsintensität                            |
| 6     | 15.–21. Juni      | Tapering & Abflug ✈️ Malediven 20. Juni                   |


## Datenmodell

```json
{
  "phaseName": "Malediven Surftrip · 20. Juni 2025",
  "weeks": [
    {
      "goal": "Wochenziel",
      "days": [
        {
          "date": "12. Mai",
          "units": [
            {
              "category": "mobility|yoga|rad|paddeln|kraft|hiit|erholung",
              "title": "",
              "description": "",
              "detail": ["Bullet 1", "Bullet 2"],
              "duration": 20,
              "completed": false
            }
          ]
        }
      ]
    }
  ]
}
```

## Dateien

- [index.html](index.html) — Markup, Dialog für Bearbeiten
- [styles.css](styles.css) — Styling, Kategorie-Farben, Responsive Layout
- [fitnessplan.js](fitnessplan.js) — State, Seed-Daten, Rendering, Import/Export, LocalStorage
- [trainingsplan.md](http://trainingsplan.md) - initialer Trainingsplan Content basierend auf dem Input des Users zum Fitness Status
- inputform.html - ininitaler Input des Users für den Trainibngsplan 
- inputform.js - ininitaler Input des Users für den Trainingsplan

## Bedienung

- Lokal: Doppelklick auf `index.html` oder über VS Code öffnen
- Live: GitHub Pages (sobald aktiviert)
- Stand wird automatisch im Browser gespeichert (`localStorage`, Key `trainingsplan-v2`)
- Bei v1-Bestand: leerer Stand wird einmalig durch Seed-Daten ersetzt (Speicher-Key wurde bewusst auf v2 angehoben)

## Mögliche nächste Erweiterungen (offen)

- Detail-Seiten für Kraftpläne A/B/C und Paddel-Technik (aus der Quelldatei)
- Filtern nach Kategorie / Wochenansicht zusammengefasst
- Statistik pro Kategorie (Minuten / Woche)
- Drag & Drop zwischen Tagen
- Kalender-Export (iCal)
- Dark Mode
- Notizen / Reflektion pro Tag (z. B. „wie hat es sich angefühlt?")

