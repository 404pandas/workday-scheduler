/* ============================================================
   THE WITCHER'S CONTRACT BOARD — Kaer Morhen Daily Ledger
   Vanilla JS · No dependencies · localStorage · Web Audio API
   ============================================================ */

'use strict';

// ── Constants ────────────────────────────────────────────────

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM – 11 PM

const HOUR_LORE = {
  6:  { lore: "Dawn's Stirring",    desc: "The Continent awakens" },
  7:  { lore: "First Light",         desc: "A witcher sharpens his blades" },
  8:  { lore: "Morning Bell",        desc: "The city gates open" },
  9:  { lore: "Merchant's Hour",     desc: "Trade begins in earnest" },
  10: { lore: "Sun's Climb",         desc: "Scouts report from the field" },
  11: { lore: "High Morning",        desc: "The Nilfgaard riders pass" },
  12: { lore: "Midday Sun",          desc: "Rest at the crossroads inn" },
  13: { lore: "Afternoon Watch",     desc: "The temple bell tolls once" },
  14: { lore: "Sun's Peak",          desc: "Merchants count their coin" },
  15: { lore: "Waning Sun",          desc: "The alchemist tends potions" },
  16: { lore: "Dusk's Approach",     desc: "Monsters begin to stir" },
  17: { lore: "Evening Bell",        desc: "The city gates close" },
  18: { lore: "Twilight's Edge",     desc: "The White Wolf prepares" },
  19: { lore: "First Dark",          desc: "Danger lurks in shadows" },
  20: { lore: "Night's Veil",        desc: "Only witchers walk these roads" },
  21: { lore: "Witching Hour",       desc: "Magic is strongest now" },
  22: { lore: "Midnight's Approach", desc: "The Hunt rides across the sky" },
  23: { lore: "Deep Night",          desc: "Even monsters sleep" },
};

const CATEGORIES = [
  { id: 'contract',  label: 'Contract',  color: '#c9a227' },
  { id: 'alchemy',   label: 'Alchemy',   color: '#9c27b0' },
  { id: 'travel',    label: 'Travel',    color: '#4fc3f7' },
  { id: 'training',  label: 'Training',  color: '#e84d10' },
  { id: 'diplomacy', label: 'Diplomacy', color: '#2e8b57' },
  { id: 'research',  label: 'Research',  color: '#b8941f' },
  { id: 'leisure',   label: 'Leisure',   color: '#d2691e' },
];

const PRIORITIES = [
  { id: 'igni',  abbr: 'IGN', label: 'Igni — Critical',  color: '#e84d10', orens: 50 },
  { id: 'aard',  abbr: 'ARD', label: 'Aard — High',      color: '#4fc3f7', orens: 30 },
  { id: 'quen',  abbr: 'QEN', label: 'Quen — Medium',    color: '#f5c518', orens: 20 },
  { id: 'yrden', abbr: 'YRD', label: 'Yrden — Low',      color: '#9c27b0', orens: 10 },
  { id: 'axii',  abbr: 'AXI', label: 'Axii — Optional',  color: '#26a69a', orens:  5 },
];

const PLACEHOLDERS = [
  "Hunt the nekker nest near Oxenfurt...",
  "Brew a Swallow potion before dusk...",
  "Meet the spymaster at the Rosemary & Thyme...",
  "Sharpen the silver sword before nightfall...",
  "Collect payment from the village elder...",
  "Research the curse afflicting the baron's wife...",
  "Meditate and replenish Signs...",
  "Inspect the abandoned watchtower on the hill...",
  "Negotiate passage through Novigrad...",
  "Gather mandrake root and wolfsbane...",
  "Track the leshen to its lair in Velen...",
  "Deliver the letter to Triss Merigold...",
  "Repair the silver armor before the next hunt...",
  "Study the Elder Speech inscription on the ruins...",
  "Challenge the local champion at Gwent...",
  "Find lodging before the blizzard reaches Kaer Morhen...",
  "Prepare the decoctions for the vampire contract...",
  "Scout the road to Vizima for ambushes...",
];

