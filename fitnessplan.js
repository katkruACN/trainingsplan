const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const WEEKDAYS_FULL = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const WEEK_PHASE_NAMES = [
  '1 Slow Start',
  '2 Get ready',
  '3 Perform',
  '4 Accelerate',
  '5 Peak-Block',
  '6 Tapering'
];

const CATEGORIES = ['mobility', 'yoga', 'rad', 'paddeln', 'kraft', 'hiit', 'erholung'];
const CATEGORY_LABELS = {
  mobility: 'Mobility',
  yoga: 'Yoga',
  rad: 'Rad / Cardio',
  paddeln: 'Paddeln',
  kraft: 'Kraft',
  hiit: 'HIIT',
  surfing: 'Surfing',
  erholung: 'Erholung'
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
  "Sanfter Einstieg nach OP — Mobility & erste Klickie-Runde",
  "Klickies einfahren & Fäden ziehen ⭐ — Zone 1",
  "Paddel-Distanz auf 3 km & erste Krafteinheiten",
  "4 km Paddeln am Stück & HIIT-Start",
  "5 km Paddeln ohne langen Stopp — Peak",
  "Tapering & Abflug ✈️ Malediven 20. Juni"
];

const WEEK_DATE_RANGES = [
  "12. – 18. Mai",
  "19. – 25. Mai",
  "26. Mai – 1. Juni",
  "2. – 8. Juni",
  "9. – 15. Juni",
  "16. – 22. Juni"
];

function emptyUnit() {
  return { category: 'mobility', title: '', description: '', detail: [], duration: 0, completed: false };
}
function emptyDay() { return { date: '', units: [] }; }
function emptyWeek() { return { goal: '', days: Array.from({ length: 7 }, emptyDay) }; }

