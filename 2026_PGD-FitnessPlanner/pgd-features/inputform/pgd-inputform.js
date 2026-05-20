/* ============================================
   SURF FITNESS — PROFIL & PLAN ÜBERSICHT
   localStorage key: trainingsplan-v2 (profile sub-key)
   ============================================ */

'use strict';

const LS_KEY = 'trainingsplan-v2';

const SCALE_DESCRIPTIONS = {
  paddelausdauer: ['', 'gar keine Erfahrung', 'erste kurze Versuche', '2–3 km mit Pausen', '4–5 km mit kurzen Stops', '5+ km am Stück'],
  okoerper:       ['', 'wenig Krafttraining', 'gelegentliches Training', 'regelmäßig, Push-ups 10+', 'strukturiertes Training', 'Push-ups 15+, Klimmzüge'],
  cardio:         ['', 'kaum aktiv', '1× Sport pro Woche', '2–3× Sport pro Woche', 'regelmäßiger Ausdauersport', 'täglicher Sport, Wettkampf'],
  popup:          ['', 'langsam / technische Probleme', 'langsam aber korrekt', 'flüssig, 1–2 Sek', 'schnell und kontrolliert', 'explosiv unter 1 Sek, sauber'],
  stabilitaet:    ['', 'wackelig / unsicherer Stand', 'kurz einbeinig möglich', '15 sek einbeinig stabil', '25 sek einbeinig stabil', '30 sek Augen zu, je Bein'],
  beweglichkeit:  ['', 'sehr steif / kaum Dehnen', 'etwas eingeschränkt', 'normal, gelegentl. Dehnen', 'gut beweglich', 'sehr beweglich, regelmäßig Yoga'],
  balance:        ['', 'unsicher / wenig Koordination', 'durchschnittlich koordiniert', 'gutes Körpergefühl', 'sehr koordiniert', 'exzellent, Balancesport'],
};

const ACCENT_COLORS = {
  paddle:   'var(--accent-paddle)',
  strength: 'var(--accent-strength)',
  mobility: 'var(--accent-mobility)',
};

const GOAL_CATEGORIES = [
  {
    id: 'paddle',
    title: 'Paddle Power',
    color: 'var(--cat-paddeln)',
    cssClass: 'paddle',
    keys: ['paddelausdauer', 'okoerper', 'cardio'],
    targets: [
      'Paddeln: 5 km am Stück',
      'Push-ups: 15× langsam, Hüfte gerade',
      'HIIT: 45 min ohne Einbruch',
      'Rad: 75 min Zone 2',
    ],
  },
  {
    id: 'strength',
    title: 'Surf Strength',
    color: 'var(--cat-kraft)',
    cssClass: 'strength',
    keys: ['popup', 'stabilitaet'],
    targets: [
      'Pop-up: 10× explosiv unter 1 Sek',
      'Bulgarian Split Squat: 3×10/S 6–8 kg',
      'Side Plank: 45 sek je Seite',
      'Single Leg Balance: 30 sek Augen zu',
    ],
  },
  {
    id: 'mobility',
    title: 'Stabilität & Beweglichkeit',
    color: 'var(--cat-mobility)',
    cssClass: 'mobility',
    keys: ['beweglichkeit', 'balance'],
    targets: [
      'Yoga: 1–2× /Woche mind. 60 min',
      'Mobility: 2× /Woche 20–25 min',
      'Cobra: Arme gestreckt, Becken am Boden',
      'Thoraxrotation: 45° je Seite',
    ],
  },
];

const SCALE_LABELS = {
  paddelausdauer: 'Paddelausdauer',
  okoerper: 'Oberkörperkraft',
  cardio: 'Cardio-Basis',
  popup: 'Pop-up',
  stabilitaet: 'Unterkörper-Stabilität',
  beweglichkeit: 'Beweglichkeit',
  balance: 'Körpergefühl / Balance',
};

