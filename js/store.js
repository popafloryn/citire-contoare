/* Persistența datelor (localStorage), structura inițială și export/import JSON. */
(function (root) {
  'use strict';

  const KEY = 'citire-contoare';
  const UI_KEY = 'citire-contoare:ui';
  const SCHEMA_VERSION = 1;
  const SOURCES = ['autocitire', 'distribuitor', 'estimat'];

  function uid(prefix) {
    return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function emptyState() {
    return { schemaVersion: SCHEMA_VERSION, clients: [], meters: [], readings: [], tariffs: [], meta: { lastBackupAt: null, dirtySince: null } };
  }

  function makeMeter(state, clientId, type, fields = {}) {
    const { METER_TYPES, SUPPLIERS, WINDOWS, tariffsFor } = root.CC.defaults;
    const meter = {
      id: fields.id || uid('m'),
      clientId,
      type,
      name: fields.name || METER_TYPES[type].label,
      unit: METER_TYPES[type].unit,
      supplier: fields.supplier != null ? fields.supplier : SUPPLIERS[type],
      serial: fields.serial || '',
      clientCode: fields.clientCode || '',
      notes: fields.notes || '',
      window: fields.window ? { ...fields.window } : { ...WINDOWS[type] },
    };
    state.meters.push(meter);
    state.tariffs.push(...tariffsFor(type, meter.id, () => uid('t')));
    return meter;
  }

  // „Începe de la zero”: Eu (curent, gaz, apă) și Mama (gaz, curent), cu tarifele implicite.
  function starterState() {
    const state = emptyState();
    const me = { id: uid('c'), name: 'Eu' };
    const mom = { id: uid('c'), name: 'Mama' };
    state.clients.push(me, mom);
    for (const type of ['electricity', 'gas', 'water']) makeMeter(state, me.id, type);
    makeMeter(state, mom.id, 'gas', { window: { startDay: 20, endDay: 22 } });
    makeMeter(state, mom.id, 'electricity');
    return state;
  }

  const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
  const num = (x) => (x === '' || x == null || !Number.isFinite(Number(x)) ? null : Number(x));

  // Verifică și curăță un fișier importat (sau datele salvate). Aruncă Error cu mesaj pentru utilizator.
  function normalize(raw) {
    const { isValidIso } = root.CC.calc;
    if (!isObj(raw) || !Array.isArray(raw.clients) || !Array.isArray(raw.meters) || !Array.isArray(raw.readings)) {
      throw new Error('Fișierul nu conține date de citiri (lipsesc clienții, contoarele sau citirile).');
    }
    if (raw.schemaVersion > SCHEMA_VERSION) {
      throw new Error('Fișierul a fost creat de o versiune mai nouă a aplicației. Actualizează aplicația și încearcă din nou.');
    }
    const state = emptyState();
    const meta = isObj(raw.meta) ? raw.meta : {};
    state.meta = { lastBackupAt: meta.lastBackupAt || null, dirtySince: meta.dirtySince || null };
    state.clients = raw.clients.filter((c) => isObj(c) && c.id).map((c) => ({ id: String(c.id), name: String(c.name || 'Client') }));
    const clientIds = new Set(state.clients.map((c) => c.id));
    const types = root.CC.defaults.METER_TYPES;
    state.meters = raw.meters
      .filter((m) => isObj(m) && m.id && clientIds.has(m.clientId) && types[m.type])
      .map((m) => ({
        id: String(m.id), clientId: m.clientId, type: m.type,
        name: String(m.name || types[m.type].label), unit: types[m.type].unit,
        supplier: String(m.supplier || ''), serial: String(m.serial || ''),
        clientCode: String(m.clientCode || ''), notes: String(m.notes || ''),
        window: isObj(m.window) && m.window.startDay
          ? { startDay: Number(m.window.startDay), endDay: m.window.endDay === 'end' ? 'end' : Number(m.window.endDay) }
          : { ...root.CC.defaults.WINDOWS[m.type] },
      }));
    const meterIds = new Set(state.meters.map((m) => m.id));
    state.readings = raw.readings
      .filter((r) => isObj(r) && r.id && meterIds.has(r.meterId) && isValidIso(r.date))
      .map((r) => ({
        id: String(r.id), meterId: r.meterId, date: r.date,
        indexRead: num(r.indexRead), indexSubmitted: num(r.indexSubmitted),
        source: SOURCES.includes(r.source) ? r.source : 'autocitire',
        meterReset: !!r.meterReset, uncertain: !!r.uncertain,
        note: String(r.note || ''), updatedAt: r.updatedAt || null,
      }))
      .filter((r) => r.indexRead != null || r.indexSubmitted != null);
    state.tariffs = (Array.isArray(raw.tariffs) ? raw.tariffs : [])
      .filter((t) => isObj(t) && t.id && meterIds.has(t.meterId) && isValidIso(t.validFrom))
      .map((t) => ({
        id: String(t.id), meterId: t.meterId, validFrom: t.validFrom,
        conversionFactor: num(t.conversionFactor), note: String(t.note || ''),
        components: (Array.isArray(t.components) ? t.components : [])
          .filter((c) => isObj(c) && num(c.price) != null)
          .map((c) => ({ name: String(c.name || ''), price: num(c.price), vat: num(c.vat) || 0 })),
        fees: (Array.isArray(t.fees) ? t.fees : [])
          .filter((f) => isObj(f) && num(f.amount) != null)
          .map((f) => ({ name: String(f.name || ''), amount: num(f.amount), vat: num(f.vat) || 0, period: f.period === 'quarter' ? 'quarter' : 'month', enabled: f.enabled !== false })),
      }));
    return state;
  }

  let corrupt = false;

  function load() {
    let raw;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
    if (!raw) return null;
    try {
      return normalize(JSON.parse(raw));
    } catch (e) {
      // Nu suprascriem date pe care nu le putem citi: le păstrăm separat.
      corrupt = true;
      try { localStorage.setItem(`${KEY}:necitit-${Date.now()}`, raw); } catch (_) { /* spațiu insuficient */ }
      console.error('Datele salvate nu au putut fi citite', e);
      return null;
    }
  }

  // `dirtySince`: momentul primei modificări nesalvate într-un backup (export/import).
  function save(state, { changed = true } = {}) {
    if (changed && !state.meta.dirtySince) state.meta.dirtySince = nowIso();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error('Salvarea a eșuat', e);
      return false;
    }
  }

  function clear() {
    try { localStorage.removeItem(KEY); } catch (_) { /* nimic de șters */ }
  }

  function loadUi() {
    try { return JSON.parse(localStorage.getItem(UI_KEY)) || {}; } catch (_) { return {}; }
  }

  function saveUi(ui) {
    try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch (_) { /* preferință opțională */ }
  }

  function markBackedUp(state) {
    state.meta.lastBackupAt = nowIso();
    state.meta.dirtySince = null;
  }

  function serialize(state) {
    return JSON.stringify({ app: 'citire-contoare', exportedAt: nowIso(), ...state }, null, 2);
  }

  function parseFile(text) {
    let raw;
    try {
      raw = JSON.parse(text);
    } catch (e) {
      throw new Error('Fișierul nu este un JSON valid.');
    }
    return normalize(raw);
  }

  // „Adaugă ce lipsește”: păstrează tot ce există și adaugă înregistrările cu id nou.
  function merge(state, incoming) {
    const added = {};
    for (const key of ['clients', 'meters', 'readings', 'tariffs']) {
      const ids = new Set(state[key].map((x) => x.id));
      const fresh = incoming[key].filter((x) => !ids.has(x.id));
      state[key].push(...fresh);
      added[key] = fresh.length;
    }
    return added;
  }

  function removeClient(state, clientId) {
    for (const m of state.meters.filter((x) => x.clientId === clientId)) removeMeter(state, m.id);
    state.clients = state.clients.filter((c) => c.id !== clientId);
  }

  function removeMeter(state, meterId) {
    state.meters = state.meters.filter((m) => m.id !== meterId);
    state.readings = state.readings.filter((r) => r.meterId !== meterId);
    state.tariffs = state.tariffs.filter((t) => t.meterId !== meterId);
  }

  function upsert(list, item) {
    const i = list.findIndex((x) => x.id === item.id);
    if (i >= 0) list[i] = item;
    else list.push(item);
    return item;
  }

  async function requestPersist() {
    try {
      if (navigator.storage && navigator.storage.persist) return await navigator.storage.persist();
    } catch (_) { /* nesuportat */ }
    return false;
  }

  root.CC = root.CC || {};
  root.CC.store = {
    SCHEMA_VERSION, SOURCES, uid, nowIso, emptyState, starterState, makeMeter, normalize,
    load, save, clear, loadUi, saveUi, markBackedUp, serialize, parseFile, merge, removeClient, removeMeter, upsert,
    requestPersist, wasCorrupt: () => corrupt,
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