function seedState() {
  return {
  "schemaVersion": 3,
  "phaseName": "Malediven Surftrip · 20. Juni 2026",
  "weeks": [
    {
      "goal": "Sanfter Einstieg nach OP — Mobility & erste Klickie-Runde",
      "days": [
        {
          "date": "12. Mai",
          "units": []
        },
        {
          "date": "13. Mai",
          "units": []
        },
        {
          "date": "14. Mai",
          "units": []
        },
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
              "title": "Klickies – erste Einheit",
              "description": "Flache Strecke, Zone 1. Fokus: sicheres Ein- und Ausklicken.",
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
        },
        {
          "date": "18. Mai",
          "units": [
            {
              "category": "yoga",
              "title": "Sanctuary Studio buchen",
              "description": "Yin oder Hatha – kein Hot Yoga. Körper nach erster Klicki-Runde erholen.",
              "detail": [],
              "duration": 0,
              "completed": false
            }
          ]
        }
      ]
    },
    {
      "goal": "Klickies einfahren & Fäden ziehen ⭐ — Zone 1",
      "days": [
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
              "title": "Klickies · Zone 1",
              "description": "Flache Strecke. Klick-Reflex entwickeln.",
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
              "title": "Klickies",
              "description": "Leicht hügeliger Weg ok. Klick-Gefühl wird besser.",
              "detail": [
                "Zone 1–2",
                "Ausklick-Reflex testen: kurz bremsen & sofort ausklicken"
              ],
              "duration": 35,
              "completed": false
            },
            {
              "category": "mobility",
              "title": "Nach Klickies",
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
        },
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
        }
      ]
    },
    {
      "goal": "Paddel-Distanz auf 3 km & erste Krafteinheiten",
      "days": [
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
              "title": "Klickies · Zone 1–2",
              "description": "Längere Ausfahrt. Klickies werden sicherer.",
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
              "description": "Klickies sitzen jetzt sicherer.",
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
        },
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
        }
      ]
    },
    {
      "goal": "4 km Paddeln am Stück & HIIT-Start",
      "days": [
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
              "description": "Großer Samstag am See.",
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
        },
        {
          "date": "8. Juni",
          "units": [
            {
              "category": "yoga",
              "title": "Sanctuary buchen",
              "description": "Nach großem Samstag sanft erholen.",
              "detail": [],
              "duration": 0,
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
              "description": "Peak-Distanz! Langer Dienstag am See.",
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
        },
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
        }
      ]
    },
    {
      "goal": "Tapering & Abflug ✈️ Malediven 20. Juni",
      "days": [
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
        },
        {
          "date": "22. Juni",
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
  if (!data || !Array.isArray(data.weeks) || data.schemaVersion !== 3) {
    return seedState();
  }
  const out = { schemaVersion: 3, phaseName: data.phaseName || '', weeks: [] };
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

function saveState() {
  let existing = {};
  try { existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch {}
  const merged = { ...existing, ...state };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

let state = loadState();
let currentWeek = 0;
let editing = null;
let lastQuoteIdx = -1;

function pickQuote() {
  if (QUOTES.length <= 1) return QUOTES[0];
  let i;
  do { i = Math.floor(Math.random() * QUOTES.length); } while (i === lastQuoteIdx);
  lastQuoteIdx = i;
  return QUOTES[i];
}
function rotateQuote() {
  document.getElementById('quote').textContent = `„${pickQuote()}"`;
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

function render() {
  const tabs = document.getElementById('week-tabs');
  tabs.innerHTML = '';
  for (let i = 0; i < NUM_WEEKS; i++) {
    const btn = document.createElement('button');
    btn.className = 'week-tab' + (i === currentWeek ? ' active' : '');
    const phase = WEEK_PHASE_NAMES[i] || `Woche ${i + 1}`;
    const dates = WEEK_DATE_RANGES[i] || '';
    const phaseSpan = document.createElement('span');
    phaseSpan.className = 'tab-phase';
    phaseSpan.textContent = phase;
    const datesSpan = document.createElement('span');
    datesSpan.className = 'tab-dates';
    datesSpan.textContent = dates;
    btn.appendChild(phaseSpan);
    btn.appendChild(datesSpan);
    btn.addEventListener('click', () => { currentWeek = i; render(); });
    tabs.appendChild(btn);
  }

  document.getElementById('week-goal').textContent = WEEK_GOALS[currentWeek] || '';

  const wp = document.getElementById('week-progress');
  const wDone = weekCompleted(currentWeek);
  const wPlan = weekPlanned(currentWeek);
  wp.textContent = wPlan ? `${wDone} / ${wPlan} Einheiten erledigt` : 'Noch keine Einheiten geplant';

  const list = document.getElementById('days-list');
  list.innerHTML = '';
  state.weeks[currentWeek].days.forEach((day, idx) => list.appendChild(renderDay(day, idx)));

  const totalPlan = totalPlanned();
  const totalDone = totalCompleted();
  const pct = totalPlan ? Math.round((totalDone / totalPlan) * 100) : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent = totalPlan
    ? `${totalDone} von ${totalPlan} Einheiten erledigt (${pct} %)`
    : 'Noch keine Einheiten geplant';
}

function renderDay(day, idx) {
  const card = document.createElement('div');
  const allDone = day.units.length > 0 && day.units.every(u => u.completed);
  card.className = 'day-card' + (allDone ? ' completed' : '');
  if (day.units.length > 0) card.classList.add('expandable');

  const header = document.createElement('div');
  header.className = 'day-header';

  const check = document.createElement('button');
  check.type = 'button';
  check.className = 'day-check' + (allDone ? ' checked' : '');
  check.setAttribute('aria-label', allDone ? 'Tag als unerledigt markieren' : 'Tag als erledigt markieren');
  if (day.units.length === 0) check.disabled = true;
  check.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!day.units.length) return;
    const newDone = !allDone;
    day.units.forEach(u => { u.completed = newDone; });
    saveState();
    if (newDone) rotateQuote();
    render();
  });
  header.appendChild(check);

  const info = document.createElement('div');
  info.className = 'day-info';

  const dateRow = document.createElement('div');
  dateRow.className = 'day-date-row';
  dateRow.textContent = day.date ? `${WEEKDAYS_FULL[idx]} · ${day.date}` : WEEKDAYS_FULL[idx];
  info.appendChild(dateRow);

  if (!day.units.length) {
    const empty = document.createElement('div');
    empty.className = 'day-empty-inline';
    empty.textContent = 'Frei';
    info.appendChild(empty);
  } else {
    const summary = document.createElement('div');
    summary.className = 'day-summary';
    day.units.forEach(u => {
      const row = document.createElement('div');
      row.className = 'unit-summary';
      const badge = document.createElement('span');
      badge.className = 'category-badge ' + u.category;
      badge.textContent = CATEGORY_LABELS[u.category] || u.category;
      row.appendChild(badge);
      const t = document.createElement('span');
      t.className = 'unit-title-summary';
      t.textContent = u.title;
      row.appendChild(t);
      if (u.duration) {
        const dur = document.createElement('span');
        dur.className = 'unit-duration-summary';
        dur.textContent = `${u.duration} Min`;
        row.appendChild(dur);
      }
      summary.appendChild(row);
    });
    info.appendChild(summary);
  }
  header.appendChild(info);

  if (day.units.length > 0) {
    const chev = document.createElement('span');
    chev.className = 'day-chevron';
    chev.textContent = '▾';
    header.appendChild(chev);
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => card.classList.toggle('open'));
  }

  card.appendChild(header);

  if (day.units.length > 0) {
    const body = document.createElement('div');
    body.className = 'day-body';
    day.units.forEach((u, ui) => body.appendChild(renderUnit(u, idx, ui)));
    card.appendChild(body);
  }

  return card;
}

function renderUnit(unit, dayIdx, uIdx) {
  const box = document.createElement('div');
  box.className = 'unit-detail-box' + (unit.completed ? ' completed' : '');

  const top = document.createElement('div');
  top.className = 'unit-detail-top';
  const badge = document.createElement('span');
  badge.className = 'category-badge ' + unit.category;
  badge.textContent = CATEGORY_LABELS[unit.category] || unit.category;
  top.appendChild(badge);
  const title = document.createElement('div');
  title.className = 'unit-detail-title';
  title.textContent = unit.title || '(ohne Titel)';
  top.appendChild(title);
  if (unit.duration) {
    const dur = document.createElement('span');
    dur.className = 'unit-duration';
    dur.textContent = `${unit.duration} Min`;
    top.appendChild(dur);
  }
  box.appendChild(top);

  if (unit.description) {
    const desc = document.createElement('div');
    desc.className = 'unit-desc';
    desc.textContent = unit.description;
    box.appendChild(desc);
  }

  if (unit.detail && unit.detail.length) {
    const ul = document.createElement('ul');
    ul.className = 'unit-detail-list';
    unit.detail.forEach(d => {
      const li = document.createElement('li');
      li.textContent = d;
      ul.appendChild(li);
    });
    box.appendChild(ul);
  }

  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'edit-link';
  edit.textContent = 'Bearbeiten';
  edit.addEventListener('click', () => openEdit(currentWeek, dayIdx, uIdx));
  box.appendChild(edit);

  return box;
}

function openEdit(weekIdx, dayIdx, unitIdx) {
  editing = { weekIdx, dayIdx, unitIdx };
  const day = state.weeks[weekIdx].days[dayIdx];
  const unit = day.units[unitIdx];
  const form = /** @type {any} */ (document.getElementById('edit-form'));
  form.weekday.value = String(dayIdx);
  form.category.value = unit.category || 'mobility';
  form.duration.value = unit.duration || '';
  document.getElementById('edit-title').textContent = 'Einheit bearbeiten';
  document.getElementById('edit-unit-title').textContent = unit.title || '';
  /** @type {HTMLDialogElement} */ (document.getElementById('edit-dialog')).showModal();
  setTimeout(() => form.category.focus(), 0);
}

function setupDialog() {
  const dialog = /** @type {HTMLDialogElement} */ (document.getElementById('edit-dialog'));
  const form = /** @type {any} */ (document.getElementById('edit-form'));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!editing) return;
    const { weekIdx, dayIdx, unitIdx } = editing;
    const day = state.weeks[weekIdx].days[dayIdx];
    const unit = day.units[unitIdx];
    const newDayIdx = parseInt(form.weekday.value, 10);

    unit.category = form.category.value || 'mobility';
    unit.duration = Number(form.duration.value) || 0;

    if (Number.isInteger(newDayIdx) && newDayIdx !== dayIdx) {
      day.units.splice(unitIdx, 1);
      state.weeks[weekIdx].days[newDayIdx].units.push(unit);
    }

    saveState();
    dialog.close();
    render();
  });
  document.getElementById('cancel-btn').addEventListener('click', () => dialog.close());
}

function setupHeader() {
  document.getElementById('export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trainingsplan-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        state = migrate(JSON.parse(reader.result));
        currentWeek = 0;
        saveState();
        render();
      } catch (err) {
        alert('Import fehlgeschlagen: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupDialog();
  setupHeader();
  rotateQuote();
  render();
});