const WEEK_OVERVIEW = [
  { num: 1, phase: 'Slow Start',  dates: '12. – 18. Mai',       goal: 'Sanfter Wiedereinstieg — erste Rad-Runde',           cats: ['mobility', 'erholung', 'rad', 'yoga'] },
  { num: 2, phase: 'Get ready',   dates: '19. – 25. Mai',       goal: 'Langsamer Einstieg in Trainingsplan',                cats: ['mobility', 'yoga', 'rad', 'erholung'] },
  { num: 3, phase: 'Perform',     dates: '26. Mai – 1. Juni',   goal: 'Paddel-Distanz auf 3 km & erste Krafteinheiten',     cats: ['kraft', 'rad', 'paddeln', 'mobility'] },
  { num: 4, phase: 'Accelerate',  dates: '2. – 8. Juni',        goal: '4 km Paddeln am Stück & HIIT-Start',                 cats: ['kraft', 'rad', 'yoga', 'hiit', 'paddeln', 'erholung'] },
  { num: 5, phase: 'Peak-Block',  dates: '9. – 15. Juni',       goal: '5 km Paddeln ohne langen Stopp — Peak',              cats: ['kraft', 'paddeln', 'mobility', 'hiit', 'rad'] },
  { num: 6, phase: 'Tapering',    dates: '16. – 22. Juni',      goal: 'Tapering & Abflug ✈️ Malediven 20. Juni',            cats: ['kraft', 'mobility', 'rad', 'yoga', 'erholung'] },
];

const CATEGORY_LABELS = {
  mobility: 'Mobility',
  yoga: 'Yoga',
  rad: 'Cardio Radfahren',
  laufen: 'Cardio Laufen',
  paddeln: 'Paddeln',
  schwimmen: 'Schwimmen',
  kraft: 'Kraft',
  'kraft-upper': 'Kraft Upper',
  'kraft-lower': 'Kraft Lower',
  hiit: 'HIIT',
  erholung: 'Erholung',
};

// ── Storage ──

function loadStorage() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}

function saveProfile(profile) {
  const data = loadStorage();
  data.profile = profile;
  data.profileUpdatedAt = new Date().toISOString();
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function loadProfile() {
  return loadStorage().profile || null;
}

// ── Sliders ──

function updateSlider(input) {
  const key = input.dataset.key;
  const category = input.dataset.category;
  const val = parseInt(input.value, 10);
  const pct = ((val - 1) / 4 * 100).toFixed(0);
  const color = ACCENT_COLORS[category];

  input.style.background =
    `linear-gradient(to right, ${color} ${pct}%, var(--border) ${pct}%)`;

  const valEl = document.getElementById('val-' + key);
  const descEl = document.getElementById('desc-' + key);
  if (valEl) valEl.textContent = val;
  if (descEl) descEl.textContent = SCALE_DESCRIPTIONS[key][val] || '';

  renderGoals();
}

function initSliders() {
  document.querySelectorAll('input[type="range"][data-key]').forEach(input => {
    updateSlider(input);
    input.addEventListener('input', () => updateSlider(input));
  });
}

// ── Level Buttons ──

function initLevelButtons() {
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
        b.className = 'level-btn';
      });
      btn.classList.add('selected-personal');
    });
  });
}

// ── Garmin Toggle ──

function initGarminToggle() {
  const toggle = document.getElementById('garmin-toggle-paddle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const fields = document.getElementById('garmin-paddle');
    const sw = document.getElementById('toggle-garmin-paddle');
    if (fields) fields.classList.toggle('visible');
    if (sw) sw.classList.toggle('on');
  });
}

// ── Collect & Restore ──

function getScale(key) {
  return parseInt(document.getElementById('range-' + key)?.value || '1', 10);
}

function collectProfile() {
  const get = id => document.getElementById(id)?.value || '';
  const getNum = id => parseFloat(get(id)) || null;
  const getSelected = group =>
    document.querySelector(`[data-group="${group}"][class*="selected"]`)?.dataset.value || null;

  const alter = getNum('alter');

  return {
    personal: {
      name: get('name'),
      alter,
      geschlecht: get('geschlecht'),
      groesse: getNum('groesse'),
      gewicht: getNum('gewicht'),
      maxHF: alter ? 220 - alter : null,
      trainingLevel: getSelected('training'),
      surfLevel: getSelected('surf'),
    },
    goal: {
      tripDatum: get('trip-datum'),
      surfTage: getNum('surf-tage'),
      surfStunden: getNum('surf-stunden'),
    },
    paddlePower: {
      paddelausdauer: getScale('paddelausdauer'),
      okoerper: getScale('okoerper'),
      cardio: getScale('cardio'),
    },
    surfStrength: {
      popup: getScale('popup'),
      stabilitaet: getScale('stabilitaet'),
    },
    stabilitaetBeweglichkeit: {
      beweglichkeit: getScale('beweglichkeit'),
      balance: getScale('balance'),
    },
    garmin: {
      vo2max: getNum('vo2max'),
      ruheHF: getNum('ruhe-hf'),
      hrv: getNum('hrv'),
      bodyBattery: getNum('body-battery'),
      load: getNum('load'),
      status: get('garmin-status') || null,
    },
  };
}