const GERALT_QUOTES = [
  { text: "Evil is evil. Lesser, greater, middling — it's all the same.", speaker: "Geralt of Rivia" },
  { text: "If I'm to choose between one evil and another, I'd rather not choose at all.", speaker: "Geralt of Rivia" },
  { text: "People like to invent monsters and monstrosities. Then they seem less monstrous themselves.", speaker: "Geralt of Rivia" },
  { text: "Not all that glitters is silver. Not all that's dangerous is a monster.", speaker: "Geralt of Rivia" },
  { text: "Hmm.", speaker: "Geralt of Rivia, a man of few words" },
  { text: "Wind's howling.", speaker: "Geralt of Rivia" },
  { text: "Mistakes are also important to me. I don't cross them out of my life, or memory.", speaker: "Geralt of Rivia" },
  { text: "Sometimes there is no good choice. There is only the lesser evil.", speaker: "Geralt of Rivia" },
  { text: "I'm a witcher. I'm in the business of removing threats, not making moral judgements.", speaker: "Geralt of Rivia" },
  { text: "Destiny... is it a trap or a gift?", speaker: "Geralt of Rivia" },
  { text: "A grain of truth can be found in every legend.", speaker: "Geralt of Rivia" },
  { text: "The sword of destiny has two edges. You are one of them.", speaker: "Geralt of Rivia, to Ciri" },
  { text: "Adventures? Monsters? Sorcerers? No. Toss a coin to your witcher.", speaker: "Jaskier" },
  { text: "They made me a killer, but they could not make me a murderer.", speaker: "Geralt of Rivia" },
  { text: "I'm used to doing things I shouldn't.", speaker: "Geralt of Rivia" },
  { text: "Magic is chaos, art, and science. It is a curse, a blessing, and progress.", speaker: "Yennefer of Vengerberg" },
  { text: "People of the Continent — they're afraid of what they don't understand.", speaker: "Ciri" },
  { text: "Stay out of trouble. And if you can't, at least stay out of my way.", speaker: "Geralt of Rivia" },
  { text: "Witchers are men, not monsters. We're just... different.", speaker: "Vesemir" },
  { text: "The worst monsters are those that appear human.", speaker: "Geralt of Rivia" },
];

const MOON_PHASES = [
  { name: 'New Moon',         days: [0,   1]    },
  { name: 'Waxing Crescent',  days: [1,   7.4]  },
  { name: 'First Quarter',    days: [7.4, 8.4]  },
  { name: 'Waxing Gibbous',   days: [8.4, 14.8] },
  { name: 'Full Moon',        days: [14.8,15.8] },
  { name: 'Waning Gibbous',   days: [15.8,22.1] },
  { name: 'Last Quarter',     days: [22.1,23.1] },
  { name: 'Waning Crescent',  days: [23.1,29.5] },
];

const STORAGE_KEY = 'witcher_contracts_v3';
const MAX_CHARS   = 500;
const MAX_ITEMS   = 10;

// ── State ────────────────────────────────────────────────────
//
// state.contracts = {
//   "h8": [
//     { id, text, category, priority, saved, completed, orens },
//     ...
//   ]
// }

let state = {
  contracts:  {},
  orens:      0,
  signsCast:  0,
  soundEnabled: false,
  quoteIndex: 0,
};

let _idCounter = 0;
function newId() { return `c_${Date.now()}_${++_idCounter}`; }

// ── Storage ──────────────────────────────────────────────────

const Store = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved  = JSON.parse(raw);
      state.contracts = saved.contracts || {};
      state.orens     = saved.orens     || 0;
      state.signsCast = saved.signsCast || 0;
    } catch (_e) {
      console.warn('Witcher Board: failed to load state');
    }
  },
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        contracts: state.contracts,
        orens:     state.orens,
        signsCast: state.signsCast,
      }));
    } catch (_e) {
      console.warn('Witcher Board: failed to save state');
    }
  },
};

// ── Hour helpers ─────────────────────────────────────────────

function hKey(h) { return `h${h}`; }

function getItems(h) {
  const v = state.contracts[hKey(h)];
  return Array.isArray(v) ? v : [];
}

function setItems(h, items) {
  if (items.length === 0) {
    delete state.contracts[hKey(h)];
  } else {
    state.contracts[hKey(h)] = items;
  }
}

