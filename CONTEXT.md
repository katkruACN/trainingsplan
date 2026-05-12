# Kontext: Persönliche Fitness-Plan App

## Ziel
Eine Applikation, mit der Katharina ihren persönlichen Fitness-Plan nachhalten und aktualisieren kann. Fokus: Übersichtlichkeit, schnelle tägliche Nutzung, Motivation.

## Getroffene Entscheidungen
- **Tech-Stack**: Statische Web-App (HTML / CSS / Vanilla JS) — läuft per Doppelklick auf `index.html` im Browser
- **Datenspeicherung**: JSON-Datei (Import / Export). Zusätzlich Auto-Save in `localStorage`, damit der Stand zwischen Sitzungen nicht verloren geht, ohne dass man jedes Mal exportieren muss
- **Startinhalt**: Leeres Template, 6 Wochen × 7 Tage
- **Design**: Minimalistisch & klar (viel Weißraum, farbige Kategorie-Labels als Akzent)
- **Sprache**: Deutsch
- **Trainingsphase**: 6 Wochen
- **Motivationsspruch**: rotiert zufällig (kein Spruch wiederholt sich direkt hintereinander); wechselt beim Laden und beim Abhaken einer Einheit

## Kernfeatures
1. **Wochenweise Struktur** — 6 Wochen, jeweils 7 Tage (Mo–So)
2. **Wochenziel** als editierbares Eingabefeld pro Woche
3. **Phasenname** im Header (klick zum Bearbeiten)
4. **Sportart-Kategorien** mit farblichen Labels:
   - Yoga / Mobility — Violett (#8b5cf6)
   - Rad / Cardio — Orange (#f97316)
   - Paddeln — Türkis (#14b8a6)
   - Kraft — Rot (#ef4444)
   - Schwimmen — Blau (#3b82f6)
   - Erholung — Grün (#22c55e)
5. **Checkbox** pro Einheit zum Abhaken; erledigte Einheiten werden grün hinterlegt und der Titel durchgestrichen
6. **Manuelles Editieren** über Dialog: Kategorie, Titel, Dauer (Minuten), Beschreibung; auch Löschen möglich
7. **Fortschrittsbalken** mit Phasen-Fortschritt (`X von Y Einheiten erledigt — Z %`)
8. **Motivierender Spruch** im Header (rotiert)
9. **Import / Export** als JSON-Datei für Backups und Geräte-Wechsel

## Datenmodell
```json
{
  "phaseName": "Meine Trainingsphase",
  "weeks": [
    {
      "goal": "Wochenziel",
      "days": [
        {
          "category": "yoga|rad|paddeln|kraft|schwimmen|erholung|null",
          "title": "",
          "description": "",
          "duration": 0,
          "completed": false
        }
      ]
    }
  ]
}
```

## Dateien
- [index.html](index.html) — Markup, Dialog für Bearbeiten
- [styles.css](styles.css) — Styling, Kategorie-Farben, Responsive Layout
- [app.js](app.js) — State, Rendering, Import/Export, LocalStorage

## Bedienung
- Doppelklick auf `index.html` (oder über VS Code öffnen → "Open with Live Server" / direkt im Browser)
- Stand wird automatisch im Browser gespeichert (`localStorage` Key: `trainingsplan-v1`)
- Über **Export** als `.json` herunterladen, über **Import** wiederherstellen / auf anderes Gerät bringen

## Mögliche nächste Erweiterungen (offen)
- Filtern nach Kategorie
- Statistik pro Kategorie (Minuten / Woche)
- Streak-Zähler (z. B. „5 Tage in Folge erledigt")
- Verknüpfung mit Kalender / iCal-Export
- Drag & Drop zwischen Tagen
- Mehrere Trainingsphasen verwalten / archivieren
- Optional: Dark Mode