function restoreForm(profile) {
  if (!profile) return;
  const { personal, goal, paddlePower, surfStrength, stabilitaetBeweglichkeit, garmin } = profile;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== null && val !== undefined) el.value = val;
  };
  const setScale = (key, val) => {
    const el = document.getElementById('range-' + key);
    if (el && val) { el.value = val; updateSlider(el); }
  };

  if (personal) {
    set('name', personal.name);
    set('alter', personal.alter);
    set('geschlecht', personal.geschlecht);
    set('groesse', personal.groesse);
    set('gewicht', personal.gewicht);
    if (personal.trainingLevel) {
      const btn = document.querySelector(`[data-group="training"][data-value="${personal.trainingLevel}"]`);
      if (btn) btn.classList.add('selected-personal');
    }
    if (personal.surfLevel) {
      const btn = document.querySelector(`[data-group="surf"][data-value="${personal.surfLevel}"]`);
      if (btn) btn.classList.add('selected-personal');
    }
  }
  if (goal) {
    set('trip-datum', goal.tripDatum);
    set('surf-tage', goal.surfTage);
    set('surf-stunden', goal.surfStunden);
  }
  if (paddlePower) {
    setScale('paddelausdauer', paddlePower.paddelausdauer);
    setScale('okoerper', paddlePower.okoerper);
    setScale('cardio', paddlePower.cardio);
  }
  if (surfStrength) {
    setScale('popup', surfStrength.popup);
    setScale('stabilitaet', surfStrength.stabilitaet);
  }
  if (stabilitaetBeweglichkeit) {
    setScale('beweglichkeit', stabilitaetBeweglichkeit.beweglichkeit);
    setScale('balance', stabilitaetBeweglichkeit.balance);
  }
  if (garmin) {
    set('vo2max', garmin.vo2max);
    set('ruhe-hf', garmin.ruheHF);
    set('hrv', garmin.hrv);
    set('body-battery', garmin.bodyBattery);
    set('load', garmin.load);
    set('garmin-status', garmin.status);
  }
}

// ── View / Edit Modes ──

const LEVEL_LABELS = {
  anfaenger: 'Anfänger',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  pro: 'Pro',
};

const GESCHLECHT_LABELS = { w: 'Weiblich', m: 'Männlich', d: 'Divers' };

function viewItem(label, value, accent) {
  const item = document.createElement('div');
  item.className = 'view-item';
  const l = document.createElement('div');
  l.className = 'view-item-label';
  l.textContent = label;
  const v = document.createElement('div');
  v.className = 'view-item-value';
  if (accent) v.style.color = accent;
  v.textContent = (value === null || value === undefined || value === '') ? '–' : value;
  item.appendChild(l);
  item.appendChild(v);
  return item;
}

function viewScaleItem(label, val, accent) {
  const item = document.createElement('div');
  item.className = 'view-item view-item-scale';
  const l = document.createElement('div');
  l.className = 'view-item-label';
  l.textContent = label;
  const v = document.createElement('div');
  v.className = 'view-item-value';
  v.style.color = accent;
  v.textContent = val + ' / 5';
  const bar = document.createElement('div');
  bar.className = 'view-scale-bar';
  const fill = document.createElement('div');
  fill.className = 'view-scale-fill';
  fill.style.width = ((val - 1) / 4 * 100) + '%';
  fill.style.background = accent;
  bar.appendChild(fill);
  item.appendChild(l);
  item.appendChild(v);
  item.appendChild(bar);
  return item;
}

function viewGroupHeader(label, accentClass) {
  const h = document.createElement('div');
  h.className = 'view-group-header';
  const tag = document.createElement('span');
  tag.className = 'block-tag ' + accentClass;
  tag.textContent = label;
  h.appendChild(tag);
  return h;
}