function fmt12(h) {
  if (h === 0 || h === 24) return '12 AM';
  if (h === 12)            return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function getTimeStatus(h) {
  const now = new Date().getHours();
  if (h < now)  return 'past';
  if (h === now) return 'present';
  return 'future';
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ── Audio ────────────────────────────────────────────────────

const Audio = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || /** @type {any} */ (window).webkitAudioContext)();
    return ctx;
  }
  function tone(freq, type, dur, gain = 0.22) {
    if (!state.soundEnabled) return;
    try {
      const ac  = getCtx();
      const osc = ac.createOscillator();
      const env = ac.createGain();
      osc.connect(env);
      env.connect(ac.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      env.gain.setValueAtTime(gain, ac.currentTime);
      env.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + dur);
    } catch (_e) { /* silent */ }
  }
  return {
    save()    { tone(880,'sine',.6,.28); setTimeout(()=>tone(1320,'sine',.4,.14),80); setTimeout(()=>tone(660,'sine',.7,.07),175); },
    clear()   { tone(120,'triangle',.3,.28); },
    complete(){ [440,554,659,880].forEach((f,i)=>setTimeout(()=>tone(f,'sine',.32,.18),i*75)); },
    error()   { tone(180,'sawtooth',.22,.18); },
    notify()  { tone(660,'sine',.28,.11); },
  };
})();

// ── Particles ────────────────────────────────────────────────

class ParticleSystem {
  constructor(canvas) {
    this.canvas    = canvas;
    this.ctx       = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }
  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  spawn() {
    if (this.particles.length >= 50) return;
    const ember = Math.random() > 0.4;
    this.particles.push({
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.55,
      vy: -(Math.random() * 0.85 + 0.3),
      size: ember ? Math.random() * 2.5 + 0.5 : Math.random() * 1.5 + 0.4,
      maxAlpha: Math.random() * 0.6 + 0.2,
      life: 0,
      maxLife: Math.random() * 270 + 180,
      color: ember ? (Math.random() > 0.5 ? '#c9a227' : '#ff6600') : '#e8dcc8',
      pulse: Math.random() * Math.PI * 2,
      pSpd: Math.random() * 0.06 + 0.02,
      wob: Math.random() * 0.5,
      wSpd: Math.random() * 0.04 + 0.01,
    });
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (Math.random() < 0.08) this.spawn();
    this.particles = this.particles.filter(p => p.life < p.maxLife);
    for (const p of this.particles) {
      p.life++; p.pulse += p.pSpd; p.wob += p.wSpd;
      p.x += p.vx + Math.sin(p.wob) * 0.3;
      p.y += p.vy;
      const lr = p.life / p.maxLife;
      const alpha = lr < 0.15 ? (lr / 0.15) * p.maxAlpha
                  : lr > 0.75 ? ((1 - lr) / 0.25) * p.maxAlpha
                  : p.maxAlpha;
      const r = p.size * (1 + 0.35 * Math.sin(p.pulse));
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.shadowBlur  = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fillStyle   = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    requestAnimationFrame(() => this.animate());
  }
}

// ── Moon Phase ───────────────────────────────────────────────

function getMoonPhase() {
  const known     = new Date('2000-01-06T18:14:00Z');
  const cycle     = 29.530588853;
  const daysSince = (Date.now() - known.getTime()) / 86400000;
  const phase     = ((daysSince % cycle) + cycle) % cycle;
  return MOON_PHASES.find(p => phase >= p.days[0] && phase < p.days[1]) || MOON_PHASES[0];
}

// ── Toast ────────────────────────────────────────────────────

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast     = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  Audio.notify();
  setTimeout(() => {
    toast.style.pointerEvents = 'none';
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3500);
}

// ── Stats ────────────────────────────────────────────────────

function updateStats() {
  let active = 0, completed = 0;
  for (const key of Object.keys(state.contracts)) {
    const items = state.contracts[key];
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      if (item.saved && item.text) {
        if (item.completed) completed++;
        else active++;
      }
    }
  }
  bump('active-count',    active);
  bump('completed-count', completed);
  bump('orens-count',     state.orens);
  bump('signs-count',     state.signsCast);
}

function bump(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  if (parseInt(el.textContent, 10) !== val) {
    el.textContent = val;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }
}

