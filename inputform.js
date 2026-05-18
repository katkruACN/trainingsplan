/* ============================================
   SURF FITNESS INTAKE FORM — app.js
   localStorage key: trainingsplan-v2 (profile sub-key)
   ============================================ */

'use strict';

// ── Constants ──────────────────────────────────────────────────────────────

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

// ── Storage ────────────────────────────────────────────────────────────────

function loadStorage() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  } catch {
    return {};
  }
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

// ── Navigation ─────────────────────────────────────────────────────────────

function goToSection(num) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  const target = num === 'summary'
    ? document.getElementById('section-summary')
    : document.getElementById('section-' + num);
  if (target) target.classList.add('active');

  const totalSteps = 5;
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (num === 'summary') {
      s.classList.add('done');
    } else {
      if (i + 1 < num) s.classList.add('done');
      if (i + 1 === num) s.classList.add('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Sliders ────────────────────────────────────────────────────────────────

function updateSlider(input) {
  const key      = input.dataset.key;
  const category = input.dataset.category;
  const val      = parseInt(input.value, 10);
  const pct      = ((val - 1) / 4 * 100).toFixed(0);
  const color    = ACCENT_COLORS[category];

  input.style.background =
    `linear-gradient(to right, ${color} ${pct}%, ${color} ${pct}%, var(--border) ${pct}%)`;

  const valEl  = document.getElementById('val-' + key);
  const descEl = document.getElementById('desc-' + key);
  if (valEl)  valEl.textContent  = val;
  if (descEl) descEl.textContent = SCALE_DESCRIPTIONS[key][val] || '';
}

function initSliders() {
  document.querySelectorAll('input[type="range"][data-key]').forEach(input => {
    updateSlider(input);
    input.addEventListener('input', () => updateSlider(input));
  });
}

// ── Level Buttons ──────────────────────────────────────────────────────────

function initLevelButtons() {
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group    = btn.dataset.group;
      const section  = btn.closest('.section');
      // Determine accent class from section tag
      const tag      = section.querySelector('.section-tag');
      let accentClass = 'selected-personal';
      if (tag) {
        if (tag.classList.contains('tag-paddle'))   accentClass = 'selected-paddle';
        if (tag.classList.contains('tag-strength')) accentClass = 'selected-strength';
        if (tag.classList.contains('tag-mobility')) accentClass = 'selected-mobility';
      }
      document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
        b.className = 'level-btn';
      });
      btn.classList.add(accentClass);
    });
  });
}

// ── Garmin Toggle ──────────────────────────────────────────────────────────

function initGarminToggle() {
  const toggle = document.getElementById('garmin-toggle-paddle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const fields = document.getElementById('garmin-paddle');
    const sw     = document.getElementById('toggle-garmin-paddle');
    if (fields) fields.classList.toggle('visible');
    if (sw)     sw.classList.toggle('on');
  });
}

// ── Collect Form Data ──────────────────────────────────────────────────────

function collectProfile() {
  const get    = id => document.getElementById(id)?.value || '';
  const getNum = id => parseFloat(get(id)) || null;
  const getSelected = group => document.querySelector(`[data-group="${group}"][class*="selected"]`)?.dataset.value || null;
  const getScale = key => parseInt(document.getElementById('range-' + key)?.value || '1', 10);

  const alter = getNum('alter');

  return {
    personal: {
      name:             get('name'),
      alter,
      geschlecht:       get('geschlecht'),
      groesse:          getNum('groesse'),
      gewicht:          getNum('gewicht'),
      maxHF:            alter ? 220 - alter : null,
      trainingLevel:    getSelected('training'),
      surfLevel:        getSelected('surf'),
    },
    goal: {
      tripDatum:    get('trip-datum'),
      surfTage:     getNum('surf-tage'),
      surfStunden:  getNum('surf-stunden'),
    },
    paddlePower: {
      paddelausdauer: getScale('paddelausdauer'),
      okoerper:       getScale('okoerper'),
      cardio:         getScale('cardio'),
    },
    surfStrength: {
      popup:       getScale('popup'),
      stabilitaet: getScale('stabilitaet'),
    },
    stabilitaetBeweglichkeit: {
      beweglichkeit: getScale('beweglichkeit'),
      balance:       getScale('balance'),
    },
    garmin: {
      vo2max:       getNum('vo2max'),
      ruheHF:       getNum('ruhe-hf'),
      hrv:          getNum('hrv'),
      bodyBattery:  getNum('body-battery'),
      load:         getNum('load'),
      status:       get('garmin-status') || null,
    },
  };
}

// ── Summary Rendering ──────────────────────────────────────────────────────