function renderStatusView(profile) {
  const grid = document.getElementById('status-view-grid');
  if (!grid || !profile) return;
  grid.innerHTML = '';

  const p = profile.personal || {};
  const g = profile.goal || {};
  const pp = profile.paddlePower || {};
  const ss = profile.surfStrength || {};
  const sb = profile.stabilitaetBeweglichkeit || {};

  // Personal group
  grid.appendChild(viewGroupHeader('Persönliche Daten', 'tag-personal'));
  const personalRow = document.createElement('div');
  personalRow.className = 'view-row';
  personalRow.appendChild(viewItem('Name', p.name));
  personalRow.appendChild(viewItem('Alter', p.alter ? p.alter + ' J' : null));
  personalRow.appendChild(viewItem('Geschlecht', GESCHLECHT_LABELS[p.geschlecht] || p.geschlecht));
  personalRow.appendChild(viewItem('Größe', p.groesse ? p.groesse + ' cm' : null));
  personalRow.appendChild(viewItem('Gewicht', p.gewicht ? p.gewicht + ' kg' : null));
  personalRow.appendChild(viewItem('Max HF', p.maxHF ? p.maxHF + ' bpm' : null));
  personalRow.appendChild(viewItem('Training', LEVEL_LABELS[p.trainingLevel] || p.trainingLevel));
  personalRow.appendChild(viewItem('Surf-Level', LEVEL_LABELS[p.surfLevel] || p.surfLevel));
  grid.appendChild(personalRow);

  // Goal group
  grid.appendChild(viewGroupHeader('Zieldefinition', 'tag-goal'));
  const goalRow = document.createElement('div');
  goalRow.className = 'view-row';
  goalRow.appendChild(viewItem('Trip-Datum', g.tripDatum ? new Date(g.tripDatum).toLocaleDateString('de-DE') : null));
  goalRow.appendChild(viewItem('Surf-Tage', g.surfTage));
  goalRow.appendChild(viewItem('Std./Tag', g.surfStunden));
  grid.appendChild(goalRow);

  // Paddle
  grid.appendChild(viewGroupHeader('Paddle Power', 'tag-paddle'));
  const paddleRow = document.createElement('div');
  paddleRow.className = 'view-row';
  paddleRow.appendChild(viewScaleItem('Paddelausdauer', pp.paddelausdauer || 1, 'var(--cat-paddeln)'));
  paddleRow.appendChild(viewScaleItem('Oberkörperkraft', pp.okoerper || 1, 'var(--cat-paddeln)'));
  paddleRow.appendChild(viewScaleItem('Cardio-Basis', pp.cardio || 1, 'var(--cat-paddeln)'));
  grid.appendChild(paddleRow);

  // Strength
  grid.appendChild(viewGroupHeader('Surf Strength', 'tag-strength'));
  const strengthRow = document.createElement('div');
  strengthRow.className = 'view-row';
  strengthRow.appendChild(viewScaleItem('Pop-up', ss.popup || 1, 'var(--cat-kraft)'));
  strengthRow.appendChild(viewScaleItem('Unterkörper-Stab.', ss.stabilitaet || 1, 'var(--cat-kraft)'));
  grid.appendChild(strengthRow);

  // Mobility
  grid.appendChild(viewGroupHeader('Stabilität & Beweglichkeit', 'tag-mobility'));
  const mobilityRow = document.createElement('div');
  mobilityRow.className = 'view-row';
  mobilityRow.appendChild(viewScaleItem('Beweglichkeit', sb.beweglichkeit || 1, 'var(--cat-mobility)'));
  mobilityRow.appendChild(viewScaleItem('Körpergefühl / Balance', sb.balance || 1, 'var(--cat-mobility)'));
  grid.appendChild(mobilityRow);
}

function enterViewMode() {
  const profile = loadProfile();
  if (!profile) { enterEditMode(); return; }
  renderStatusView(profile);
  document.getElementById('status-view').hidden = false;
  document.getElementById('status-edit').hidden = true;
}

function enterEditMode() {
  document.getElementById('status-view').hidden = true;
  document.getElementById('status-edit').hidden = false;
}

// ── Goals Section (live) ──