// ── Quote ────────────────────────────────────────────────────

function renderQuote(idx) {
  const q    = GERALT_QUOTES[idx];
  const text = document.getElementById('geralt-quote');
  const cite = document.getElementById('quote-attribution');
  if (!text || !cite) return;
  text.style.opacity = '0';
  setTimeout(() => {
    text.textContent = q.text;
    cite.textContent = `— ${q.speaker}`;
    text.style.opacity = '1';
  }, 380);
}

function cycleQuote() {
  state.quoteIndex = (state.quoteIndex + 1) % GERALT_QUOTES.length;
  renderQuote(state.quoteIndex);
}

// ── Clock ────────────────────────────────────────────────────

function updateClock() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const el  = document.getElementById('clock-display');
  if (el) el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function updateHourColors() {
  HOURS.forEach(h => {
    const block = document.getElementById(`block-${h}`);
    if (!block) return;
    const s = getTimeStatus(h);
    block.className = block.className
      .replace(/\bpast\b|\bpresent\b|\bfuture\b/g, '')
      .trim()
      + ` ${s}`;
  });
}

// ── Board Construction ───────────────────────────────────────

function buildBoard() {
  const board = document.getElementById('contract-board');
  board.innerHTML = '';
  HOURS.forEach((h, i) => {
    const block = buildBlockShell(h, i);
    board.appendChild(block);
    renderPanel(h);
  });
}

function buildBlockShell(h, index) {
  const status = getTimeStatus(h);
  const lore   = HOUR_LORE[h] || { lore: fmt12(h), desc: '' };

  const block = document.createElement('div');
  block.className = `time-block ${status}`;
  block.id        = `block-${h}`;
  block.style.setProperty('--i', index);

  const label = document.createElement('div');
  label.className = 'hour-label-wrap';
  label.innerHTML = `
    <span class="hour-number">${fmt12(h)}</span>
    <span class="hour-lore">${lore.lore}</span>
    <span class="hour-desc">${lore.desc}</span>
    <span class="hour-item-count" id="count-${h}"></span>
  `;

  const panel = document.createElement('div');
  panel.className = 'contracts-panel';
  panel.id        = `panel-${h}`;

  block.append(label, panel);
  return block;
}

// ── Panel Renderer ───────────────────────────────────────────
// Called any time items for an hour need refreshing.

function renderPanel(h) {
  const panel = document.getElementById(`panel-${h}`);
  if (!panel) return;
  panel.innerHTML = '';

  const items = getItems(h);

  items.forEach(item => {
    panel.appendChild(buildItemEl(h, item));
  });

  // Add contract button (hidden at max)
  if (items.length < MAX_ITEMS) {
    const addBtn = document.createElement('button');
    addBtn.className   = 'add-item-btn';
    addBtn.textContent = `+ Add Contract${items.length > 0 ? '' : ' to this hour'}`;
    addBtn.addEventListener('click', () => addItem(h));
    panel.appendChild(addBtn);
  }

  updateItemCount(h, items);
}

function updateItemCount(h, items) {
  const el = document.getElementById(`count-${h}`);
  if (!el) return;
  const n = items.filter(i => i.text).length;
  if (n > 0) {
    el.textContent = `${n} contract${n === 1 ? '' : 's'}`;
    el.classList.add('visible');
  } else {
    el.textContent = '';
    el.classList.remove('visible');
  }
}

// ── Build a Single Item Element ───────────────────────────────

