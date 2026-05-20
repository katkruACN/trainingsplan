const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const WEEKDAYS_FULL = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const WEEK_PHASE_NAMES = [
  'Slow Start',
  'Get ready',
  'Perform',
  'Accelerate',
  'Peak-Block',
  'Tapering'
];

const WEEK_START_DATES = [
  new Date(2026, 4, 11),
  new Date(2026, 4, 18),
  new Date(2026, 4, 25),
  new Date(2026, 5, 1),
  new Date(2026, 5, 8),
  new Date(2026, 5, 15)
];

const SUB_GOALS = [
  { title: 'Paddel Power', color: 'paddeln', categories: ['paddeln', 'schwimmen', 'rad', 'laufen', 'kraft-upper'] },
  { title: 'Surf Strength', color: 'kraft-lower', categories: ['hiit', 'kraft', 'kraft-lower', 'popup', 'surfen-eisbach', 'surfen-o2', 'surfen-jochen'] },
  { title: 'Stabilität & Beweglichkeit', color: 'mobility', categories: ['mobility', 'yoga', 'balance'] }
];

const GOAL_EXCLUDED_CATEGORIES = new Set(['erholung']);

const CATEGORIES = ['mobility', 'yoga', 'balance', 'rad', 'laufen', 'paddeln', 'schwimmen', 'kraft-upper', 'kraft-lower', 'hiit', 'popup', 'surfen-eisbach', 'surfen-o2', 'surfen-jochen', 'erholung'];
const CATEGORY_LABELS = {
  mobility: 'Mobility',
  yoga: 'Yoga',
  balance: 'Balance',
  rad: 'Cardio Radfahren',
  laufen: 'Cardio Laufen',
  paddeln: 'Paddeln',
  schwimmen: 'Schwimmen',
  kraft: 'Kraft',
  'kraft-upper': 'Kraft Upper',
  'kraft-lower': 'Kraft Lower',
  hiit: 'HIIT',
  popup: 'Pop-up Training',
  'surfen-eisbach': 'Surfen Eisbach',
  'surfen-o2': 'Surfen o2 Surftown',
  'surfen-jochen': 'Surfen Jochen Schweizer',
  erholung: 'Erholung'
};

const CATEGORY_DEFAULT_TITLES = {
  mobility: 'Mobilisation',
  yoga: 'Yoga-Session',
  balance: 'Balance-Training',
  rad: 'Radfahren Zone 2',
  laufen: 'Lauftraining',
  paddeln: 'Paddel-Session',
  schwimmen: 'Schwimmtraining',
  kraft: 'leichtes Krafttraining',
  'kraft-upper': 'Krafttraining Oberkörper',
  'kraft-lower': 'Krafttraining Beine',
  hiit: 'HIIT-Session',
  popup: 'Pop-up Training',
  'surfen-eisbach': 'Surfen am Eisbach',
  'surfen-o2': 'Surfen in o2 Surftown',
  'surfen-jochen': 'Surfen bei Jochen Schweizer',
  erholung: 'Aktive Erholung'
};

const CATEGORY_LOCATIONS = {
  mobility: { place: 'Zu Hause' },
  yoga: { place: 'Sanctuary Studio', note: 'buchen, 60 min Session' },
  balance: { place: 'Zu Hause' },
  rad: { place: 'Draussen' },
  laufen: { place: 'Draussen' },
  paddeln: { place: 'Feldmoching', note: 'Anfahrt 25 min' },
  schwimmen: { place: 'Nordbad', note: 'Anfahrt 10 min' },
  kraft: { place: "Leo's Fitness", note: 'Anfahrt 10 min' },
  'kraft-upper': { place: "Leo's Fitness", note: 'Anfahrt 10 min' },
  'kraft-lower': { place: "Leo's Fitness", note: 'Anfahrt 10 min' },
  hiit: { place: 'Limitlezz', note: 'buchen, 45 min Session' },
  popup: { place: 'Zu Hause' },
  'surfen-eisbach': { place: 'Eisbach' },
  'surfen-o2': { place: 'o2 Surftown', note: 'buchen' },
  'surfen-jochen': { place: 'Jochen Schweizer', note: 'donnerstags 20–21 h' }
};

const QUOTES = [
  'Jeder Schritt zählt.',
  'Disziplin schlägt Motivation.',
  'Heute besser als gestern.',
  'Konsistenz ist der Schlüssel.',
  'Kleine Schritte, große Wirkung.',
  'Atmen. Bewegen. Wachsen.',
  'Stärker als gestern.',
  'Pause ist Teil des Plans.',
  'Du baust gerade etwas Großes auf.',
  'Ein Tag, eine Einheit, ein Sieg.',
  'Dein Körper wird es dir danken.',
  'Bleib dran — Fortschritt ist Fortschritt.',
  'Stark werden — Tag für Tag.',
  'Du machst das großartig!',
  'Vertraue dem Prozess.',
  'Stark werden für die Welle.',
  'Jede Einheit bringt dich näher zum Take-off.',
  'Schulterstark, paddelstark, wellenstark.',
  'Pop-up startet im Trainingsraum.',
  'Auch eine lange Welle beginnt mit dem ersten Paddelschlag.',
  'Showing up ist die halbe Miete.'
];

const NUM_WEEKS = 6;
const STORAGE_KEY = 'trainingsplan-v2';

const WEEK_GOALS = [
  "Sanfter Wiedereinstieg nach OP — erste Rad-Runde",
  "Langsamer Einstieg in Trainingsplan",
  "Paddel-Distanz auf 3 km & erste Krafteinheiten",
  "4 km Paddeln am Stück & HIIT-Start",
  "5 km Paddeln ohne langen Stopp — Peak",
  "Tapering & Abflug ✈️ Malediven 20. Juni"
];

const WEEK_DATE_RANGES = [
  "11. – 17. Mai",
  "18. – 24. Mai",
  "25. – 31. Mai",
  "1. – 7. Juni",
  "8. – 14. Juni",
  "15. – 21. Juni"
];

function emptyUnit() {
  return { category: 'mobility', title: '', description: '', detail: [], duration: 0, completed: false };
}
function emptyDay() { return { date: '', units: [] }; }
function emptyWeek() { return { goal: '', days: Array.from({ length: 7 }, emptyDay) }; }