function renderGoals() {
  const container = document.getElementById('goals-grid');
  if (!container) return;
  container.innerHTML = '';

  GOAL_CATEGORIES.forEach(cat => {
    const scores = cat.keys.map(k => ({ key: k, label: SCALE_LABELS[k], val: getScale(k) }));
    const avg = scores.reduce((a, b) => a + b.val, 0) / scores.length;
    const lowest = scores.reduce((min, s) => s.val < min.val ? s : min, scores[0]);

    const card = document.createElement('div');
    card.className = 'goal-card goal-' + cat.cssClass;

    // Compact header
    const header = document.createElement('div');
    header.className = 'goal-card-header';
    const dot = document.createElement('span');
    dot.className = 'goal-dot';
    dot.style.background = cat.color;
    header.appendChild(dot);
    const title = document.createElement('span');
    title.className = 'goal-card-title';
    title.textContent = cat.title;
    header.appendChild(title);
    const avgVal = document.createElement('span');
    avgVal.className = 'goal-card-avg';
    avgVal.style.color = cat.color;
    avgVal.textContent = avg.toFixed(1);
    header.appendChild(avgVal);
    card.appendChild(header);

    // Score rows (compact)
    const scoresEl = document.createElement('div');
    scoresEl.className = 'goal-scores';
    scores.forEach(s => {
      const row = document.createElement('div');
      row.className = 'goal-score-row';
      const lbl = document.createElement('span');
      lbl.className = 'goal-score-label';
      lbl.textContent = s.label;
      const bar = document.createElement('span');
      bar.className = 'goal-score-bar';
      const fill = document.createElement('span');
      fill.className = 'goal-score-fill';
      fill.style.width = ((s.val - 1) / 4 * 100) + '%';
      fill.style.background = cat.color;
      bar.appendChild(fill);
      const v = document.createElement('span');
      v.className = 'goal-score-value';
      v.textContent = s.val + '/5';
      row.appendChild(lbl);
      row.appendChild(bar);
      row.appendChild(v);
      scoresEl.appendChild(row);
    });
    card.appendChild(scoresEl);

    // Focus hint
    const focus = document.createElement('div');
    focus.className = 'goal-focus';
    if (avg < 3) {
      focus.innerHTML = `<strong>Schwerpunkt:</strong> ${lowest.label} steigern`;
    } else if (avg < 4.5) {
      focus.innerHTML = `<strong>Schwerpunkt:</strong> ${lowest.label} verfeinern`;
    } else {
      focus.innerHTML = `<strong>Stark!</strong> Niveau halten & ${lowest.label} ausreizen`;
    }
    card.appendChild(focus);

    // Targets (compact list)
    const targetList = document.createElement('ul');
    targetList.className = 'goal-targets';
    cat.targets.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      targetList.appendChild(li);
    });
    card.appendChild(targetList);

    container.appendChild(card);
  });
}

// ── Plan Overview ──

function renderPlan() {
  const container = document.getElementById('plan-overview');
  if (!container) return;
  container.innerHTML = '';

  WEEK_OVERVIEW.forEach(week => {
    const row = document.createElement('div');
    row.className = 'plan-row';

    const num = document.createElement('div');
    num.className = 'plan-week-num';
    num.textContent = 'W' + week.num;
    row.appendChild(num);

    const info = document.createElement('div');
    info.className = 'plan-week-info';
    const phaseLine = document.createElement('div');
    phaseLine.className = 'plan-phase-line';
    const phase = document.createElement('span');
    phase.className = 'plan-phase';
    phase.textContent = week.phase;
    phaseLine.appendChild(phase);
    const dates = document.createElement('span');
    dates.className = 'plan-dates';
    dates.textContent = week.dates;
    phaseLine.appendChild(dates);
    info.appendChild(phaseLine);

    const goal = document.createElement('div');
    goal.className = 'plan-goal';
    goal.textContent = week.goal;
    info.appendChild(goal);

    const cats = document.createElement('div');
    cats.className = 'plan-cats';
    week.cats.forEach(c => {
      const badge = document.createElement('span');
      badge.className = 'category-badge ' + c;
      badge.textContent = CATEGORY_LABELS[c] || c;
      cats.appendChild(badge);
    });
    info.appendChild(cats);

    row.appendChild(info);
    container.appendChild(row);
  });
}

// ── Export ──

function exportJSON(profile) {
  const json = JSON.stringify(profile, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'surf-profil.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ── Init ──

function initButtons() {
  const submitBtn = document.getElementById('btn-submit');
  if (submitBtn) submitBtn.addEventListener('click', () => {
    const profile = collectProfile();
    saveProfile(profile);
    renderGoals();
    enterViewMode();
  });

  const editBtn = document.getElementById('btn-edit');
  if (editBtn) editBtn.addEventListener('click', enterEditMode);

  const exportBtn = document.getElementById('btn-export');
  if (exportBtn) exportBtn.addEventListener('click', () => exportJSON(collectProfile()));

  const exportViewBtn = document.getElementById('btn-export-view');
  if (exportViewBtn) exportViewBtn.addEventListener('click', () => {
    const p = loadProfile() || collectProfile();
    exportJSON(p);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSliders();
  initLevelButtons();
  initGarminToggle();
  initButtons();

  const saved = loadProfile();
  if (saved) {
    restoreForm(saved);
    enterViewMode();
  } else {
    enterEditMode();
  }

  renderGoals();
  renderPlan();
});