function buildItemEl(h, item) {
  const pri = PRIORITIES.find(p => p.id === item.priority) || PRIORITIES[2];
  const placeholderIdx = (h * 3 + getItems(h).indexOf(item)) % PLACEHOLDERS.length;

  const el = document.createElement('div');
  el.className  = `contract-item pri-${item.priority || 'quen'}${item.completed ? ' completed' : ''}`;
  el.dataset.id = item.id;

  // ── Controls row ─────────────────────────────────
  const controls = document.createElement('div');
  controls.className = 'item-controls';

  // Category select
  const catSel = document.createElement('select');
  catSel.className = 'item-select';
  catSel.setAttribute('aria-label', 'Category');
  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.label;
    if (item.category === cat.id) opt.selected = true;
    catSel.appendChild(opt);
  });
  catSel.addEventListener('change', () => {
    mutateItem(h, item.id, { category: catSel.value });
  });

  // Priority select
  const priSel = document.createElement('select');
  priSel.className = 'item-select';
  priSel.setAttribute('aria-label', 'Priority');
  PRIORITIES.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.abbr} — ${p.label.split('—')[1].trim()}`;
    if (item.priority === p.id) opt.selected = true;
    priSel.appendChild(opt);
  });

  // Priority badge (syncs with select)
  const badge = document.createElement('span');
  badge.className   = `item-priority-badge pri-${item.priority || 'quen'}`;
  badge.textContent = pri.abbr;

  priSel.addEventListener('change', () => {
    const newPri = PRIORITIES.find(p => p.id === priSel.value) || PRIORITIES[2];
    badge.className   = `item-priority-badge pri-${newPri.id}`;
    badge.textContent = newPri.abbr;
    el.className      = `contract-item pri-${newPri.id}${item.completed ? ' completed' : ''}`;
    mutateItem(h, item.id, { priority: newPri.id });
  });

  // Spacer + delete
  const spacer = document.createElement('span');
  spacer.className = 'item-spacer';

  const delBtn = document.createElement('button');
  delBtn.className   = 'item-delete-btn';
  delBtn.textContent = 'Remove';
  delBtn.title       = 'Remove this contract';
  delBtn.addEventListener('click', () => deleteItem(h, item.id));

  controls.append(catSel, priSel, badge, spacer, delBtn);

  // ── Textarea ─────────────────────────────────────
  const textarea = document.createElement('textarea');
  textarea.className   = 'contract-textarea';
  textarea.placeholder = PLACEHOLDERS[placeholderIdx];
  textarea.maxLength   = MAX_CHARS;
  textarea.value       = item.text || '';
  textarea.setAttribute('aria-label', `Contract detail for ${fmt12(h)}`);

  textarea.addEventListener('input', () => {
    updateCharCount(charCount, textarea.value.length);
    autoResize(textarea);
    // Live-persist draft (unsaved) text so it survives a page refresh
    mutateItem(h, item.id, { text: textarea.value });
  });

  textarea.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      saveItem(h, item.id);
    }
  });

  autoResize(textarea);

  // ── Footer row ───────────────────────────────────
  const footer = document.createElement('div');
  footer.className = 'item-footer';

  const charCount = document.createElement('span');
  charCount.className = 'char-count';
  updateCharCount(charCount, (item.text || '').length);

  const completeBtn = document.createElement('button');
  completeBtn.className = `item-btn complete-btn${item.completed ? ' is-done' : ''}`;
  completeBtn.textContent = item.completed ? 'Done  ●' : 'Mark Done  ○';
  completeBtn.title       = 'Toggle completion';
  completeBtn.addEventListener('click', () => toggleComplete(h, item.id));

  const saveBtn = document.createElement('button');
  saveBtn.className   = `item-btn save-btn${item.saved ? ' is-saved' : ''}`;
  saveBtn.textContent = item.saved ? 'Sealed  ✦' : 'Sign Contract';
  saveBtn.title       = 'Save this contract  (Ctrl + Enter)';
  saveBtn.addEventListener('click', () => saveItem(h, item.id));

  footer.append(charCount, completeBtn, saveBtn);
  el.append(controls, textarea, footer);
  return el;
}

// ── Mutate an item in state without full re-render ───────────

function mutateItem(h, itemId, changes) {
  const items = getItems(h);
  const item  = items.find(i => i.id === itemId);
  if (!item) return;
  Object.assign(item, changes);
  setItems(h, items);
  Store.save();
}

// ── Add / Delete / Save / Complete ──────────────────────────

function addItem(h) {
  const items = getItems(h);
  if (items.length >= MAX_ITEMS) {
    showToast(`Maximum ${MAX_ITEMS} contracts per hour.`, 'warning');
    return;
  }
  items.push({
    id:        newId(),
    text:      '',
    category:  'contract',
    priority:  'quen',
    saved:     false,
    completed: false,
    orens:     0,
  });
  setItems(h, items);
  Store.save();
  renderPanel(h);
  // Focus the new textarea
  const panel = document.getElementById(`panel-${h}`);
  const textareas = panel.querySelectorAll('.contract-textarea');
  textareas[textareas.length - 1]?.focus();
}

function deleteItem(h, itemId) {
  const items   = getItems(h);
  const item    = items.find(i => i.id === itemId);
  if (!item) return;

  if (item.saved) {
    state.orens     = Math.max(0, state.orens - (item.orens || 0));
    state.signsCast = Math.max(0, state.signsCast - 1);
  }

  setItems(h, items.filter(i => i.id !== itemId));
  Store.save();
  renderPanel(h);
  updateStats();
  Audio.clear();
  if (item.text) showToast('Contract removed from the ledger.', 'danger');
}

function saveItem(h, itemId) {
  const items = getItems(h);
  const item  = items.find(i => i.id === itemId);
  if (!item) return;

  // Read current textarea value directly
  const panel    = document.getElementById(`panel-${h}`);
  const itemEl   = panel?.querySelector(`[data-id="${itemId}"]`);
  const textarea = itemEl?.querySelector('.contract-textarea');
  const text     = (textarea ? textarea.value : item.text).trim();

  if (!text) {
    showToast('Write a contract before sealing it, Witcher.', 'warning');
    Audio.error();
    textarea?.focus();
    return;
  }

  const pri          = PRIORITIES.find(p => p.id === item.priority) || PRIORITIES[2];
  const wasAlready   = item.saved;
  const orensEarned  = wasAlready ? 0 : pri.orens;

  item.text       = text;
  item.saved      = true;
  item.orens      = pri.orens;
  item.completedAt = item.completed ? item.completedAt : undefined;

  state.orens     += orensEarned;
  state.signsCast += wasAlready ? 0 : 1;

  setItems(h, items);
  Store.save();
  updateStats();
  Audio.save();

  // Update just the save button without a full re-render
  if (itemEl) {
    const saveBtn = itemEl.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.textContent = 'Sealed  ✦';
      saveBtn.classList.add('is-saved');
    }
  }

  showToast(
    wasAlready
      ? 'Contract updated.'
      : `Contract sealed — ${orensEarned} orens earned.`,
    'success'
  );

  if (!wasAlready && item.priority === 'igni') {
    setTimeout(() => showToast('Igni-level priority. Stay sharp, Witcher.', 'warning'), 700);
  }
}

function toggleComplete(h, itemId) {
  const items = getItems(h);
  const item  = items.find(i => i.id === itemId);
  if (!item) return;

  if (!item.saved) {
    showToast('Seal a contract before marking it complete.', 'info');
    return;
  }

  item.completed = !item.completed;
  setItems(h, items);
  Store.save();

  // Update UI without full re-render
  const panel  = document.getElementById(`panel-${h}`);
  const itemEl = panel?.querySelector(`[data-id="${itemId}"]`);
  if (itemEl) {
    itemEl.classList.toggle('completed', item.completed);
    const btn = itemEl.querySelector('.complete-btn');
    if (btn) {
      btn.textContent = item.completed ? 'Done  ●' : 'Mark Done  ○';
      btn.classList.toggle('is-done', item.completed);
    }
  }

  if (item.completed) {
    Audio.complete();
    showToast('Contract fulfilled. Another monster slain.', 'success');
  } else {
    showToast('Contract reopened.', 'info');
  }

  updateStats();
}

// ── Helpers ──────────────────────────────────────────────────

function updateCharCount(el, len) {
  el.textContent = `${len} / ${MAX_CHARS}`;
  el.className   = 'char-count' +
    (len >= MAX_CHARS        ? ' at-limit'   :
     len >= MAX_CHARS * 0.8  ? ' near-limit' : '');
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px';
}

// ── Purge Past Contracts ─────────────────────────────────────

function clearPastContracts() {
  const now = new Date().getHours();
  let cleared = 0;
  HOURS.forEach(h => {
    if (h >= now) return;
    const items = getItems(h);
    items.forEach(item => {
      if (item.saved) {
        state.orens     = Math.max(0, state.orens - (item.orens || 0));
        state.signsCast = Math.max(0, state.signsCast - 1);
      }
    });
    if (items.length > 0) cleared += items.length;
    setItems(h, []);
  });
  Store.save();
  buildBoard();
  updateStats();
  if (cleared > 0) {
    Audio.clear();
    showToast(`${cleared} past contract${cleared === 1 ? '' : 's'} purged from the ledger.`, 'danger');
  } else {
    showToast('No past contracts to purge.', 'info');
  }
}

// ── Filters ──────────────────────────────────────────────────

function applyFilters() {
  const priFilter = document.getElementById('priority-filter').value;
  const catFilter = document.getElementById('category-filter').value;

  HOURS.forEach(h => {
    const block = document.getElementById(`block-${h}`);
    if (!block) return;

    if (priFilter === 'all' && catFilter === 'all') {
      block.classList.remove('hidden');
      return;
    }

    const items = getItems(h);
    const match = items.some(item =>
      (priFilter === 'all' || item.priority === priFilter) &&
      (catFilter === 'all' || item.category === catFilter)
    );

    // Always show empty blocks when filtering so you can still add
    block.classList.toggle('hidden', !match && items.length > 0);
  });
}

// ── Demo Schedule ────────────────────────────────────────────

const DEMO_SCHEDULE = [
  { hour: 6, items: [
    { text: 'Meditate at dawn — review active contracts and set the day\'s priorities.', category: 'research',  priority: 'yrden' },
  ]},
  { hour: 7, items: [
    { text: 'Sharpen the silver sword and apply Specter Oil before leaving Kaer Morhen.', category: 'training',  priority: 'quen' },
    { text: 'Brew a Swallow potion — stocks are low after the wraith hunt.',               category: 'alchemy',   priority: 'aard' },
  ]},
  { hour: 8, items: [
    { text: 'Meet the village elder of Mulbrydale regarding the drowner infestation near the mill.', category: 'diplomacy', priority: 'igni' },
  ]},
  { hour: 9, items: [
    { text: 'Investigate the mill ruins — track drowner trail to the river crossing.',   category: 'contract',  priority: 'aard' },
    { text: 'Collect overdue payment from the innkeeper at the Cunning Man.',             category: 'contract',  priority: 'quen' },
  ]},
  { hour: 10, items: [
    { text: 'Gather buckthorn and wyvern egg from the collapsed watchtower.',             category: 'alchemy',   priority: 'yrden' },
  ]},
  { hour: 11, items: [
    { text: 'Scout the abandoned mill for the leshen lair — approach from downwind.',     category: 'contract',  priority: 'igni' },
    { text: 'Map patrol routes of Nilfgaard soldiers near the crossroads.',               category: 'travel',    priority: 'aard' },
  ]},
  { hour: 12, items: [
    { text: 'Rest at the crossroads inn — gather rumors about the missing merchant caravan.', category: 'leisure', priority: 'axii' },
  ]},
  { hour: 13, items: [
    { text: 'Track the leshen to its lair in the heart of Velen forest. Do not engage without the correct decoctions.', category: 'contract', priority: 'igni' },
  ]},
  { hour: 14, items: [
    { text: 'Perform the ritual to sever the leshen\'s link to the village before striking.', category: 'research',  priority: 'quen' },
    { text: 'Administer Thunderbolt and Golden Oriole before entering the clearing.',     category: 'alchemy',   priority: 'aard' },
  ]},
  { hour: 15, items: [
    { text: 'Return to Mulbrydale with proof of the leshen kill. Demand the agreed 300 orens — no negotiating.', category: 'diplomacy', priority: 'quen' },
  ]},
  { hour: 16, items: [
    { text: 'Repair silver armor at the blacksmith — request the Nilfgaardian steel reinforcement.', category: 'training', priority: 'yrden' },
    { text: 'Purchase crossbow bolts, torches, and a new whetstone for the journey north.', category: 'travel',  priority: 'axii' },
  ]},
  { hour: 17, items: [
    { text: 'Study the Elder Speech inscription found in the ruins — cross-reference the bestiary.', category: 'research', priority: 'yrden' },
  ]},
  { hour: 18, items: [
    { text: 'Set Yrden traps near the old cemetery before the nightwraith emerges at dark.', category: 'contract', priority: 'igni' },
  ]},
  { hour: 19, items: [
    { text: 'Post-hunt wound treatment. Apply Swallow and inventory the trophies.', category: 'alchemy',  priority: 'aard' },
  ]},
  { hour: 20, items: [
    { text: 'Update the Kaer Morhen ledger — log all kills, earnings, and outstanding contracts.', category: 'research', priority: 'yrden' },
  ]},
];

function loadDemo() {
  const hasData = Object.values(state.contracts).some(
    arr => Array.isArray(arr) && arr.length > 0
  );

  if (hasData && !confirm('Loading the demo will replace your current contracts. Continue?')) return;

  const now = new Date().getHours();

  // Reset state
  state.contracts = {};
  state.orens     = 0;
  state.signsCast = 0;

  DEMO_SCHEDULE.forEach(({ hour, items }) => {
    const built = items.map(item => {
      const pri = PRIORITIES.find(p => p.id === item.priority) || PRIORITIES[2];
      return {
        id:        newId(),
        text:      item.text,
        category:  item.category,
        priority:  item.priority,
        saved:     true,
        completed: hour < now,   // auto-complete anything in the past
        orens:     pri.orens,
      };
    });

    setItems(hour, built);

    built.forEach(item => {
      state.orens     += item.orens;
      state.signsCast += 1;
    });
  });

  Store.save();
  buildBoard();
  updateStats();
  showToast('Demo schedule loaded. Welcome to Kaer Morhen.', 'success');
}

// ── Init ─────────────────────────────────────────────────────

function init() {
  Store.load();
  new ParticleSystem(document.getElementById('particle-canvas'));

  // Date
  const dateEl = document.getElementById('current-date');
  if (dateEl) dateEl.textContent = formatDate(new Date());

  // Moon phase
  const moon   = getMoonPhase();
  const moonEl = document.getElementById('moon-display');
  if (moonEl) moonEl.textContent = moon.name;

  // Clock
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(updateHourColors, 60_000);

  // Medallion click — spin + new quote
  document.getElementById('medallion-svg')?.addEventListener('click', () => {
    const svg = document.getElementById('medallion-svg');
    const deg = 360 + Math.random() * 360;
    svg.style.transition  = 'transform 0.85s cubic-bezier(0.34,1.56,0.64,1)';
    svg.style.transform   = `rotate(${deg}deg)`;
    setTimeout(() => { svg.style.transition = ''; svg.style.transform = ''; }, 950);
    cycleQuote();
  });

  // Initial random quote
  state.quoteIndex = Math.floor(Math.random() * GERALT_QUOTES.length);
  renderQuote(state.quoteIndex);
  setInterval(cycleQuote, 45_000);

  // Build the board
  buildBoard();
  updateStats();

  // Controls
  document.getElementById('demo-btn')?.addEventListener('click', loadDemo);

  document.getElementById('quote-btn')?.addEventListener('click', () => {
    cycleQuote();
    showToast('Geralt of Rivia speaks...', 'info');
  });

  document.getElementById('clear-past-btn')?.addEventListener('click', () => {
    if (confirm('Purge all contracts from past hours? This cannot be undone.')) {
      clearPastContracts();
    }
  });

  const soundBtn = document.getElementById('sound-btn');
  soundBtn?.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    soundBtn.textContent = state.soundEnabled ? 'Sound On' : 'Sound Off';
    soundBtn.classList.toggle('active', state.soundEnabled);
    if (state.soundEnabled) {
      Audio.notify();
      showToast('Sounds of Kaer Morhen enabled.', 'info');
    }
  });

  document.getElementById('priority-filter')?.addEventListener('change', applyFilters);
  document.getElementById('category-filter')?.addEventListener('change', applyFilters);

  // Alt+Q shortcut for new quote
  document.addEventListener('keydown', e => {
    if (e.altKey && e.key === 'q') cycleQuote();
  });

  console.log('%cThe Witcher\'s Contract Board', 'color:#c9a227;font-size:16px;font-weight:bold;');
  console.log('%cKaer Morhen Daily Ledger — Initialized', 'color:#9a8a6a;font-size:12px;');
}

document.addEventListener('DOMContentLoaded', init);
