/* ============================================
   SURF FITNESS — PROFIL & PLAN ÜBERSICHT
   Profile-Speicher: pgd-features/training-plan/users/{userId}/profile.json
   ============================================ */

'use strict';

const USERS_BASE = '/pgd-features/training-plan/users';
const LAST_USER_KEY = 'lastUser';

function slugifyName(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // accents
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

let isNewUserFlow = getUrlParam('new') === '1';
let userId = !isNewUserFlow ? (getUrlParam('user') || (() => {
  try { return localStorage.getItem(LAST_USER_KEY); } catch { return null; }
})()) : null;

function userProfilePath(id) { return `${USERS_BASE}/${id}/profile.json`; }
function userPlanPath(id) { return `${USERS_BASE}/${id}/plan-v1.json`; }
function userBasePath(id) { return `${USERS_BASE}/${id}`; }

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
  stabilitaet: 'Unterkörperkraft',
  beweglichkeit: 'Beweglichkeit',
  balance: 'Balance',
};

const EQUIPMENT_LABELS = {
  studio: 'Fitness Studio',
  home: 'Training zu Hause',
  rad: 'Radfahren',
  joggen: 'Joggen',
  schwimmen: 'Schwimmen',
  paddeln: 'Paddeltraining',
  surfen: 'Surfen',
  hiit: 'HIIT / Zirkel',
  yoga: 'Yoga / Pilates',
};

const WEEKDAY_LABELS = { mo: 'Mo', di: 'Di', mi: 'Mi', do: 'Do', fr: 'Fr', sa: 'Sa', so: 'So' };

const DATUM_FLEX_LABELS = { fix: 'Fix', flexibel: 'Flexibel' };

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
  erholung: 'Erholung',
};

// ── Storage (via Mini-Server: users/{id}/profile.json) ──

let profileCache = null;

async function loadProfile() {
  if (!userId) return null;
  try {
    const res = await fetch(userProfilePath(userId), { cache: 'no-store' });
    if (res.status === 404) { profileCache = null; return null; }
    if (!res.ok) throw new Error(`GET profile: ${res.status}`);
    const data = await res.json();
    profileCache = data?.profile || null;
    return profileCache;
  } catch (err) {
    console.warn('Profil laden fehlgeschlagen (Server läuft?):', err);
    return profileCache;
  }
}

async function saveProfileForUser(id, profile) {
  const payload = { profile, profileUpdatedAt: new Date().toISOString() };
  const res = await fetch(userProfilePath(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload, null, 2)
  });
  if (!res.ok) throw new Error(`PUT profile: ${res.status}`);
}

async function saveProfile(profile) {
  if (!userId) throw new Error('Kein userId – bitte erst Profil neu anlegen');
  try {
    await saveProfileForUser(userId, profile);
    profileCache = profile;
    return true;
  } catch (err) {
    console.warn('Profil speichern fehlgeschlagen (Server läuft?):', err);
    alert('Profil konnte nicht gespeichert werden. Läuft der Server (start-app.command)?');
    return false;
  }
}

// Generiert plan-v1.json via Claude API (Server-Proxy POST /api/generate-plan)
async function generatePlanV1(profile) {
  const res = await fetch('/api/generate-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile })
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const errData = await res.json();
      if (errData?.error) msg = errData.error;
    } catch {
      try {
        const text = await res.text();
        if (text) msg = text.slice(0, 400);
      } catch {}
    }
    throw new Error(msg);
  }
  const data = await res.json();
  if (!data?.plan?.weeks) throw new Error('Antwort enthält keinen gültigen Plan');
  return data.plan;
}

async function savePlanForUser(id, plan) {
  const res = await fetch(userPlanPath(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan, null, 2)
  });
  if (!res.ok) throw new Error(`PUT plan-v1: ${res.status}`);
}

async function deleteUser(id) {
  const res = await fetch(userBasePath(id), { method: 'DELETE' });
  if (!res.ok && res.status !== 404) throw new Error(`DELETE user: ${res.status}`);
}

async function listUsers() {
  try {
    const res = await fetch(`${USERS_BASE}/_list`, { cache: 'no-store' });
    if (!res.ok) return [];
    const all = await res.json();
    return all.filter(e => e.endsWith('/')).map(e => e.slice(0, -1));
  } catch { return []; }
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

// ── Chip Groups (Multi-Select) ──

function initChipGroups() {
  document.querySelectorAll('.chip-group .chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      chip.classList.toggle('selected');
    });
  });
}

function getChipValues(groupId) {
  return [...document.querySelectorAll(`#${groupId} .chip.selected`)].map(c => c.dataset.value);
}

