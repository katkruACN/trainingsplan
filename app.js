const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const CATEGORY_LABELS = {
  yoga: 'Yoga / Mobility',
  rad: 'Rad / Cardio',
  paddeln: 'Paddeln',
  kraft: 'Kraft',
  schwimmen: 'Schwimmen',
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
  'Wer rastet, der rostet — aber nicht heute.',
  'Vertraue dem Prozess.',
  'Auch ein langer Weg beginnt mit einem Schritt.',
  'Showing up ist die halbe Miete.'
];

const NUM_WEEKS = 6;
const STORAGE_KEY = 'trainingsplan-v1';

function emptyDay() {
  return { category: null, title: '', description: '', duration: 0, completed: false };
}
function emptyWeek() {
  return { goal: '', days: Array.from({ length: 7 }, emptyDay) };
}
function emptyState() {
  return {
    phaseName: 'Meine Trainingsphase',
    weeks: Array.from({ length: NUM_WEEKS }, emptyWeek)
  };
}

function migrate(data) {
  if (!data || !Array.isArray(data.weeks)) return emptyState();
  const out = { phaseName: data.phaseName || 'Meine Trainingsphase', weeks: [] };
  for (let i = 0; i < NUM_WEEKS; i++) {
    const w = data.weeks[i] || emptyWeek();
    const week = { goal: w.goal || '', days: [] };
    for (let j = 0; j < 7; j++) {
      const d = (w.days && w.days[j]) || emptyDay();
      week.days.push({
        category: CATEGORY_LABELS[d.category] ? d.category : null,
        title: d.title || '',
        description: d.description || '',
        duration: Number(d.duration) || 0,
        completed: !!d.completed
      });
    }
    out.weeks.push(week);
  }
  return out;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return migrate(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
let currentWeek = 0;
let editingDay = null;
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
  return state.weeks.reduce((n, w) => n + w.days.filter(d => d.category).length, 0);
}
function totalCompleted() {
  return state.weeks.reduce((n, w) => n + w.days.filter(d => d.completed).length, 0);
}
function weekPlanned(idx) {
  return state.weeks[idx].days.filter(d => d.category).length;
}
function weekCompleted(idx) {
  return state.weeks[idx].days.filter(d => d.completed).length;
}

function render() {
  const phaseEl = document.querySelector('.phase-name');
  if (document.activeElement !== phaseEl && phaseEl.textContent !== state.phaseName) {
    phaseEl.textContent = state.phaseName;
  }

  const tabs = document.getElementById('week-tabs');
  tabs.innerHTML = '';
  for (let i = 0; i < NUM_WEEKS; i++) {
    const btn = document.createElement('button');
    btn.className = 'week-tab' + (i === currentWeek ? ' active' : '');
    const done = weekCompleted(i);
    const planned = weekPlanned(i);
    btn.textContent = `Woche ${i + 1}` + (planned ? `  ·  ${done}/${planned}` : '');
    btn.addEventListener('click', () => { currentWeek = i; render(); });
    tabs.appendChild(btn);
  }

  const goalInput = document.getElementById('week-goal');
  if (document.activeElement !== goalInput) {
    goalInput.value = state.weeks[currentWeek].goal;
  }

  const wp = document.getElementById('week-progress');
  const wDone = weekCompleted(currentWeek);
  const wPlan = weekPlanned(currentWeek);
  wp.textContent = wPlan
    ? `${wDone} / ${wPlan} Einheiten erledigt`
    : 'Noch keine Einheiten geplant';

  const grid = document.getElementById('days-grid');
  grid.innerHTML = '';
  state.weeks[currentWeek].days.forEach((day, idx) => grid.appendChild(renderDay(day, idx)));

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
  card.className = 'day-card' + (day.completed ? ' completed' : '');

  const header = document.createElement('div');
  header.className = 'day-header';
  const name = document.createElement('span');
  name.className = 'day-name';
  name.textContent = WEEKDAYS[idx];
  header.appendChild(name);
  if (day.category) {
    const edit = document.createElement('button');
    edit.className = 'edit-link';
    edit.type = 'button';
    edit.textContent = 'Bearbeiten';
    edit.addEventListener('click', () => openEdit(currentWeek, idx));
    header.appendChild(edit);
  }
  card.appendChild(header);

  if (!day.category) {
    const empty = document.createElement('button');
    empty.type = 'button';
    empty.className = 'day-empty';
    empty.textContent = '+ Einheit hinzufügen';
    empty.addEventListener('click', () => openEdit(currentWeek, idx));
    card.appendChild(empty);
    return card;
  }

  const badge = document.createElement('span');
  badge.className = 'category-badge ' + day.category;
  badge.textContent = CATEGORY_LABELS[day.category];
  card.appendChild(badge);

  const title = document.createElement('h3');
  title.className = 'day-title';
  title.textContent = day.title || '(ohne Titel)';
  card.appendChild(title);

  if (day.duration) {
    const dur = document.createElement('div');
    dur.className = 'day-duration';
    dur.textContent = `${day.duration} Minuten`;
    card.appendChild(dur);
  }

  if (day.description) {
    const desc = document.createElement('div');
    desc.className = 'day-description';
    desc.textContent = day.description;
    card.appendChild(desc);
  } else {
    const filler = document.createElement('div');
    filler.style.flex = '1';
    card.appendChild(filler);
  }

  const footer = document.createElement('div');
  footer.className = 'day-footer';
  const lbl = document.createElement('label');
  lbl.className = 'day-checkbox-label';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.className = 'day-checkbox';
  cb.checked = day.completed;
  cb.addEventListener('change', () => {
    state.weeks[currentWeek].days[idx].completed = cb.checked;
    saveState();
    if (cb.checked) rotateQuote();
    render();
  });
  lbl.appendChild(cb);
  lbl.appendChild(document.createTextNode('Erledigt'));
  footer.appendChild(lbl);
  card.appendChild(footer);

  return card;
}

function openEdit(weekIdx, dayIdx) {
  editingDay = { weekIdx, dayIdx };
  const day = state.weeks[weekIdx].days[dayIdx];
  const form = document.getElementById('edit-form');
  form.category.value = day.category || '';
  form.title.value = day.title || '';
  form.duration.value = day.duration || '';
  form.description.value = day.description || '';
  document.getElementById('edit-title').textContent = day.category
    ? `Einheit bearbeiten · ${WEEKDAYS[dayIdx]}`
    : `Einheit hinzufügen · ${WEEKDAYS[dayIdx]}`;
  document.getElementById('delete-btn').style.display = day.category ? 'inline-flex' : 'none';
  document.getElementById('edit-dialog').showModal();
  setTimeout(() => form.category.focus(), 0);
}

function setupDialog() {
  const dialog = document.getElementById('edit-dialog');
  const form = document.getElementById('edit-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!editingDay) return;
    const { weekIdx, dayIdx } = editingDay;
    const day = state.weeks[weekIdx].days[dayIdx];
    day.category = form.category.value || null;
    day.title = form.title.value.trim();
    day.duration = Number(form.duration.value) || 0;
    day.description = form.description.value.trim();
    saveState();
    dialog.close();
    render();
  });
  document.getElementById('cancel-btn').addEventListener('click', () => dialog.close());
  document.getElementById('delete-btn').addEventListener('click', () => {
    if (!editingDay) return;
    const { weekIdx, dayIdx } = editingDay;
    state.weeks[weekIdx].days[dayIdx] = emptyDay();
    saveState();
    dialog.close();
    render();
  });
}

function setupHeader() {
  const phaseEl = document.querySelector('.phase-name');
  phaseEl.addEventListener('blur', () => {
    const value = phaseEl.textContent.trim() || 'Meine Trainingsphase';
    phaseEl.textContent = value;
    state.phaseName = value;
    saveState();
  });
  phaseEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); phaseEl.blur(); }
  });

  document.getElementById('week-goal').addEventListener('input', (e) => {
    state.weeks[currentWeek].goal = e.target.value;
    saveState();
  });

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