function seedState() {
  return {
  "schemaVersion": 4,
  "phaseName": "Malediven Surftrip · 20. Juni 2026",
  "weeks": [
    {
      "goal": "Sanfter Wiedereinstieg nach OP — erste Rad-Runde",
      "days": [
        { "date": "11. Mai", "units": [] },
        { "date": "12. Mai", "units": [] },
        { "date": "13. Mai", "units": [] },
        { "date": "14. Mai", "units": [] },
        {
          "date": "15. Mai",
          "units": [
            {
              "category": "mobility",
              "title": "Ganzkörper-Mobilisation",
              "description": "Sanft reaktivieren – kein Kardio, kein Schwitzen.",
              "detail": [
                "Katze-Kuh 10×",
                "Thorax-Rotation 10× je Seite",
                "Hip Circles 10× je Seite",
                "Schulter-Querstretch 30 sek/S",
                "Kind-Haltung 1 min"
              ],
              "duration": 20,
              "completed": false
            }
          ]
        },
        {
          "date": "16. Mai",
          "units": [
            {
              "category": "erholung",
              "title": "Aktive Erholung",
              "description": "Spazieren 20–30 min. Kein Sport.",
              "detail": [],
              "duration": 25,
              "completed": false
            }
          ]
        },
        {
          "date": "17. Mai",
          "units": [
            {
              "category": "rad",
              "title": "Radfahren – erste Einheit",
              "description": "Flache Strecke, Zone 1. Sicherer Umgang mit den Pedalen.",
              "detail": [
                "Vorher: 10× Einklicken stehend an Wand üben",
                "Nur bekannte flache Runde",
                "Bei jedem Stopp bewusst ausklicken",
                "Kein Hügel, keine Schnelligkeit"
              ],
              "duration": 20,
              "completed": false
            },
            {
              "category": "mobility",
              "title": "Nach dem Rad",
              "description": "Hüftbeuger & Schultern lösen.",
              "detail": [
                "Hip Flexor Stretch 45 sek/S",
                "Schulter-Querstretch",
                "Katze-Kuh 10×"
              ],
              "duration": 15,
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "goal": "Langsamer Einstieg in Trainingsplan",
      "days": [
        {
          "date": "18. Mai",
          "units": [
            {
              "category": "yoga",
              "title": "Sanctuary Studio buchen",
              "description": "Yin oder Hatha – kein Hot Yoga. Körper nach erster Rad-Runde erholen.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "19. Mai",
          "units": [
            {
              "category": "mobility",
              "title": "Mobilisation",
              "description": "Schulter & Brustwirbelsäule.",
              "detail": [
                "Thread the Needle 10× je Seite",
                "Doorway Chest Stretch 30 sek/S",
                "Schulterblatt-Mobilisation an Wand"
              ],
              "duration": 20,
              "completed": false
            }
          ]
        },
        {
          "date": "20. Mai",
          "units": [
            {
              "category": "yoga",
              "title": "Sanctuary buchen – Fäden gezogen",
              "description": "Sanfte Klasse, kein Vinyasa. Heute startet Phase 2.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "21. Mai",
          "units": [
            {
              "category": "erholung",
              "title": "Erholung",
              "description": "Spanisch + ruhiger Tag.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "22. Mai",
          "units": [
            {
              "category": "rad",
              "title": "Radfahren · Zone 1",
              "description": "Flache Strecke. Routine entwickeln.",
              "detail": [
                "Kein Hügel",
                "Tempo: locker, unterhalten möglich",
                "Bei jedem Stopp ausklicken"
              ],
              "duration": 20,
              "completed": false
            }
          ]
        },
        {
          "date": "23. Mai",
          "units": [
            {
              "category": "mobility",
              "title": "Schulter + Hüfte vorbereiten",
              "description": "Mobility für Paddeln.",
              "detail": [
                "Pigeon Pose 1 min/S",
                "World's Greatest Stretch 5×/S",
                "90/90 Hip Stretch",
                "Cobra-Stretch 5× halten 3 sek"
              ],
              "duration": 25,
              "completed": false
            }
          ]
        },
        {
          "date": "24. Mai",
          "units": [
            {
              "category": "rad",
              "title": "Radfahren",
              "description": "Leicht hügeliger Weg ok. Gefühl wird besser.",
              "detail": [
                "Zone 1–2",
                "Ausklick-Reflex testen: kurz bremsen & sofort ausklicken"
              ],
              "duration": 35,
              "completed": false
            },
            {
              "category": "mobility",
              "title": "Nach dem Rad",
              "description": "Hüftbeuger & Quad stretchen.",
              "detail": [
                "Hip Flexor Stretch 45 sek/S",
                "Quad Stretch stehend",
                "Pigeon Pose"
              ],
              "duration": 15,
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "goal": "Paddel-Distanz auf 3 km & erste Krafteinheiten",
      "days": [
        {
          "date": "25. Mai",
          "units": [
            {
              "category": "yoga",
              "title": "Sanctuary buchen",
              "description": "Langsamerer Kurs – Atmung und Regeneration.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "26. Mai",
          "units": [
            {
              "category": "kraft",
              "title": "Kraft A – Oberkörper/Core (leicht)",
              "description": "Erste Krafteinheit. Technik sauber, Gewicht moderat.",
              "detail": [
                "Lat Pulldown 3×10 (leicht)",
                "Seated Row 3×10",
                "Push-ups 3×8 langsam (3 sek runter)",
                "Face Pulls 3×12",
                "Dead Bug 2×8/S"
              ],
              "duration": 50,
              "completed": false
            }
          ]
        },
        {
          "date": "27. Mai",
          "units": [
            {
              "category": "rad",
              "title": "Radfahren · Zone 1–2",
              "description": "Längere Ausfahrt, sicherer im Sattel.",
              "detail": [
                "Trinkpause = Ausklick-Test",
                "Erste leichte Hügel ok wenn Reflex sitzt"
              ],
              "duration": 45,
              "completed": false
            }
          ]
        },
        {
          "date": "28. Mai",
          "units": [
            {
              "category": "erholung",
              "title": "Erholung",
              "description": "Spanisch – kurzer Tag.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "29. Mai",
          "units": [
            {
              "category": "paddeln",
              "title": "Erste Paddle-Session – 2 km",
              "description": "Erster Tag am See bei den Eltern!",
              "detail": [
                "Warm-up: Armkreisen + Cobra 5 min an Land",
                "Board-Position: Brust auf Mittelpunkt",
                "Entspanntes gleichmäßiges Tempo",
                "Pause wenn Schultern brennen",
                "Cool-down: Cobra + Schulter dehnen"
              ],
              "duration": 30,
              "completed": false
            }
          ]
        },
        {
          "date": "30. Mai",
          "units": [
            {
              "category": "mobility",
              "title": "Schulter-Fokus",
              "description": "Nach erster Paddle-Session regenerieren.",
              "detail": [
                "Schulter-Querstretch 45 sek/S",
                "Doorway Chest Stretch",
                "Thread the Needle (Thoraxrotation)"
              ],
              "duration": 25,
              "completed": false
            }
          ]
        },
        {
          "date": "31. Mai",
          "units": [
            {
              "category": "rad",
              "title": "Zone 2",
              "description": "Solide Zone-2-Ausfahrt.",
              "detail": [],
              "duration": 50,
              "completed": false
            },
            {
              "category": "kraft",
              "title": "Kraft A – Schulter & Core",
              "description": "Vollständige Einheit A.",
              "detail": [
                "Lat Pulldown 3×12",
                "Seated Row 3×12",
                "Push-ups 3×10 (3 sek runter)",
                "Face Pulls 3×15",
                "Pallof Press 3×10/S",
                "Dead Bug 3×10/S"
              ],
              "duration": 55,
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "goal": "4 km Paddeln am Stück & HIIT-Start",
      "days": [
        {
          "date": "1. Juni",
          "units": [
            {
              "category": "paddeln",
              "title": "Paddeln 3 km",
              "description": "Fokus: Rotation aus dem Rumpf, nicht nur Arme.",
              "detail": [
                "Warm-up 5 min an Land",
                "Catch-Phase: Arm weit vorne, hoher Ellenbogen",
                "Rotation aus Schulter & Rumpf",
                "2–3 kurze Pausen erlaubt"
              ],
              "duration": 40,
              "completed": false
            },
            {
              "category": "mobility",
              "title": "Nach Paddeln",
              "description": "Schultern & Brustwirbelsäule.",
              "detail": [],
              "duration": 20,
              "completed": false
            }
          ]
        },
        {
          "date": "2. Juni",
          "units": [
            {
              "category": "kraft",
              "title": "Kraft A – Push/Pull Oberkörper",
              "description": "Vollständige Einheit A.",
              "detail": [
                "Lat Pulldown 3×12",
                "Seated Cable Row 3×12",
                "KH Schulterpress 3×10",
                "Face Pulls 3×15",
                "Push-ups 3×12 (3 sek runter)",
                "Dead Bug 3×10/S"
              ],
              "duration": 55,
              "completed": false
            }
          ]
        },
        {
          "date": "3. Juni",
          "units": [
            {
              "category": "rad",
              "title": "Zone 2",
              "description": "Steady-State, keine Sprints. Kannst dich noch unterhalten.",
              "detail": [],
              "duration": 60,
              "completed": false
            }
          ]
        },
        {
          "date": "4. Juni",
          "units": [
            {
              "category": "yoga",
              "title": "Sanctuary buchen",
              "description": "Spanisch-Tag → kurze Einheit.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "5. Juni",
          "units": [
            {
              "category": "hiit",
              "title": "Limitlezz buchen",
              "description": "Erste HIIT-Session seit OP.",
              "detail": [
                "Trainer kurz über OP informieren",
                "Intensität moderat starten",
                "Kein Kopfunter bei Übungen"
              ],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "6. Juni",
          "units": [
            {
              "category": "erholung",
              "title": "Vollständige Erholung",
              "description": "Nach HIIT regenerieren.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "7. Juni",
          "units": [
            {
              "category": "paddeln",
              "title": "Paddeln 4 km",
              "description": "Großer Sonntag am See.",
              "detail": [
                "Technik-Fokus: sauberer Catch, Rumpfrotation",
                "Gleichmäßiges Tempo",
                "Danach Schulter dehnen"
              ],
              "duration": 50,
              "completed": false
            },
            {
              "category": "rad",
              "title": "Zone 2",
              "description": "Morgens paddeln, nachmittags Rad – oder mit 2h Pause.",
              "detail": [],
              "duration": 70,
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "goal": "5 km Paddeln ohne langen Stopp — Peak",
      "days": [
        {
          "date": "8. Juni",
          "units": [
            {
              "category": "yoga",
              "title": "Sanctuary buchen",
              "description": "Nach großem Sonntag sanft erholen.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "9. Juni",
          "units": [
            {
              "category": "kraft",
              "title": "Kraft B – Beine & Core Rotation",
              "description": "Surf-Stabilität aufbauen.",
              "detail": [
                "Bulgarian Split Squat 3×10/S (6–8 kg)",
                "Romanian Deadlift 3×10",
                "Pallof Press 3×12/S",
                "Kabelzug-Rotation 3×12/S",
                "Side Plank + Hip Dip 3×10/S",
                "Single Leg RDL 2×8/S"
              ],
              "duration": 55,
              "completed": false
            }
          ]
        },
        {
          "date": "10. Juni",
          "units": [
            {
              "category": "paddeln",
              "title": "Paddeln 5 km",
              "description": "Peak-Distanz! Langer Mittwoch am See.",
              "detail": [
                "Das ist das Hauptziel der ganzen Vorbereitung",
                "Technik-Check: Rotation aus Rumpf",
                "3–4 kurze Pausen erlaubt",
                "Schulter am nächsten Tag: müde aber kein Kater = Ziel erreicht ✓"
              ],
              "duration": 60,
              "completed": false
            }
          ]
        },
        {
          "date": "11. Juni",
          "units": [
            {
              "category": "mobility",
              "title": "Mobilisation",
              "description": "Spanisch → nur kurze Einheit.",
              "detail": [],
              "duration": 20,
              "completed": false
            }
          ]
        },
        {
          "date": "12. Juni",
          "units": [
            {
              "category": "hiit",
              "title": "Limitlezz buchen",
              "description": "Zweite HIIT-Session. Intensität kann höher als beim ersten Mal.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "13. Juni",
          "units": [
            {
              "category": "erholung",
              "title": "Erholung",
              "description": "Letzte richtige Ruheeinheit.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "14. Juni",
          "units": [
            {
              "category": "rad",
              "title": "Zone 2/3 Mix",
              "description": "Letzte große Radeinheit.",
              "detail": [
                "0–30 min: Zone 2",
                "30–50 min: 3–4 kurze Anstiege Zone 3",
                "50–80 min: zurück Zone 2"
              ],
              "duration": 80,
              "completed": false
            },
            {
              "category": "kraft",
              "title": "Kraft A – Oberkörper",
              "description": "Letzte vollständige Krafteinheit A.",
              "detail": [
                "Lat Pulldown 3×12",
                "Cable Row 3×12",
                "Push-ups 3×15 (3 sek runter)",
                "Face Pulls 3×15",
                "Side Plank 3×40 sek/S",
                "Kabelzug-Rotation 3×12/S"
              ],
              "duration": 55,
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "goal": "Tapering & Abflug ✈️ Malediven 20. Juni",
      "days": [
        {
          "date": "15. Juni",
          "units": [
            {
              "category": "paddeln",
              "title": "Letzte große Paddle-Session – 5–6 km",
              "description": "Das ist dein Peak. Alles zusammenbringen.",
              "detail": [
                "Technik-Checkliste vorher durchgehen",
                "Eigenes Tempo, kein Druck",
                "Danach: feiern! 🎉"
              ],
              "duration": 70,
              "completed": false
            }
          ]
        },
        {
          "date": "16. Juni",
          "units": [
            {
              "category": "kraft",
              "title": "Kraft C – Leicht & Erhalt",
              "description": "Tapering: 2 Sätze je Übung, Gewicht −20%.",
              "detail": [
                "Lat Pulldown 2×12 (leicht)",
                "Face Pulls 2×15",
                "Bulgarian Split Squat 2×8/S (Körpergewicht)",
                "Dead Bug 2×10/S",
                "Push-ups 2×10"
              ],
              "duration": 35,
              "completed": false
            },
            {
              "category": "mobility",
              "title": "Mobilisation",
              "description": "Hüfte, Schultern, Thorax öffnen.",
              "detail": [],
              "duration": 20,
              "completed": false
            }
          ]
        },
        {
          "date": "17. Juni",
          "units": [
            {
              "category": "rad",
              "title": "Lockere Radausfahrt · Zone 1",
              "description": "Beine drehen, nicht belasten. Kein Hügel.",
              "detail": [],
              "duration": 45,
              "completed": false
            },
            {
              "category": "kraft",
              "title": "Pop-up Training 2×10",
              "description": "Täglich bis zum Abflug: 10× explosiv auf dem Wohnzimmerboden.",
              "detail": [
                "Liegend, Hände neben Brust",
                "Explosiv hochdrücken, beide Beine gleichzeitig vorne",
                "Ziel: unter 1 Sekunde",
                "Stabiler Stand nach der Landung"
              ],
              "duration": 10,
              "completed": false
            }
          ]
        },
        {
          "date": "18. Juni",
          "units": [
            {
              "category": "yoga",
              "title": "Sanctuary buchen – Yin",
              "description": "Letzte Yoga-Einheit. Lange Haltungen, tief einatmen.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "19. Juni",
          "units": [
            {
              "category": "mobility",
              "title": "Packtag",
              "description": "Kurz mobilisieren, dann Koffer packen.",
              "detail": [
                "Schulter-Kreisen",
                "Pigeon Pose 1 min/S",
                "Cobra-Stretch 5×"
              ],
              "duration": 15,
              "completed": false
            },
            {
              "category": "kraft",
              "title": "Pop-up Training 2×10",
              "description": "Letzte Einheit vor dem Abflug. Explosiv & sauber.",
              "detail": [],
              "duration": 10,
              "completed": false
            },
            {
              "category": "erholung",
              "title": "Früh ins Bett",
              "description": "Morgen geht's los. 🌊",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "20. Juni 🏄",
          "units": [
            {
              "category": "erholung",
              "title": "✈️ Abflug Malediven",
              "description": "Du hast alles gegeben. Zeit die Wellen zu reiten!",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        },
        {
          "date": "21. Juni",
          "units": []
        }
      ]
    }
  ]
};
}

function normalizeUnit(u) {
  const cat = (u && CATEGORY_LABELS[u.category]) ? u.category : null;
  return {
    category: cat || 'mobility',
    title: (u && u.title) || '',
    description: (u && u.description) || '',
    detail: Array.isArray(u && u.detail) ? u.detail.filter(x => typeof x === 'string') : [],
    duration: Number(u && u.duration) || 0,
    completed: !!(u && u.completed)
  };
}

function migrate(data) {
  // Force reset of plan content when schema version is missing or outdated.
  // Profile data lives at top level of localStorage and is preserved separately.
  if (!data || !Array.isArray(data.weeks) || data.schemaVersion !== 4) {
    return seedState();
  }
  const out = { schemaVersion: 4, phaseName: data.phaseName || '', weeks: [] };
  for (let i = 0; i < NUM_WEEKS; i++) {
    const w = data.weeks[i] || emptyWeek();
    const week = { goal: w.goal || '', days: [] };
    for (let j = 0; j < 7; j++) {
      const d = (w.days && w.days[j]) || emptyDay();
      let units;
      if (Array.isArray(d.units)) {
        units = d.units.map(normalizeUnit);
      } else if (d.category) {
        units = [normalizeUnit(d)];
      } else {
        units = [];
      }
      week.days.push({ date: (d && d.date) || '', units });
    }
    out.weeks.push(week);
  }
  return out;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    return migrate(JSON.parse(raw));
  } catch {
    return seedState();
  }
}

function saveStateLocal() {
  let existing = {};
  try { existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch {}
  const merged = { ...existing, ...state };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

function saveState(planningChanges) {
  saveStateLocal();
  if (Array.isArray(planningChanges) && planningChanges.length) {
    fsRecordChanges(planningChanges).catch(err => console.warn('FS-Snapshot fehlgeschlagen:', err));
  }
}

// === File System Access API + Versioning (lädt base.json + Tages-Snapshots) ===
const FS_DB_NAME = 'pgd-versioning';
const FS_STORE = 'handles';
const FS_HANDLE_KEY = 'changes-dir';
let fsDirHandle = null;

function fsSupported() {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

function fsOpenDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(FS_DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(FS_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function fsLoadHandle() {
  try {
    const db = await fsOpenDB();
    return await new Promise(r => {
      const tx = db.transaction(FS_STORE, 'readonly');
      const req = tx.objectStore(FS_STORE).get(FS_HANDLE_KEY);
      req.onsuccess = () => r(req.result || null);
      req.onerror = () => r(null);
    });
  } catch { return null; }
}

async function fsStoreHandle(handle) {
  try {
    const db = await fsOpenDB();
    await new Promise(r => {
      const tx = db.transaction(FS_STORE, 'readwrite');
      tx.objectStore(FS_STORE).put(handle, FS_HANDLE_KEY);
      tx.oncomplete = () => r();
      tx.onerror = () => r();
    });
  } catch {}
}

async function fsHasPermission(handle, ask = false) {
  if (!handle) return false;
  const opts = { mode: 'readwrite' };
  if ((await handle.queryPermission(opts)) === 'granted') return true;
  if (ask && (await handle.requestPermission(opts)) === 'granted') return true;
  return false;
}

async function fsConnect() {
  if (!fsSupported()) {
    alert('Auto-Sync funktioniert nur in Chrome oder Edge. Bitte App in einem dieser Browser öffnen.');
    return;
  }
  try {
    fsDirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    await fsStoreHandle(fsDirHandle);
    fsUpdateStatus('Verbunden – lade Plan …');
    await fsBootstrap();
    fsUpdateStatus();
  } catch (err) {
    console.warn('Verzeichnis-Verbindung abgebrochen:', err);
  }
}

async function fsTryReconnect() {
  if (!fsSupported()) return false;
  const stored = await fsLoadHandle();
  if (!stored) return false;
  if (await fsHasPermission(stored, false)) {
    fsDirHandle = stored;
    return true;
  }
  return false;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function fsReadJSON(name) {
  const fh = await fsDirHandle.getFileHandle(name);
  const file = await fh.getFile();
  return JSON.parse(await file.text());
}

async function fsListChangeFiles() {
  const files = [];
  for await (const [name, entry] of fsDirHandle.entries()) {
    if (entry.kind !== 'file') continue;
    if (/^\d{4}-\d{2}-\d{2}\.json$/.test(name)) files.push({ name, entry });
  }
  files.sort((a, b) => a.name.localeCompare(b.name));
  return files;
}

async function fsLoadCurrentPlan() {
  if (!fsDirHandle) return null;
  let base;
  try { base = await fsReadJSON('base.json'); }
  catch (err) { console.warn('base.json nicht lesbar:', err); return null; }
  if (!base || !Array.isArray(base.weeks)) {
    console.warn('base.json hat keine weeks[]');
    return null;
  }
  const files = await fsListChangeFiles();
  const changeData = [];
  for (const f of files) {
    try {
      const file = await f.entry.getFile();
      changeData.push(JSON.parse(await file.text()));
    } catch (err) { console.warn(`Change-Datei ${f.name} fehlerhaft:`, err); }
  }
  return applyChangesToBase(base, changeData);
}

function parseUnitId(id) {
  const m = String(id || '').match(/^w(\d+)-d(\d+)-u(\d+)$/);
  return m ? { weekIdx: +m[1], dayIdx: +m[2], unitIdx: +m[3] } : null;
}

function applyChangesToBase(base, changeFiles) {
  const out = JSON.parse(JSON.stringify(base));
  const sorted = [...changeFiles].sort((a, b) =>
    (a?.meta?.version || '').localeCompare(b?.meta?.version || ''));
  for (const file of sorted) {
    if (!Array.isArray(file.changes)) continue;
    for (const ch of file.changes) {
      const p = parseUnitId(ch.unitId);
      if (!p) continue;
      const { weekIdx, dayIdx, unitIdx } = p;
      const day = out.weeks?.[weekIdx]?.days?.[dayIdx];
      if (!day) continue;
      if (ch.field === 'removed') {
        if (day.units[unitIdx]) day.units.splice(unitIdx, 1);
        continue;
      }
      if (ch.field === 'added' && ch.to) {
        day.units.splice(Math.min(unitIdx, day.units.length), 0, ch.to);
        continue;
      }
      const unit = day.units[unitIdx];
      if (!unit) continue;
      if (ch.field === 'category') unit.category = ch.to;
      else if (ch.field === 'title') unit.title = ch.to;
      else if (ch.field === 'duration') unit.duration = ch.to;
      else if (ch.field === 'detail') unit.detail = ch.to;
      else if (ch.field === 'dayIdx') {
        const target = out.weeks[weekIdx]?.days?.[ch.to];
        if (target) {
          const [moved] = day.units.splice(unitIdx, 1);
          target.units.push(moved);
        }
      }
    }
  }
  return out;
}

function mergeCompleted(target, source) {
  if (!source || !Array.isArray(source.weeks)) return;
  // Map alle "completed:true" Units aus source via unitId-Match auf target
  const completedIds = new Set();
  source.weeks.forEach(w => (w.days || []).forEach(d => (d.units || []).forEach(u => {
    if (u.completed && u.unitId) completedIds.add(u.unitId);
  })));
  if (!completedIds.size) return;
  target.weeks.forEach(w => (w.days || []).forEach(d => (d.units || []).forEach(u => {
    if (u.unitId && completedIds.has(u.unitId)) u.completed = true;
  })));
}

function diffPlans(expected, actual) {
  const changes = [];
  if (!expected?.weeks || !actual?.weeks) return changes;
  const numWeeks = Math.min(expected.weeks.length, actual.weeks.length);
  for (let w = 0; w < numWeeks; w++) {
    const eDays = expected.weeks[w]?.days || [];
    const aDays = actual.weeks[w]?.days || [];
    for (let d = 0; d < 7; d++) {
      const eUnits = eDays[d]?.units || [];
      const aUnits = aDays[d]?.units || [];
      const max = Math.max(eUnits.length, aUnits.length);
      for (let u = 0; u < max; u++) {
        const eU = eUnits[u];
        const aU = aUnits[u];
        const unitId = (eU?.unitId) || (aU?.unitId) || `w${w}-d${d}-u${u}`;
        if (eU && !aU) {
          changes.push({ unitId, field: 'removed', from: eU, to: null, reason: 'manual-edit-detected' });
          continue;
        }
        if (!eU && aU) {
          changes.push({ unitId, field: 'added', from: null, to: aU, reason: 'manual-edit-detected' });
          continue;
        }
        if (!eU || !aU) continue;
        if (eU.category !== aU.category) changes.push({ unitId, field: 'category', from: eU.category, to: aU.category, reason: 'manual-edit-detected' });
        if ((eU.title || '') !== (aU.title || '')) changes.push({ unitId, field: 'title', from: eU.title, to: aU.title, reason: 'manual-edit-detected' });
        if ((Number(eU.duration) || 0) !== (Number(aU.duration) || 0)) changes.push({ unitId, field: 'duration', from: eU.duration, to: aU.duration, reason: 'manual-edit-detected' });
        if (JSON.stringify(eU.detail || []) !== JSON.stringify(aU.detail || [])) changes.push({ unitId, field: 'detail', from: eU.detail, to: aU.detail, reason: 'manual-edit-detected' });
      }
    }
  }
  return changes;
}

async function fsBootstrap() {
  if (!fsDirHandle) return false;
  let base;
  try { base = await fsReadJSON('base.json'); }
  catch (err) { console.warn('base.json nicht lesbar:', err); return false; }
  if (!base || !Array.isArray(base.weeks)) return false;

  const files = await fsListChangeFiles();
  const today = todayKey();
  const pastSnapshots = [];
  let todaySnapshot = null;
  for (const f of files) {
    try {
      const file = await f.entry.getFile();
      const data = JSON.parse(await file.text());
      if (f.name === `${today}.json`) todaySnapshot = data;
      else pastSnapshots.push(data);
    } catch (err) { console.warn(`Change-Datei ${f.name} fehlerhaft:`, err); }
  }

  // Plan-Stand laut Dateien VOR heutigen Änderungen
  const beforeToday = applyChangesToBase(base, pastSnapshots);

  // localStorage hat möglicherweise ungespeicherte UI-Edits → diffen
  const todayChangesFromState = diffPlans(beforeToday, state);

  // Mit existierenden heute's Changes mergen (Doppelte vermeiden)
  const existingChanges = todaySnapshot?.changes || [];
  const isAlreadyRecorded = (c) => existingChanges.some(x =>
    x.unitId === c.unitId && x.field === c.field && JSON.stringify(x.to) === JSON.stringify(c.to)
  );
  const newToRecord = todayChangesFromState.filter(c => !isAlreadyRecorded(c));

  if (newToRecord.length) {
    console.info(`${newToRecord.length} ungespeicherte UI-Änderung(en) erkannt → in heute's Snapshot speichern`);
    await fsRecordChanges(newToRecord);
    // localStorage-Stand IST die Wahrheit, state bleibt wie er ist
    saveStateLocal();
    currentWeek = getCurrentWeekIdx();
    render();
    fsUpdateStatus(`${newToRecord.length} Änderung(en) als ${today}.json gespeichert`);
    return true;
  }

  // Keine ungespeicherten Änderungen → lade aktuellen Stand aus Dateien
  const allSnapshots = todaySnapshot ? [...pastSnapshots, todaySnapshot] : pastSnapshots;
  const current = applyChangesToBase(base, allSnapshots);
  const planState = {
    schemaVersion: base?.meta?.schemaVersion || 4,
    phaseName: base?.meta?.phaseName || 'Malediven Surftrip · 20. Juni 2026',
    weeks: current.weeks
  };
  mergeCompleted(planState, state);
  state = planState;
  saveStateLocal();
  currentWeek = getCurrentWeekIdx();
  render();
  return true;
}

function emptyTodaySnapshot() {
  const today = todayKey();
  return {
    meta: {
      version: today,
      versionNumber: 1,
      createdAt: today,
      basedOn: 'base',
      changedBy: 'Katharina',
      trigger: 'user-edit',
      summary: ''
    },
    changes: [],
    delta: {
      categoryShifts: {},
      durationDeltaMin: 0,
      unitsAdded: 0,
      unitsRemoved: 0
    },
    goalImpact: null
  };
}

async function fsRecordChanges(newChanges) {
  if (!fsDirHandle || !await fsHasPermission(fsDirHandle, false)) return false;
  const today = todayKey();
  const name = `${today}.json`;
  let snap = null;
  try { snap = await fsReadJSON(name); } catch {}
  if (!snap || !snap.meta || !Array.isArray(snap.changes)) snap = emptyTodaySnapshot();
  const startIdx = snap.changes.length;
  newChanges.forEach((ch, i) => {
    snap.changes.push({ id: `c${startIdx + i + 1}`, ...ch });
  });
  snap.meta.updatedAt = new Date().toISOString();
  // Delta aktualisieren (einfach: Anzahl added/removed zählen + Dauer-Diff)
  const d = snap.delta || (snap.delta = { categoryShifts: {}, durationDeltaMin: 0, unitsAdded: 0, unitsRemoved: 0 });
  d.unitsAdded = snap.changes.filter(c => c.field === 'added').length;
  d.unitsRemoved = snap.changes.filter(c => c.field === 'removed').length;
  d.durationDeltaMin = snap.changes
    .filter(c => c.field === 'duration')
    .reduce((sum, c) => sum + ((Number(c.to) || 0) - (Number(c.from) || 0)), 0);
  try {
    const fh = await fsDirHandle.getFileHandle(name, { create: true });
    const writable = await fh.createWritable();
    await writable.write(JSON.stringify(snap, null, 2));
    await writable.close();
    fsUpdateStatus(`Gespeichert: ${name}`);
    return true;
  } catch (err) {
    console.warn('Snapshot schreiben fehlgeschlagen:', err);
    return false;
  }
}

function fsUpdateStatus(message) {
  const el = document.getElementById('fs-status');
  if (!el) return;
  if (!fsSupported()) {
    el.textContent = 'Auto-Sync nicht verfügbar (nur Chrome/Edge)';
    el.className = 'fs-status warn';
    return;
  }
  if (!fsDirHandle) {
    el.textContent = 'Verzeichnis nicht verbunden – Plan kommt aus localStorage';
    el.className = 'fs-status off';
    return;
  }
  el.textContent = message || `Auto-Sync aktiv: ${fsDirHandle.name}`;
  el.className = 'fs-status on';
}

function getCurrentWeekIdx() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < NUM_WEEKS; i++) {
    const weekEnd = new Date(WEEK_START_DATES[i]);
    weekEnd.setDate(weekEnd.getDate() + 6);
    if (today < weekEnd) return i;
  }
  return NUM_WEEKS - 1;
}

let state = loadState();
let currentWeek = getCurrentWeekIdx();
let editing = null;
let lastTripPct = null;
let currentQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

function rotateQuote() {
  if (QUOTES.length <= 1) return;
  let next = currentQuote;
  while (next === currentQuote) {
    next = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }
  currentQuote = next;
}

function totalPlanned() {
  return state.weeks.reduce((n, w) => n + w.days.reduce((m, d) => m + d.units.length, 0), 0);
}
function totalCompleted() {
  return state.weeks.reduce((n, w) => n + w.days.reduce((m, d) => m + d.units.filter(u => u.completed).length, 0), 0);
}
function weekPlanned(idx) {
  return state.weeks[idx].days.reduce((n, d) => n + d.units.length, 0);
}
function weekCompleted(idx) {
  return state.weeks[idx].days.reduce((n, d) => n + d.units.filter(u => u.completed).length, 0);
}
function categoryStats(cats) {
  const set = Array.isArray(cats) ? new Set(cats) : new Set([cats]);
  let planned = 0, done = 0;
  state.weeks.forEach(w => w.days.forEach(d => d.units.forEach(u => {
    if (set.has(u.category)) { planned++; if (u.completed) done++; }
  })));
  return { planned, done, pct: planned ? Math.round((done / planned) * 100) : 0 };
}

function validateUnitCategories() {
  const goalCategories = new Set(SUB_GOALS.flatMap(g => g.categories));
  const unknown = [];
  const untracked = [];
  state.weeks.forEach((w, wi) => w.days.forEach((d, di) => d.units.forEach((u, ui) => {
    const loc = `W${wi + 1} D${di + 1} U${ui + 1} (${d.date || ''}) "${u.title || ''}" [${u.category}]`;
    if (!CATEGORIES.includes(u.category)) {
      unknown.push(loc);
    } else if (!goalCategories.has(u.category) && !GOAL_EXCLUDED_CATEGORIES.has(u.category)) {
      untracked.push(loc);
    }
  })));
  if (unknown.length) console.warn('[Fitnessplan] Unbekannte Kategorien:', unknown);
  if (untracked.length) console.warn('[Fitnessplan] Einheiten ohne Trip-Ready-Zuordnung:', untracked);
}

function render() {
  validateUnitCategories();
  const calendarWeek = getCurrentWeekIdx();
  const tabs = document.getElementById('week-tabs');
  tabs.innerHTML = '';
  for (let i = 0; i < NUM_WEEKS; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    let cls = 'week-tab';
    if (i === currentWeek) cls += ' active';
    if (i < calendarWeek) {
      const wPlan = weekPlanned(i);
      const wDone = weekCompleted(i);
      const allDone = wPlan > 0 && wDone === wPlan;
      cls += allDone ? ' past completed' : ' past incomplete';
    }
    btn.className = cls;

    const numDiv = document.createElement('div');
    numDiv.className = 'week-num' + (i === calendarWeek ? ' current' : '');
    numDiv.textContent = (i === calendarWeek ? '🚀 ' : '') + `Woche ${i + 1}`;
    btn.appendChild(numDiv);

    const datesDiv = document.createElement('div');
    datesDiv.className = 'week-dates';
    datesDiv.textContent = WEEK_DATE_RANGES[i] || '';
    btn.appendChild(datesDiv);

    const phaseDiv = document.createElement('div');
    phaseDiv.className = 'week-phase';
    phaseDiv.textContent = WEEK_PHASE_NAMES[i] || '';
    btn.appendChild(phaseDiv);

    btn.addEventListener('click', () => { currentWeek = i; render(); });
    tabs.appendChild(btn);
  }

  document.getElementById('week-eyebrow').textContent = `Woche ${currentWeek + 1}`;
  document.getElementById('week-goal').textContent = WEEK_GOALS[currentWeek] || '';

  const wp = document.getElementById('week-progress');
  const wDone = weekCompleted(currentWeek);
  const wPlan = weekPlanned(currentWeek);
  wp.textContent = wPlan ? `${wDone} / ${wPlan} Einheiten erledigt` : 'Noch keine Einheiten geplant';

  const list = document.getElementById('days-list');
  list.innerHTML = '';
  state.weeks[currentWeek].days.forEach((day, idx) => list.appendChild(renderDay(day, idx)));

  const subStats = SUB_GOALS.map(g => categoryStats(g.categories));
  const tracked = subStats.filter(s => s.planned > 0);
  const tripPct = tracked.length
    ? Math.round(tracked.reduce((sum, s) => sum + s.pct, 0) / tracked.length)
    : 0;
  document.getElementById('progress-fill').style.width = tripPct + '%';
  if (lastTripPct !== null && tripPct !== lastTripPct) rotateQuote();
  lastTripPct = tripPct;
  document.getElementById('progress-label').textContent = tracked.length
    ? `🔥 ${tripPct} % Trip-Ready — ${currentQuote}`
    : 'Noch keine Einheiten geplant';

  renderSubGoals();
}

function renderSubGoals() {
  const container = document.getElementById('sub-goals');
  if (!container) return;
  container.innerHTML = '';
  SUB_GOALS.forEach(g => {
    const stats = categoryStats(g.categories);
    const sub = document.createElement('div');
    sub.className = 'sub-goal';

    const title = document.createElement('div');
    title.className = 'sub-goal-title';
    title.textContent = `${g.title} ${stats.pct} %`;
    sub.appendChild(title);

    const bar = document.createElement('div');
    bar.className = 'progress-bar progress-bar-sm';
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = stats.pct + '%';
    fill.style.background = `var(--cat-${g.color})`;
    bar.appendChild(fill);
    sub.appendChild(bar);

    const label = document.createElement('div');
    label.className = 'sub-goal-label';
    label.textContent = `${stats.done} / ${stats.planned} Sessions`;
    sub.appendChild(label);

    container.appendChild(sub);
  });
}

function renderDay(day, dayIdx) {
  const card = document.createElement('div');
  const allDone = day.units.length > 0 && day.units.every(u => u.completed);
  card.className = 'day-card' + (allDone ? ' completed' : '');

  const dateHeader = document.createElement('div');
  dateHeader.className = 'day-date-header';

  const dateLeft = document.createElement('div');
  dateLeft.className = 'day-date-left';

  const expandBtn = document.createElement('button');
  expandBtn.type = 'button';
  expandBtn.className = 'expand-icon';
  expandBtn.textContent = '▶';
  expandBtn.setAttribute('aria-label', 'Details ein-/ausklappen');
  dateLeft.appendChild(expandBtn);

  const dayTitle = document.createElement('div');
  dayTitle.className = 'day-title';
  dayTitle.textContent = day.date ? `${WEEKDAYS_FULL[dayIdx]} ${day.date}` : WEEKDAYS_FULL[dayIdx];
  dateLeft.appendChild(dayTitle);
  dateHeader.appendChild(dateLeft);

  if (day.units.length > 0) {
    dateHeader.style.cursor = 'pointer';
    dateHeader.addEventListener('click', () => card.classList.toggle('open'));
  }
  card.appendChild(dateHeader);

  const split = document.createElement('div');
  split.className = 'day-split';

  const left = document.createElement('div');
  left.className = 'day-left full';

  if (day.units.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'day-empty';
    empty.textContent = 'Frei';
    left.appendChild(empty);
  } else {
    day.units.forEach((unit, uIdx) => {
      const item = document.createElement('div');
      item.className = 'workout-item';
      item.appendChild(renderWorkoutRow(unit, dayIdx, uIdx));
      if (unit.detail && unit.detail.length) {
        const details = document.createElement('ul');
        details.className = 'workout-details';
        unit.detail.forEach(d => {
          const li = document.createElement('li');
          li.textContent = d;
          details.appendChild(li);
        });
        item.appendChild(details);
      }
      left.appendChild(item);
    });
  }
  split.appendChild(left);
  card.appendChild(split);

  return card;
}

function renderWorkoutRow(unit, dayIdx, uIdx) {
  const row = document.createElement('div');
  row.className = 'workout-row';

  const check = document.createElement('button');
  check.type = 'button';
  check.className = 'day-check' + (unit.completed ? ' checked' : '');
  if (unit.completed) check.textContent = '✓';
  check.setAttribute('aria-label', unit.completed ? 'Als unerledigt markieren' : 'Als erledigt markieren');
  check.addEventListener('click', (e) => {
    e.stopPropagation();
    unit.completed = !unit.completed;
    // completed ist Progress, kein Plan-Delta → nur localStorage
    saveStateLocal();
    render();
  });
  row.appendChild(check);

  const badge = document.createElement('span');
  badge.className = 'category-badge ' + unit.category;
  badge.textContent = CATEGORY_LABELS[unit.category] || unit.category;
  row.appendChild(badge);

  const dur = document.createElement('span');
  dur.className = 'workout-duration';
  dur.textContent = unit.duration ? `${unit.duration} Min.` : '';
  row.appendChild(dur);

  const title = document.createElement('span');
  title.className = 'workout-title';
  title.textContent = unit.title || '(ohne Titel)';
  row.appendChild(title);

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'edit-icon';
  editBtn.setAttribute('aria-label', 'Einheit bearbeiten');
  editBtn.title = 'Bearbeiten';
  editBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openEdit(currentWeek, dayIdx, uIdx);
  });
  row.appendChild(editBtn);

  return row;
}


function openEdit(weekIdx, dayIdx, unitIdx) {
  editing = { weekIdx, dayIdx, unitIdx };
  const day = state.weeks[weekIdx].days[dayIdx];
  const unit = day.units[unitIdx];
  const form = /** @type {any} */ (document.getElementById('edit-form'));
  form.weekday.value = String(dayIdx);
  form.category.value = unit.category || 'mobility';
  form.title.value = unit.title || '';
  form.duration.value = unit.duration || '';
  document.getElementById('edit-title').textContent = 'Einheit bearbeiten';
  document.getElementById('edit-unit-title').textContent = unit.title || '';
  /** @type {HTMLDialogElement} */ (document.getElementById('edit-dialog')).showModal();
  setTimeout(() => form.category.focus(), 0);
}

function setupDialog() {
  const dialog = /** @type {HTMLDialogElement} */ (document.getElementById('edit-dialog'));
  const form = /** @type {any} */ (document.getElementById('edit-form'));

  form.category.addEventListener('change', () => {
    const cat = form.category.value;
    form.title.value = CATEGORY_DEFAULT_TITLES[cat] || CATEGORY_LABELS[cat] || '';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!editing) return;
    const { weekIdx, dayIdx, unitIdx } = editing;
    const day = state.weeks[weekIdx].days[dayIdx];
    const unit = day.units[unitIdx];
    const newDayIdx = parseInt(form.weekday.value, 10);

    // Alte Werte einfangen für Change-Log
    const oldCategory = unit.category;
    const oldTitle = unit.title;
    const oldDuration = unit.duration;
    const unitId = unit.unitId || `w${weekIdx}-d${dayIdx}-u${unitIdx}`;

    const newCategory = form.category.value || 'mobility';
    const newTitle = form.title.value.trim() || CATEGORY_DEFAULT_TITLES[newCategory] || '';
    const newDuration = Number(form.duration.value) || 0;

    const changes = [];
    if (oldCategory !== newCategory) changes.push({ unitId, field: 'category', from: oldCategory, to: newCategory, reason: 'user-edit' });
    if (oldTitle !== newTitle) changes.push({ unitId, field: 'title', from: oldTitle, to: newTitle, reason: 'user-edit' });
    if (oldDuration !== newDuration) changes.push({ unitId, field: 'duration', from: oldDuration, to: newDuration, reason: 'user-edit' });
    if (Number.isInteger(newDayIdx) && newDayIdx !== dayIdx) changes.push({ unitId, field: 'dayIdx', from: dayIdx, to: newDayIdx, reason: 'user-edit' });

    unit.category = newCategory;
    unit.title = newTitle;
    unit.duration = newDuration;

    if (Number.isInteger(newDayIdx) && newDayIdx !== dayIdx) {
      day.units.splice(unitIdx, 1);
      state.weeks[weekIdx].days[newDayIdx].units.push(unit);
    }

    saveState(changes);
    dialog.close();
    render();
  });
  document.getElementById('cancel-btn').addEventListener('click', () => dialog.close());

  document.getElementById('delete-btn').addEventListener('click', () => {
    if (!editing) return;
    if (!confirm('Diese Einheit wirklich löschen?')) return;
    const { weekIdx, dayIdx, unitIdx } = editing;
    const unit = state.weeks[weekIdx].days[dayIdx].units[unitIdx];
    const unitId = unit.unitId || `w${weekIdx}-d${dayIdx}-u${unitIdx}`;
    state.weeks[weekIdx].days[dayIdx].units.splice(unitIdx, 1);
    saveState([{ unitId, field: 'removed', from: unit, to: null, reason: 'user-delete' }]);
    dialog.close();
    render();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  setupDialog();
  render();
  const connectBtn = document.getElementById('fs-connect-btn');
  if (connectBtn) connectBtn.addEventListener('click', fsConnect);
  fsUpdateStatus();
  // Lautlos versuchen, das verbundene Verzeichnis wiederherzustellen + Plan neu laden
  if (await fsTryReconnect()) {
    await fsBootstrap();
    fsUpdateStatus();
  }
});