function setChipValues(groupId, values) {
  const set = new Set(Array.isArray(values) ? values : []);
  document.querySelectorAll(`#${groupId} .chip`).forEach(c => {
    c.classList.toggle('selected', set.has(c.dataset.value));
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
  const getTrim = id => (document.getElementById(id)?.value || '').trim();
  const getNum = id => parseFloat(get(id)) || null;
  const getSelected = group =>
    document.querySelector(`[data-group="${group}"][class*="selected"]`)?.dataset.value || null;
  const getChecked = id => !!document.getElementById(id)?.checked;

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
      datumFlex: getSelected('datum-flex'),
      surfTage: getNum('surf-tage'),
      surfStunden: getNum('surf-stunden'),
      anderesZiel: getTrim('anderes-ziel'),
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
    equipment: {
      activities: getChipValues('chip-group-equipment'),
      sonstiges: getTrim('equipment-sonstiges'),
    },
    routinen: {
      noSportWeekdays: getChipValues('chip-group-weekdays'),
      biweekly: getChecked('weekdays-biweekly'),
      praeferenzen: getTrim('praeferenzen'),
      verletzungen: getTrim('verletzungen'),
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
  const { personal, goal, paddlePower, surfStrength, stabilitaetBeweglichkeit, equipment, routinen, garmin } = profile;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== null && val !== undefined) el.value = val;
  };
  const setChecked = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.checked = !!val;
  };
  const setLevel = (group, value) => {
    if (!value) return;
    const btn = document.querySelector(`[data-group="${group}"][data-value="${value}"]`);
    if (btn) btn.classList.add('selected-personal');
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
    setLevel('training', personal.trainingLevel);
    setLevel('surf', personal.surfLevel);
  }
  if (goal) {
    set('trip-datum', goal.tripDatum);
    setLevel('datum-flex', goal.datumFlex);
    set('surf-tage', goal.surfTage);
    set('surf-stunden', goal.surfStunden);
    set('anderes-ziel', goal.anderesZiel);
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
  if (equipment) {
    setChipValues('chip-group-equipment', equipment.activities);
    set('equipment-sonstiges', equipment.sonstiges);
  }
  if (routinen) {
    setChipValues('chip-group-weekdays', routinen.noSportWeekdays);
    setChecked('weekdays-biweekly', routinen.biweekly);
    set('praeferenzen', routinen.praeferenzen);
    set('verletzungen', routinen.verletzungen);
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
  const eq = profile.equipment || {};
  const rt = profile.routinen || {};

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
  grid.appendChild(personalRow);

  // Goal group
  grid.appendChild(viewGroupHeader('Zieldefinition', 'tag-goal'));
  const goalRow = document.createElement('div');
  goalRow.className = 'view-row';
  goalRow.appendChild(viewItem('Ziel-Datum', g.tripDatum ? new Date(g.tripDatum).toLocaleDateString('de-DE') : null));
  goalRow.appendChild(viewItem('Datum ist', DATUM_FLEX_LABELS[g.datumFlex] || g.datumFlex));
  goalRow.appendChild(viewItem('Surf-Tage', g.surfTage));
  goalRow.appendChild(viewItem('Std./Tag', g.surfStunden));
  grid.appendChild(goalRow);
  if (g.anderesZiel) {
    const anderesRow = document.createElement('div');
    anderesRow.className = 'view-row';
    anderesRow.appendChild(viewItem('Anderes Ziel', g.anderesZiel));
    grid.appendChild(anderesRow);
  }

  // Selbsteinschätzung — Levels
  grid.appendChild(viewGroupHeader('Fitness-Status — Selbsteinschätzung', 'tag-personal'));
  const levelRow = document.createElement('div');
  levelRow.className = 'view-row';
  levelRow.appendChild(viewItem('Training', LEVEL_LABELS[p.trainingLevel] || p.trainingLevel));
  levelRow.appendChild(viewItem('Surf-Level', LEVEL_LABELS[p.surfLevel] || p.surfLevel));
  grid.appendChild(levelRow);

  // Paddle
  grid.appendChild(viewGroupHeader('Aktuelle Paddle Power', 'tag-paddle'));
  const paddleRow = document.createElement('div');
  paddleRow.className = 'view-row';
  paddleRow.appendChild(viewScaleItem('Paddelausdauer', pp.paddelausdauer || 1, 'var(--cat-paddeln)'));
  paddleRow.appendChild(viewScaleItem('Oberkörperkraft', pp.okoerper || 1, 'var(--cat-paddeln)'));
  paddleRow.appendChild(viewScaleItem('Cardio-Basis', pp.cardio || 1, 'var(--cat-paddeln)'));
  grid.appendChild(paddleRow);

  // Strength
  grid.appendChild(viewGroupHeader('Aktuelle Surf Strength', 'tag-strength'));
  const strengthRow = document.createElement('div');
  strengthRow.className = 'view-row';
  strengthRow.appendChild(viewScaleItem('Pop-up', ss.popup || 1, 'var(--cat-kraft)'));
  strengthRow.appendChild(viewScaleItem('Unterkörperkraft', ss.stabilitaet || 1, 'var(--cat-kraft)'));
  grid.appendChild(strengthRow);

  // Mobility
  grid.appendChild(viewGroupHeader('Aktuelle Mobilität', 'tag-mobility'));
  const mobilityRow = document.createElement('div');
  mobilityRow.className = 'view-row';
  mobilityRow.appendChild(viewScaleItem('Beweglichkeit', sb.beweglichkeit || 1, 'var(--cat-mobility)'));
  mobilityRow.appendChild(viewScaleItem('Balance', sb.balance || 1, 'var(--cat-mobility)'));
  grid.appendChild(mobilityRow);

  // Equipment & Aktivitäten
  const eqActivities = Array.isArray(eq.activities) ? eq.activities : [];
  if (eqActivities.length || eq.sonstiges) {
    grid.appendChild(viewGroupHeader('Equipment & Aktivitäten', 'tag-personal'));
    const eqRow = document.createElement('div');
    eqRow.className = 'view-row';
    const labels = eqActivities.map(v => EQUIPMENT_LABELS[v] || v);
    if (eq.sonstiges) labels.push(eq.sonstiges);
    eqRow.appendChild(viewItem('Aktivitäten', labels.length ? labels.join(', ') : null));
    grid.appendChild(eqRow);
  }

  // Wöchentliche Routinen
  const weekdays = Array.isArray(rt.noSportWeekdays) ? rt.noSportWeekdays : [];
  if (weekdays.length || rt.praeferenzen || rt.verletzungen) {
    grid.appendChild(viewGroupHeader('Wöchentliche Routinen', 'tag-personal'));
    const rtRow = document.createElement('div');
    rtRow.className = 'view-row';
    if (weekdays.length) {
      const wdLabel = weekdays.map(v => WEEKDAY_LABELS[v] || v).join(', ') + (rt.biweekly ? ' (bi-weekly)' : '');
      rtRow.appendChild(viewItem('Sport nicht möglich', wdLabel));
    }
    if (rt.praeferenzen) rtRow.appendChild(viewItem('Präferenzen', rt.praeferenzen));
    if (rt.verletzungen) rtRow.appendChild(viewItem('Verletzungen', rt.verletzungen));
    grid.appendChild(rtRow);
  }
}

function setGoalsNavVisible(visible) {
  const nav = document.getElementById('goals-nav-bar');
  if (!nav) return;
  nav.hidden = !visible;
  if (visible) {
    const deleteBtn = document.getElementById('btn-delete-user');
    if (deleteBtn) deleteBtn.hidden = isNewUserFlow || !userId;
  }
}

async function enterViewMode() {
  const profile = profileCache !== null ? profileCache : await loadProfile();
  if (!profile) { enterEditMode(); return; }
  renderStatusView(profile);
  document.getElementById('status-view').hidden = false;
  document.getElementById('status-edit').hidden = true;
  setGoalsNavVisible(true);
}

function enterEditMode() {
  document.getElementById('status-view').hidden = true;
  document.getElementById('status-edit').hidden = false;
  setGoalsNavVisible(false);
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

// ── Plan Overview (lädt user-spezifisches plan-v1.json) ──

async function fetchUserPlan() {
  if (!userId) return null;
  try {
    const res = await fetch(userPlanPath(userId), { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function uniqueCategoriesFromWeek(week) {
  const set = new Set();
  (week?.days || []).forEach(d => (d?.units || []).forEach(u => {
    if (u?.category) set.add(u.category);
  }));
  return [...set];
}

async function renderPlan() {
  const container = document.getElementById('plan-overview');
  if (!container) return;
  container.innerHTML = '';

  const plan = await fetchUserPlan();
  const weeks = plan?.weeks;
  if (!Array.isArray(weeks) || weeks.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'field-hint';
    empty.textContent = 'Trainingsplan wird erstellt.';
    container.appendChild(empty);
    return;
  }

  weeks.forEach((w, idx) => {
    const row = document.createElement('div');
    row.className = 'plan-row';

    const num = document.createElement('div');
    num.className = 'plan-week-num';
    num.textContent = 'W' + (idx + 1);
    row.appendChild(num);

    const info = document.createElement('div');
    info.className = 'plan-week-info';
    const phaseLine = document.createElement('div');
    phaseLine.className = 'plan-phase-line';
    const phase = document.createElement('span');
    phase.className = 'plan-phase';
    phase.textContent = w.phase || '';
    phaseLine.appendChild(phase);
    const dates = document.createElement('span');
    dates.className = 'plan-dates';
    dates.textContent = w.dateRange || '';
    phaseLine.appendChild(dates);
    info.appendChild(phaseLine);

    const goal = document.createElement('div');
    goal.className = 'plan-goal';
    goal.textContent = w.goal || '';
    info.appendChild(goal);

    const cats = document.createElement('div');
    cats.className = 'plan-cats';
    uniqueCategoriesFromWeek(w).forEach(c => {
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

// ── PDF Export ──

const WEEKDAYS_FULL_DE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const PDF_PROGRESS_EXCLUDED = new Set(['erholung']);

function planTripStats(plan) {
  let planned = 0, done = 0;
  (plan?.weeks || []).forEach(w => (w.days || []).forEach(d => (d.units || []).forEach(u => {
    if (PDF_PROGRESS_EXCLUDED.has(u.category)) return;
    planned++;
    if (u.completed) done++;
  })));
  return { planned, done, pct: planned ? Math.round((done / planned) * 100) : 0 };
}

function pdfItem(label, value, parent) {
  const item = document.createElement('div');
  item.className = 'pdf-profile-item';
  const l = document.createElement('div');
  l.className = 'pdf-profile-label';
  l.textContent = label;
  const v = document.createElement('div');
  v.className = 'pdf-profile-value';
  v.textContent = (value === null || value === undefined || value === '') ? '–' : value;
  item.appendChild(l);
  item.appendChild(v);
  if (parent) parent.appendChild(item);
  return item;
}

function pdfScaleItem(label, val, accent, parent) {
  const item = document.createElement('div');
  item.className = 'pdf-profile-item';
  const l = document.createElement('div');
  l.className = 'pdf-profile-label';
  l.textContent = label;
  const scale = document.createElement('div');
  scale.className = 'pdf-profile-scale';
  const bar = document.createElement('div');
  bar.className = 'pdf-profile-scale-bar';
  const fill = document.createElement('div');
  fill.className = 'pdf-profile-scale-fill';
  fill.style.width = ((val - 1) / 4 * 100) + '%';
  fill.style.background = accent;
  bar.appendChild(fill);
  const v = document.createElement('span');
  v.className = 'pdf-profile-value';
  v.textContent = val + ' / 5';
  v.style.color = accent;
  v.style.fontSize = '11px';
  scale.appendChild(bar);
  scale.appendChild(v);
  item.appendChild(l);
  item.appendChild(scale);
  if (parent) parent.appendChild(item);
  return item;
}

function pdfSection(parent, title) {
  const h3 = document.createElement('h3');
  h3.textContent = title;
  parent.appendChild(h3);
}

function buildPdfPage1Profile(profile) {
  const page = document.createElement('section');
  page.className = 'pdf-page';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'pdf-eyebrow';
  eyebrow.textContent = '01 — Meine Fitnessdaten';
  page.appendChild(eyebrow);

  const h1 = document.createElement('h1');
  h1.textContent = profile?.personal?.name ? `Profil: ${profile.personal.name}` : 'Profil';
  page.appendChild(h1);

  const sub = document.createElement('div');
  sub.className = 'pdf-subtitle';
  sub.textContent = 'Persönliche Angaben und Ziele';
  page.appendChild(sub);

  const p = profile?.personal || {};
  const g = profile?.goal || {};
  const pp = profile?.paddlePower || {};
  const ss = profile?.surfStrength || {};
  const sb = profile?.stabilitaetBeweglichkeit || {};
  const eq = profile?.equipment || {};
  const rt = profile?.routinen || {};

  // Persönliche Daten
  pdfSection(page, 'Persönliche Daten');
  const pGrid = document.createElement('div');
  pGrid.className = 'pdf-profile-grid';
  pdfItem('Name', p.name, pGrid);
  pdfItem('Alter', p.alter ? p.alter + ' J' : null, pGrid);
  pdfItem('Geschlecht', GESCHLECHT_LABELS[p.geschlecht] || p.geschlecht, pGrid);
  pdfItem('Größe', p.groesse ? p.groesse + ' cm' : null, pGrid);
  pdfItem('Gewicht', p.gewicht ? p.gewicht + ' kg' : null, pGrid);
  pdfItem('Max HF', p.maxHF ? p.maxHF + ' bpm' : null, pGrid);
  pdfItem('Training', LEVEL_LABELS[p.trainingLevel] || p.trainingLevel, pGrid);
  pdfItem('Surf-Level', LEVEL_LABELS[p.surfLevel] || p.surfLevel, pGrid);
  page.appendChild(pGrid);

  // Zieldefinition
  pdfSection(page, 'Zieldefinition');
  const gGrid = document.createElement('div');
  gGrid.className = 'pdf-profile-grid';
  pdfItem('Ziel-Datum', g.tripDatum ? new Date(g.tripDatum).toLocaleDateString('de-DE') : null, gGrid);
  pdfItem('Datum ist', DATUM_FLEX_LABELS[g.datumFlex] || g.datumFlex, gGrid);
  pdfItem('Surf-Tage', g.surfTage, gGrid);
  pdfItem('Std./Tag', g.surfStunden, gGrid);
  page.appendChild(gGrid);
  if (g.anderesZiel) {
    const aGrid = document.createElement('div');
    aGrid.className = 'pdf-profile-grid full-col';
    pdfItem('Anderes Ziel', g.anderesZiel, aGrid);
    page.appendChild(aGrid);
  }

  // Selbsteinschätzung — Skalen
  pdfSection(page, 'Selbsteinschätzung — Paddle Power');
  const pdGrid = document.createElement('div');
  pdGrid.className = 'pdf-profile-grid three-col';
  pdfScaleItem('Paddelausdauer', pp.paddelausdauer || 1, 'var(--cat-paddeln)', pdGrid);
  pdfScaleItem('Oberkörperkraft', pp.okoerper || 1, 'var(--cat-paddeln)', pdGrid);
  pdfScaleItem('Cardio-Basis', pp.cardio || 1, 'var(--cat-paddeln)', pdGrid);
  page.appendChild(pdGrid);

  pdfSection(page, 'Selbsteinschätzung — Surf Strength & Mobilität');
  const smGrid = document.createElement('div');
  smGrid.className = 'pdf-profile-grid';
  pdfScaleItem('Pop-up', ss.popup || 1, 'var(--cat-kraft)', smGrid);
  pdfScaleItem('Unterkörperkraft', ss.stabilitaet || 1, 'var(--cat-kraft)', smGrid);
  pdfScaleItem('Beweglichkeit', sb.beweglichkeit || 1, 'var(--cat-mobility)', smGrid);
  pdfScaleItem('Balance', sb.balance || 1, 'var(--cat-mobility)', smGrid);
  page.appendChild(smGrid);

  // Equipment & Routinen
  const eqActivities = Array.isArray(eq.activities) ? eq.activities : [];
  if (eqActivities.length || eq.sonstiges) {
    pdfSection(page, 'Equipment & Aktivitäten');
    const eqGrid = document.createElement('div');
    eqGrid.className = 'pdf-profile-grid full-col';
    const labels = eqActivities.map(v => EQUIPMENT_LABELS[v] || v);
    if (eq.sonstiges) labels.push(eq.sonstiges);
    pdfItem('Aktivitäten', labels.join(', '), eqGrid);
    page.appendChild(eqGrid);
  }

  const weekdays = Array.isArray(rt.noSportWeekdays) ? rt.noSportWeekdays : [];
  if (weekdays.length || rt.praeferenzen || rt.verletzungen) {
    pdfSection(page, 'Wöchentliche Routinen');
    const rGrid = document.createElement('div');
    rGrid.className = 'pdf-profile-grid full-col';
    if (weekdays.length) {
      const wdLabel = weekdays.map(v => WEEKDAY_LABELS[v] || v).join(', ') + (rt.biweekly ? ' (bi-weekly)' : '');
      pdfItem('Sport nicht möglich', wdLabel, rGrid);
    }
    if (rt.praeferenzen) pdfItem('Präferenzen', rt.praeferenzen, rGrid);
    if (rt.verletzungen) pdfItem('Verletzungen', rt.verletzungen, rGrid);
    page.appendChild(rGrid);
  }

  return page;
}

function buildPdfPage2Overview(plan) {
  const page = document.createElement('section');
  page.className = 'pdf-page';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'pdf-eyebrow';
  eyebrow.textContent = '02 — Kurzfassung Trainingsplan';
  page.appendChild(eyebrow);

  const h1 = document.createElement('h1');
  h1.textContent = 'Trainingsplan im Überblick';
  page.appendChild(h1);

  const sub = document.createElement('div');
  sub.className = 'pdf-subtitle';
  sub.textContent = plan?.phaseName || 'Aufbau bis zum Trip — Phasen & Schwerpunkte je Woche';
  page.appendChild(sub);

  const weeks = plan?.weeks || [];
  if (!weeks.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Trainingsplan wird erstellt.';
    page.appendChild(empty);
    return page;
  }

  const list = document.createElement('div');
  list.className = 'pdf-plan-list';
  weeks.forEach((w, i) => {
    const row = document.createElement('div');
    row.className = 'pdf-plan-row';

    const num = document.createElement('div');
    num.className = 'pdf-plan-week-num';
    num.textContent = 'W' + (i + 1);
    row.appendChild(num);

    const info = document.createElement('div');
    info.className = 'pdf-plan-week-info';
    const phaseLine = document.createElement('div');
    phaseLine.className = 'pdf-plan-phase-line';
    const phase = document.createElement('span');
    phase.className = 'pdf-plan-phase';
    phase.textContent = w.phase || '';
    phaseLine.appendChild(phase);
    const dates = document.createElement('span');
    dates.className = 'pdf-plan-dates';
    dates.textContent = w.dateRange || '';
    phaseLine.appendChild(dates);
    info.appendChild(phaseLine);

    const goal = document.createElement('div');
    goal.className = 'pdf-plan-goal';
    goal.textContent = w.goal || '';
    info.appendChild(goal);

    const cats = document.createElement('div');
    cats.className = 'pdf-plan-cats';
    uniqueCategoriesFromWeek(w).forEach(c => {
      const badge = document.createElement('span');
      badge.className = 'category-badge ' + c;
      badge.textContent = CATEGORY_LABELS[c] || c;
      cats.appendChild(badge);
    });
    info.appendChild(cats);

    row.appendChild(info);
    list.appendChild(row);
  });
  page.appendChild(list);
  return page;
}

function buildPdfPhaseStrip(weeks, currentIdx) {
  const strip = document.createElement('div');
  strip.className = 'pdf-phase-strip';
  weeks.forEach((w, i) => {
    const tab = document.createElement('div');
    tab.className = 'pdf-phase-tab' + (i === currentIdx ? ' current' : '');
    const num = document.createElement('div');
    num.className = 'pdf-phase-num';
    num.textContent = 'W' + (i + 1) + (w.dateRange ? ' · ' + w.dateRange : '');
    const name = document.createElement('div');
    name.className = 'pdf-phase-name';
    name.textContent = w.phase || '';
    tab.appendChild(num);
    tab.appendChild(name);
    strip.appendChild(tab);
  });
  return strip;
}

function buildPdfWeekContent(week, weekIdx) {
  const wrapper = document.createElement('div');

  const header = document.createElement('div');
  header.className = 'pdf-week-header';
  const eyebrow = document.createElement('div');
  eyebrow.className = 'pdf-week-eyebrow';
  eyebrow.textContent = `Woche ${weekIdx + 1}` + (week.dateRange ? ` · ${week.dateRange}` : '');
  header.appendChild(eyebrow);
  const goal = document.createElement('div');
  goal.className = 'pdf-week-goal';
  goal.textContent = week.goal || '';
  header.appendChild(goal);
  wrapper.appendChild(header);

  const table = document.createElement('table');
  table.className = 'pdf-day-table';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Tag</th><th>Einheiten</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  (week.days || []).forEach((day, di) => {
    const tr = document.createElement('tr');
    const tdDate = document.createElement('td');
    tdDate.className = 'pdf-day-date';
    tdDate.textContent = day.date ? `${WEEKDAYS_FULL_DE[di]} ${day.date}` : WEEKDAYS_FULL_DE[di];
    tr.appendChild(tdDate);
    const tdCells = document.createElement('td');
    const cells = document.createElement('div');
    cells.className = 'pdf-day-cells';
    const units = day.units || [];
    if (!units.length) {
      const empty = document.createElement('div');
      empty.className = 'pdf-day-empty';
      empty.textContent = 'Frei';
      cells.appendChild(empty);
    } else {
      units.forEach(u => {
        const block = document.createElement('div');
        block.className = 'pdf-day-unit';

        const row = document.createElement('div');
        row.className = 'pdf-day-row';
        const badge = document.createElement('span');
        badge.className = 'category-badge ' + (u.category || '');
        badge.textContent = CATEGORY_LABELS[u.category] || u.category || '';
        const title = document.createElement('span');
        title.className = 'pdf-day-title';
        title.textContent = (u.completed ? '✓ ' : '') + (u.title || '(ohne Titel)');
        const dur = document.createElement('span');
        dur.className = 'pdf-day-duration';
        dur.textContent = u.duration ? `${u.duration} Min` : '';
        row.appendChild(badge);
        row.appendChild(title);
        row.appendChild(dur);
        block.appendChild(row);

        if (Array.isArray(u.detail) && u.detail.length) {
          const details = document.createElement('ul');
          details.className = 'pdf-day-details';
          u.detail.forEach(d => {
            const li = document.createElement('li');
            li.textContent = d;
            details.appendChild(li);
          });
          block.appendChild(details);
        }

        cells.appendChild(block);
      });
    }
    tdCells.appendChild(cells);
    tr.appendChild(tdCells);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrapper.appendChild(table);

  return wrapper;
}

function buildPdfPage3Detail(profile, plan) {
  const page = document.createElement('section');
  page.className = 'pdf-page';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'pdf-eyebrow';
  eyebrow.textContent = '03 — Detail Trainingsplan';
  page.appendChild(eyebrow);

  const name = profile?.personal?.name || (userId || 'Profil');

  const header = document.createElement('div');
  header.className = 'pdf-detail-header';
  const title = document.createElement('div');
  title.className = 'pdf-detail-goal-title';
  title.textContent = `Ziel: ${plan?.phaseName || 'Surf Trip'}`;
  header.appendChild(title);

  const meta = document.createElement('div');
  meta.className = 'pdf-detail-goal-meta';
  const userSpan = document.createElement('span');
  userSpan.textContent = `User: ${name}`;
  meta.appendChild(userSpan);
  const tripDate = profile?.goal?.tripDatum;
  if (tripDate) {
    const dateSpan = document.createElement('span');
    dateSpan.textContent = `Bis ${new Date(tripDate).toLocaleDateString('de-DE')}`;
    meta.appendChild(dateSpan);
  }
  header.appendChild(meta);

  const stats = planTripStats(plan);
  const bar = document.createElement('div');
  bar.className = 'pdf-detail-progress';
  const fill = document.createElement('div');
  fill.className = 'pdf-detail-progress-fill';
  fill.style.width = stats.pct + '%';
  bar.appendChild(fill);
  header.appendChild(bar);
  const label = document.createElement('div');
  label.className = 'pdf-detail-progress-label';
  label.textContent = stats.planned
    ? `${stats.pct} % Trip-Ready · ${stats.done} / ${stats.planned} Einheiten erledigt`
    : 'Noch keine Einheiten geplant';
  header.appendChild(label);
  page.appendChild(header);

  const weeks = plan?.weeks || [];
  page.appendChild(buildPdfPhaseStrip(weeks, 0));

  if (weeks[0]) page.appendChild(buildPdfWeekContent(weeks[0], 0));
  return page;
}

function buildPdfPageWeek(week, weekIdx, allWeeks) {
  const page = document.createElement('section');
  page.className = 'pdf-page';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'pdf-eyebrow';
  eyebrow.textContent = `Detail Trainingsplan · Woche ${weekIdx + 1}`;
  page.appendChild(eyebrow);

  page.appendChild(buildPdfPhaseStrip(allWeeks, weekIdx));
  page.appendChild(buildPdfWeekContent(week, weekIdx));
  return page;
}

function buildPdfPrintRoot(profile, plan) {
  const root = document.getElementById('pdf-print-root');
  if (!root) return;
  root.innerHTML = '';

  root.appendChild(buildPdfPage1Profile(profile || {}));
  root.appendChild(buildPdfPage2Overview(plan || {}));

  const weeks = plan?.weeks || [];
  if (weeks.length) {
    root.appendChild(buildPdfPage3Detail(profile || {}, plan));
    for (let i = 1; i < weeks.length; i++) {
      root.appendChild(buildPdfPageWeek(weeks[i], i, weeks));
    }
  }
}

function applyPdfChanges(base, snapshots) {
  const out = JSON.parse(JSON.stringify(base));
  const sorted = [...snapshots].sort((a, b) =>
    (a?.meta?.version || '').localeCompare(b?.meta?.version || ''));
  for (const file of sorted) {
    if (!Array.isArray(file.changes)) continue;
    for (const ch of file.changes) {
      const m = String(ch.unitId || '').match(/^w(\d+)-d(\d+)-u(\d+)$/);
      if (!m) continue;
      const weekIdx = +m[1], dayIdx = +m[2], unitIdx = +m[3];
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
      else if (ch.field === 'completed') unit.completed = !!ch.to;
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

async function fetchUserPlanMerged() {
  if (!userId) return null;
  let base;
  try {
    const res = await fetch(userPlanPath(userId), { cache: 'no-store' });
    if (!res.ok) return null;
    base = await res.json();
  } catch { return null; }
  if (!base?.weeks) return null;

  let snapshotFiles = [];
  try {
    const listRes = await fetch(`${userBasePath(userId)}/changes/_list`, { cache: 'no-store' });
    if (listRes.ok) {
      const entries = await listRes.json();
      snapshotFiles = entries.filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
    }
  } catch {}

  const snapshots = [];
  for (const name of snapshotFiles) {
    try {
      const r = await fetch(`${userBasePath(userId)}/changes/${name}`, { cache: 'no-store' });
      if (r.ok) snapshots.push(await r.json());
    } catch {}
  }

  const merged = applyPdfChanges(base, snapshots);
  return {
    phaseName: base?.meta?.phaseName || base?.phaseName || '',
    weeks: merged.weeks || [],
  };
}

async function exportPDF() {
  try {
    const profile = profileCache !== null ? profileCache : await loadProfile();
    const plan = await fetchUserPlanMerged();
    buildPdfPrintRoot(profile, plan);
    // Layout-Tick abwarten, dann Druckdialog öffnen
    await new Promise(r => setTimeout(r, 50));
    window.print();
  } catch (err) {
    console.warn('PDF-Export fehlgeschlagen:', err);
    alert(`PDF-Export fehlgeschlagen: ${err.message}`);
  }
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

function showProgress(message) {
  let el = document.getElementById('progress-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'progress-overlay';
    el.className = 'progress-overlay';
    el.innerHTML = '<div class="progress-card"><div class="spinner"></div><div class="progress-text"></div></div>';
    document.body.appendChild(el);
  }
  el.querySelector('.progress-text').textContent = message;
  el.hidden = false;
}
function hideProgress() {
  const el = document.getElementById('progress-overlay');
  if (el) el.hidden = true;
}

async function handleNewUserSubmit(profile) {
  const name = profile?.personal?.name?.trim();
  if (!name) { alert('Bitte gib einen Namen ein.'); return false; }
  const newId = slugifyName(name);
  if (!newId) { alert('Name enthält keine gültigen Zeichen.'); return false; }
  const existing = await listUsers();
  if (existing.includes(newId)) {
    const overwrite = confirm(`User '${newId}' existiert bereits. Profil und Plan überschreiben?`);
    if (!overwrite) return false;
  }
  showProgress(`Profil wird gespeichert …`);
  try {
    await saveProfileForUser(newId, profile);
  } catch (err) {
    hideProgress();
    alert(`Profil speichern fehlgeschlagen: ${err.message}`);
    return false;
  }
  showProgress(`Claude generiert deinen Plan – das kann 30–60 Sekunden dauern …`);
  let plan;
  try {
    plan = await generatePlanV1(profile);
  } catch (err) {
    hideProgress();
    alert(`Plan-Generierung fehlgeschlagen: ${err.message}\n\nProfil wurde gespeichert. Du kannst den Plan später manuell anlegen oder den .env-Key prüfen.`);
    return false;
  }
  showProgress(`Plan wird gespeichert …`);
  try {
    await savePlanForUser(newId, plan);
  } catch (err) {
    hideProgress();
    alert(`Plan speichern fehlgeschlagen: ${err.message}`);
    return false;
  }
  try { localStorage.setItem(LAST_USER_KEY, newId); } catch {}
  hideProgress();
  window.location.href = `../../index.html?user=${encodeURIComponent(newId)}`;
  return true;
}

async function handleExistingUserSubmit(profile) {
  const ok = await saveProfile(profile);
  renderGoals();
  if (ok) await enterViewMode();
  return ok;
}

async function handleDeleteUser() {
  if (!userId) return;
  if (!confirm(`User '${userId}' und Plan werden unwiderruflich gelöscht.`)) return;
  try {
    await deleteUser(userId);
    try { localStorage.removeItem(LAST_USER_KEY); } catch {}
    window.location.href = '../../index.html';
  } catch (err) {
    alert(`Löschen fehlgeschlagen: ${err.message}`);
  }
}

function initButtons() {
  const submitBtn = document.getElementById('btn-submit');
  if (submitBtn) submitBtn.addEventListener('click', async () => {
    const profile = collectProfile();
    if (isNewUserFlow) {
      await handleNewUserSubmit(profile);
    } else {
      await handleExistingUserSubmit(profile);
    }
  });

  const editBtn = document.getElementById('btn-edit');
  if (editBtn) editBtn.addEventListener('click', enterEditMode);

  const exportBtn = document.getElementById('btn-export');
  if (exportBtn) exportBtn.addEventListener('click', () => exportJSON(collectProfile()));

  const exportViewBtn = document.getElementById('btn-export-view');
  if (exportViewBtn) exportViewBtn.addEventListener('click', async () => {
    const p = (await loadProfile()) || collectProfile();
    exportJSON(p);
  });

  const exportPdfBtn = document.getElementById('btn-export-pdf');
  if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportPDF);

  const deleteBtn = document.getElementById('btn-delete-user');
  if (deleteBtn) deleteBtn.addEventListener('click', handleDeleteUser);
}

document.addEventListener('DOMContentLoaded', async () => {
  initSliders();
  initLevelButtons();
  initChipGroups();
  initGarminToggle();
  initButtons();

  // Submit-Button-Label je nach Flow setzen
  const submitBtn = document.getElementById('btn-submit');
  if (submitBtn) submitBtn.textContent = isNewUserFlow
    ? 'Profil & Plan anlegen'
    : 'Profil speichern';

  // Header-Eyebrow je nach Flow
  const eyebrow = document.querySelector('.header-eyebrow');
  if (eyebrow && isNewUserFlow) {
    eyebrow.innerHTML = '<a href="../../index.html">← Zurück</a> · Neues Profil';
  } else if (eyebrow && userId) {
    eyebrow.innerHTML = `<a href="../../index.html?user=${encodeURIComponent(userId)}">← Zurück zum Plan</a> · User: <strong>${userId}</strong>`;
  }

  if (isNewUserFlow) {
    enterEditMode();
  } else {
    const saved = await loadProfile();
    if (saved) {
      restoreForm(saved);
      await enterViewMode();
    } else {
      enterEditMode();
    }
  }

  renderGoals();
  renderPlan();
});