function formatDate(str) {
  if (!str) return '–';
  return new Date(str).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function scoreItem(label, val, colorVar) {
  const pct = ((val - 1) / 4 * 100).toFixed(0);
  return `
    <div class="summary-item">
      <div class="summary-item-label">${label}</div>
      <div class="summary-item-value" style="color:${colorVar}">${val} / 5</div>
      <div class="score-bar-wrap">
        <div class="score-bar" style="width:${pct}%;background:${colorVar}"></div>
      </div>
    </div>`;
}

function renderSummary(p) {
  const { personal, goal, paddlePower, surfStrength, stabilitaetBeweglichkeit } = p;

  document.getElementById('summary-name').textContent =
    (personal.name ? personal.name + "'s" : 'Dein') + ' Surf-Profil';

  document.getElementById('summary-trip').textContent =
    `Trip: ${formatDate(goal.tripDatum)} · ${goal.surfTage || '–'} Tage · ${goal.surfStunden || '–'}h/Tag`;

  document.getElementById('summary-personal').innerHTML = `
    <div class="summary-item">
      <div class="summary-item-label">Alter / Größe / Gewicht</div>
      <div class="summary-item-value">${personal.alter || '–'} J · ${personal.groesse || '–'} cm · ${personal.gewicht || '–'} kg</div>
    </div>
    <div class="summary-item">
      <div class="summary-item-label">Max. Herzfrequenz</div>
      <div class="summary-item-value">${personal.maxHF || '–'} bpm</div>
    </div>
    <div class="summary-item">
      <div class="summary-item-label">Trainingserfahrung</div>
      <div class="summary-item-value" style="text-transform:capitalize">${personal.trainingLevel || '–'}</div>
    </div>
    <div class="summary-item">
      <div class="summary-item-label">Surf-Level</div>
      <div class="summary-item-value" style="text-transform:capitalize">${personal.surfLevel || '–'}</div>
    </div>`;

  document.getElementById('summary-paddle').innerHTML = `<div class="summary-grid">
    ${scoreItem('Paddelausdauer', paddlePower.paddelausdauer, 'var(--accent-paddle)')}
    ${scoreItem('Oberkörperkraft', paddlePower.okoerper,      'var(--accent-paddle)')}
    ${scoreItem('Cardio-Basis',   paddlePower.cardio,         'var(--accent-paddle)')}
  </div>`;

  document.getElementById('summary-strength').innerHTML = `<div class="summary-grid">
    ${scoreItem('Pop-up',                  surfStrength.popup,       'var(--accent-strength)')}
    ${scoreItem('Unterkörper-Stabilität',  surfStrength.stabilitaet, 'var(--accent-strength)')}
  </div>`;

  document.getElementById('summary-mobility').innerHTML = `<div class="summary-grid">
    ${scoreItem('Beweglichkeit',      stabilitaetBeweglichkeit.beweglichkeit, 'var(--accent-mobility)')}
    ${scoreItem('Körpergefühl / Balance', stabilitaetBeweglichkeit.balance,   'var(--accent-mobility)')}
  </div>`;
}

// ── JSON Export ────────────────────────────────────────────────────────────

function exportJSON(profile) {
  const json = JSON.stringify(profile, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'surf-profil.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ── Restore from localStorage ──────────────────────────────────────────────

function restoreForm(profile) {
  if (!profile) return;
  const { personal, goal, paddlePower, surfStrength, stabilitaetBeweglichkeit, garmin } = profile;

  const set    = (id, val) => { const el = document.getElementById(id); if (el && val !== null && val !== undefined) el.value = val; };
  const setScale = (key, val) => {
    const el = document.getElementById('range-' + key);
    if (el) { el.value = val; updateSlider(el); }
  };

  if (personal) {
    set('name',       personal.name);
    set('alter',      personal.alter);
    set('geschlecht', personal.geschlecht);
    set('groesse',    personal.groesse);
    set('gewicht',    personal.gewicht);
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
    set('trip-datum',    goal.tripDatum);
    set('surf-tage',     goal.surfTage);
    set('surf-stunden',  goal.surfStunden);
  }
  if (paddlePower) {
    setScale('paddelausdauer', paddlePower.paddelausdauer);
    setScale('okoerper',       paddlePower.okoerper);
    setScale('cardio',         paddlePower.cardio);
  }
  if (surfStrength) {
    setScale('popup',       surfStrength.popup);
    setScale('stabilitaet', surfStrength.stabilitaet);
  }
  if (stabilitaetBeweglichkeit) {
    setScale('beweglichkeit', stabilitaetBeweglichkeit.beweglichkeit);
    setScale('balance',       stabilitaetBeweglichkeit.balance);
  }
  if (garmin) {
    set('vo2max',        garmin.vo2max);
    set('ruhe-hf',       garmin.ruheHF);
    set('hrv',           garmin.hrv);
    set('body-battery',  garmin.bodyBattery);
    set('load',          garmin.load);
    set('garmin-status', garmin.status);
  }
}

// ── Wire Up Buttons ────────────────────────────────────────────────────────

function initNavButtons() {
  const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };

  bind('btn-1-next', () => goToSection(2));
  bind('btn-2-back', () => goToSection(1));
  bind('btn-2-next', () => goToSection(3));
  bind('btn-3-back', () => goToSection(2));
  bind('btn-3-next', () => goToSection(4));
  bind('btn-4-back', () => goToSection(3));
  bind('btn-4-next', () => goToSection(5));
  bind('btn-5-back', () => goToSection(4));

  bind('btn-submit', () => {
    const profile = collectProfile();
    saveProfile(profile);
    renderSummary(profile);
    goToSection('summary');
  });

  bind('btn-export', () => {
    const profile = collectProfile();
    exportJSON(profile);
  });

  bind('btn-reset', () => goToSection(1));
}

// ── Init ───────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initSliders();
  initLevelButtons();
  initGarminToggle();
  initNavButtons();

  // Restore saved profile if present
  const saved = loadProfile();
  if (saved) restoreForm(saved);
});
