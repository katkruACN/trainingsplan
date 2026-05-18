# Kontext: Persönliche Fitness-Plan App

## Ziel

Eine Applikation, mit der Katharina ihren persönlichen Fitness-Plan nachhalten und aktualisieren kann. Aktueller Inhalt: **Malediven Surftrip · 20. Juni 2025** — ein 6-Wochen-Aufbauplan (15. Mai – 22. Juni 2025) mit Rücksicht auf eine Zahn-OP vom 7.7.

## Tech & Setup

- **Stack**: Statische Web-App (HTML / CSS / Vanilla JS) — läuft per Doppelklick auf `index.html` oder live auf GitHub Pages
- **Repo**: [https://github.com/katkruACN/trainingsplan](https://github.com/katkruACN/trainingsplan) (public)
- **Speicherung**: Auto-Save in `localStorage` (Key: `trainingsplan-v2`) + JSON Import/Export
- **Sprache**: Deutsch
- **Design**: Minimalistisch & klar

## Aktuelle Features

1. **6 Wochen** (Mo–So), je 7 Tage; Wochen-Tabs oben mit Done-Counter pro Woche
2. **Mehrere Einheiten pro Tag** (z. B. Rad + Mobility nachmittags)
3. **7 Kategorien** mit farblichen Labels:
  - Mobility — Teal (#14b8a6)
  - Yoga — Violett (#8b5cf6)
  - Rad / Cardio — Orange (#f97316)
  - Paddeln — Blau (#2563eb)
  - Kraft — Amber (#d97706)
  - HIIT — Rot (#ef4444)
  - Erholung — Grün (#22c55e)
4. **Wochenziel** ist fest gesetzt je nach Phase
5. **Phasenname** im Header der jeweiligen Woche, die mit Datum angezeigt wird
6. **Datum pro Tag** (z. B. „15. Mai", „20. Mai", „20. Juni 🏄")
7. **Bearbeiten-Dialog**: Kategorie, Dauer (Min), Tauschen der Einheiten nach Wochentagen
8. **Checkbox** pro Einheit; erledigte Einheiten grün hinterlegt, Titel durchgestrichen; ganzer Tag wird grün wenn alle Einheiten erledigt
9. **Fortschrittsbalken** über alle 6 Wochen (`X von Y Einheiten erledigt — Z %`)
10. **Motivierender Spruch** rotiert beim Abhaken & beim Laden (kein direkter Wiederholer)
11. **Import / Export** als JSON-Datei

## Inhaltliche Struktur (Seed Data)

Quelle: `~/Downloads/surf_trainingsplan_1.html` (übernommen, in 6-Wochen-Raster überführt).


| Woche | Zeitraum          | Schwerpunkt                                               |
| ----- | ----------------- | --------------------------------------------------------- |
| 1     | 12.–18. Mai       | Sanfter Wiedereinstieg nach OP — erste Klickie-Runde      |
| 2     | 19.–25. Mai       | Langsamer Einstieg in Trainingsplan                       |
| 3     | 26. Mai – 1. Juni | Grundlagen Training: Kraft starten & erste Paddel-Session |
| 4     | 2.–8. Juni        | Intensivieren Training: HIIT & Paddel-km steigern         |
| 5     | 9.–15. Juni       | Peak-Block Trainingsintensität                            |
| 6     | 16.–22. Juni      | Tapering & Abflug ✈️ Malediven 20. Juni                   |


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
- [app.js](app.js) — State, Seed-Daten, Rendering, Import/Export, LocalStorage

## Bedienung

- Lokal: Doppelklick auf `index.html` oder über VS Code öffnen
- Live: GitHub Pages (sobald aktiviert)
- Stand wird automatisch im Browser gespeichert (`localStorage`, Key `trainingsplan-v2`)
- Bei v1-Bestand: leerer Stand wird einmalig durch Seed-Daten ersetzt (Speicher-Key wurde bewusst auf v2 angehoben)

## Mögliche nächste Erweiterungen (offen)

- Detail-Seiten für Kraftpläne A/B/C und Paddel-Technik (aus der Quelldatei)
- Filtern nach Kategorie / Wochenansicht zusammengefasst
- Statistik pro Kategorie (Minuten / Woche)
- Streak-Zähler
- Drag & Drop zwischen Tagen
- Kalender-Export (iCal)
- Dark Mode
- Notizen / Reflektion pro Tag (z. B. „wie hat es sich angefühlt?")

