/* Interfața: rutare după hash, randare, foi de dialog, export/import. */
(function () {
  'use strict';

  const { defaults, calc, store } = window.CC;
  const { METER_TYPES } = defaults;

  const $app = document.getElementById('app');
  const $top = document.getElementById('topbar');
  const $sheet = document.getElementById('sheet');
  const $toast = document.getElementById('toast');
  const $file = document.getElementById('file-input');

  const app = {
    state: store.load(),
    ui: store.loadUi(),
    openYears: new Set(),
    chartObserver: null,
  };

  // ---------- formatare ----------

  const MONTHS_SHORT = ['ian.', 'feb.', 'mar.', 'apr.', 'mai', 'iun.', 'iul.', 'aug.', 'sept.', 'oct.', 'nov.', 'dec.'];
  const MONTHS_AXIS = ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sep', 'oct', 'noi', 'dec'];
  const MONTHS_LONG = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  const SOURCE_LABELS = { autocitire: 'Autocitire', distribuitor: 'Citire distribuitor', estimat: 'Estimat' };

  const nfCache = new Map();
  const nf = (min, max) => {
    const key = `${min}-${max}`;
    if (!nfCache.has(key)) nfCache.set(key, new Intl.NumberFormat('ro-RO', { minimumFractionDigits: min, maximumFractionDigits: max }));
    return nfCache.get(key);
  };
  const fmtMoney = (x) => `${nf(2, 2).format(x)} lei`;
  const fmtMoneyBare = (x) => nf(2, 2).format(x);
  const fmtQty = (x, maxDec = 2) => nf(0, maxDec).format(x);
  const fmtPrice = (x) => nf(2, 7).format(x);
  const fmtIndex = (x) => (x == null ? '—' : Number.isInteger(x) ? String(x) : String(x).replace('.', ','));
  const pad = (n) => String(n).padStart(2, '0');
  const fmtDate = (iso) => (iso ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}` : '—');
  const fmtDayMonth = (iso) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
  const fmtShort = (iso) => `${Number(iso.slice(8, 10))} ${MONTHS_SHORT[Number(iso.slice(5, 7)) - 1]}`;
  const fmtRange = (a, b) => (a.slice(0, 7) === b.slice(0, 7)
    ? `${Number(a.slice(8, 10))}–${Number(b.slice(8, 10))} ${MONTHS_SHORT[Number(b.slice(5, 7)) - 1]}`
    : `${fmtShort(a)} – ${fmtShort(b)}`);

  // Încheie propoziția fără punct dublu după abrevieri („24 oct.”).
  const sentence = (s) => (s.endsWith('.') ? s : `${s}.`);

  // „3 zile”, „20 de zile” (regula lui „de” în română).
  function plural(n, one, many) {
    if (n === 1) return `1 ${one}`;
    const r = n % 100;
    return `${n} ${(r === 0 && n !== 0) || r >= 20 ? 'de ' : ''}${many}`;
  }

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Acceptă „0,26667”, „1.234,5” și, la indexuri, „30.490” (punct = separator de mii).
  function parseNumber(raw, { index = false } = {}) {
    let s = String(raw == null ? '' : raw).trim().replace(/\s/g, '');
    if (!s) return null;
    if (index && /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    else if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }

  const today = () => calc.todayIso();

  // ---------- iconițe ----------

  const ICONS = {
    electricity: '<path fill="currentColor" d="M13.6 2 4.6 13.4h6.2L9.9 22l9.2-11.9h-6.3L13.6 2z"/>',
    gas: '<path fill="currentColor" d="M12.3 2c.6 3.3 2.6 5.1 4.1 7 1.3 1.7 2.1 3.4 2.1 5.4a6.5 6.5 0 0 1-13 0c0-2.4 1.1-4.2 2.5-5.6.1 1.6.8 2.8 1.9 3.5-.2-3.7.5-7.2 2.4-10.3z"/>',
    water: '<path fill="currentColor" d="M12 2.4c-.3.4-6.6 7.7-6.6 12.6a6.6 6.6 0 0 0 13.2 0c0-4.9-6.3-12.2-6.6-12.6z"/>',
    back: '<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="m15 5-7 7 7 7"/>',
    settings: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></g>',
    plus: '<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M12 5v14M5 12h14"/>',
    chevron: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/>',
    close: '<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/>',
  };
  const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

  // ---------- acces la date ----------

  const meterById = (id) => app.state.meters.find((m) => m.id === id);
  const clientById = (id) => app.state.clients.find((c) => c.id === id);
  const metersOf = (clientId) => app.state.meters.filter((m) => m.clientId === clientId);
  const readingsOf = (meterId) => app.state.readings.filter((r) => r.meterId === meterId);
  const tariffsOf = (meterId) => app.state.tariffs.filter((t) => t.meterId === meterId);
  const historyOf = (meterId) => calc.buildHistory(readingsOf(meterId), tariffsOf(meterId));
  const typeOf = (m) => METER_TYPES[m.type];
  const hasData = () => app.state && (app.state.clients.length > 0 || app.state.readings.length > 0);

  function persist(opts) {
    if (!store.save(app.state, opts)) toast('Datele nu au putut fi salvate pe acest dispozitiv (spațiu insuficient?).', 'error');
  }

  function saveUi() {
    store.saveUi({ clientId: app.ui.clientId, chartYear: app.ui.chartYear || {} });
  }

  // ---------- rutare ----------

  function parseRoute() {
    const [view, id, tab] = location.hash.replace(/^#\/?/, '').split('/');
    if (view === 'm' && id) return { view: 'meter', meterId: decodeURIComponent(id), tab: tab || 'istoric' };
    if (view === 'setari') return { view: 'settings' };
    if (view === 'c' && id) return { view: 'home', clientId: decodeURIComponent(id) };
    return { view: 'home' };
  }

  function currentClientId(route) {
    const ids = app.state.clients.map((c) => c.id);
    for (const id of [route && route.clientId, app.ui.clientId]) if (id && ids.includes(id)) return id;
    return ids[0] || null;
  }

  function render() {
    if (app.chartObserver) { app.chartObserver.disconnect(); app.chartObserver = null; }
    if (!hasData()) { renderWelcome(); return; }
    const route = parseRoute();
    if (route.view === 'meter') {
      const meter = meterById(route.meterId);
      if (meter) { renderMeter(meter, route.tab); return; }
    }
    if (route.view === 'settings') { renderSettings(); return; }
    renderHome(currentClientId(route));
  }

  // ---------- componente comune ----------

  function counterHtml(value, meter, { large = false } = {}) {
    const digits = typeOf(meter).digits || 5;
    const unit = esc(meter.unit);
    if (value == null) {
      const blanks = '<span class="drum drum--lead">–</span>'.repeat(digits);
      return `<span class="counter${large ? ' counter--lg' : ''}" role="img" aria-label="Fără citiri"><span class="counter__drums">${blanks}</span><span class="counter__unit">${unit}</span></span>`;
    }
    const [intPart, decPart] = String(Math.abs(value)).split('.');
    const padded = intPart.padStart(digits, '0');
    const firstSignificant = padded.search(/[1-9]/);
    const drums = [...padded].map((d, i) => `<span class="drum${firstSignificant === -1 || i < firstSignificant ? ' drum--lead' : ''}">${d}</span>`).join('')
      + (decPart ? [...decPart].map((d) => `<span class="drum drum--dec">${d}</span>`).join('') : '');
    return `<span class="counter${large ? ' counter--lg' : ''}" role="img" aria-label="Index ${esc(fmtIndex(value))} ${unit}"><span class="counter__drums">${drums}</span><span class="counter__unit">${unit}</span></span>`;
  }

  function windowHtml(meter) {
    const st = calc.windowStatus(meter.window, readingsOf(meter.id), today());
    if (!st) return '';
    const s = calc.dayNum(st.start);
    const e = calc.dayNum(st.end);
    const t = calc.dayNum(st.today);
    const spanStart = Math.min(t, s) - 1;
    const spanEnd = Math.max(e + 2, spanStart + 21);
    const pos = (d) => (((d - spanStart) / (spanEnd - spanStart)) * 100).toFixed(2);
    const range = fmtRange(st.start, st.end);
    let text = '';
    let sub = '';
    if (st.state === 'open') {
      const left = st.daysLeft === 0 ? 'astăzi e ultima zi' : st.daysLeft === 1 ? 'mâine e ultima zi' : `mai ai ${plural(st.daysLeft + 1, 'zi', 'zile')}`;
      text = `<strong>Poți transmite indexul acum</strong>, până pe ${fmtShort(st.end)}: ${left}.`;
    } else if (st.state === 'done') {
      const next = calc.windowStatus(meter.window, [], calc.isoFromDay(e + 1));
      text = `<strong>${sentence(`Transmis pe ${fmtShort(st.reading.date)}`)}</strong> ${sentence(`Următoarea perioadă: ${fmtRange(next.start, next.end)}`)}`;
    } else {
      const when = st.daysUntil === 1 ? 'începe mâine' : `începe peste ${plural(st.daysUntil, 'zi', 'zile')}`;
      text = `Următoarea perioadă de transmitere: <strong>${range}</strong>, ${when}.`;
      if (st.reading) sub = sentence(`Ultima transmitere: ${fmtShort(st.reading.date)}`);
    }
    return `
      <div class="window window--${st.state}">
        <div class="timeline" aria-hidden="true">
          <span class="timeline__track"></span>
          <span class="timeline__win" style="left:${pos(s)}%;width:${(pos(e + 1) - pos(s)).toFixed(2)}%"></span>
          <span class="timeline__today" style="left:${pos(t + 0.5)}%"></span>
        </div>
        <p class="window__text">${text}</p>
        ${sub ? `<p class="window__sub">${sub}</p>` : ''}
      </div>`;
  }

  function factsHtml(meter, rows) {
    const st = calc.latestState(rows);
    const unit = esc(meter.unit);
    if (!st) return '<p class="muted">Nicio citire încă.</p>';
    const last = st.last.reading;
    const period = st.lastPeriod;
    const cons = period ? (period.consReal != null ? period.consReal : period.consBilled) : null;
    const cost = period && period.cost;
    const advance = st.advance != null && st.advance !== 0
      ? `<small>cu ${fmtQty(Math.abs(st.advance))} ${unit} ${st.advance > 0 ? 'peste' : 'sub'} cel citit</small>` : '';
    return `
      <dl class="facts">
        <div><dt>Ultima citire</dt><dd>${fmtDate(last.date)}${last.source !== 'autocitire' ? `<small>${esc(SOURCE_LABELS[last.source])}</small>` : ''}</dd></div>
        <div><dt>Index transmis</dt><dd>${st.submitted != null ? `${fmtIndex(st.submitted)} ${unit}` : '—'}${advance}</dd></div>
        <div><dt>Consum ultima perioadă</dt><dd>${cons != null ? `${fmtQty(cons)} ${unit}` : '—'}${period && period.days ? `<small>în ${plural(period.days, 'zi', 'zile')}</small>` : ''}</dd></div>
        <div><dt>Factură estimată</dt><dd>${cost ? `≈ ${fmtMoney(cost.total)}` : '—'}${cost && cost.approx ? '<small>la primul tarif cunoscut</small>' : cost ? '<small>TVA inclus</small>' : ''}</dd></div>
      </dl>`;
  }

  function backupBanner() {
    const m = app.state.meta;
    if (!m.dirtySince || !app.state.readings.length) return '';
    const days = Math.floor((Date.now() - Date.parse(m.dirtySince)) / 86400000);
    if (days < 7) return '';
    const last = m.lastBackupAt ? `Ultimul backup: ${fmtDate(m.lastBackupAt.slice(0, 10))}.` : 'Nu ai făcut încă un backup.';
    return `<div class="banner"><p>${last} Exportă datele ca să nu le pierzi dacă browserul curăță stocarea.</p><button class="btn btn--sm" data-action="export">Exportă datele</button></div>`;
  }

  // ---------- ecrane ----------

  function renderWelcome() {
    $top.innerHTML = `<div class="topbar__row"><h1 class="topbar__title">Contoare</h1></div>`;
    const corrupt = store.wasCorrupt()
      ? '<p class="alert">Datele salvate anterior nu au putut fi citite. Au fost păstrate separat în browser; importă un backup ca să continui.</p>' : '';
    $app.innerHTML = `
      <section class="welcome">
        <span class="counter counter--lg" aria-hidden="true"><span class="counter__drums">${'<span class="drum drum--lead">0</span>'.repeat(4)}<span class="drum">1</span></span></span>
        <h1>Citirile de curent, gaz și apă, ținute la zi</h1>
        <p>Notezi indexul de pe contor, aplicația îți arată consumul și cât vei plăti, cu TVA inclus. Datele rămân pe acest dispozitiv.</p>
        ${corrupt}
        <div class="actions">
          ${window.CC.seed ? `<button class="btn btn--primary" data-action="load-seed">Încarcă citirile salvate (${plural(window.CC.seed.readings.length, 'citire', 'citiri')})</button>` : ''}
          <button class="btn${window.CC.seed ? '' : ' btn--primary'}" data-action="import">Importă un fișier</button>
          <button class="btn" data-action="start-fresh">Începe de la zero</button>
        </div>
        <p class="muted"><small>„Începe de la zero” creează clienții Eu și Mama, cu contoarele și tarifele din facturile din octombrie 2026.</small></p>
      </section>`;
  }

  function topbarHome(clientId) {
    const tabs = app.state.clients.map((c) => `<a class="client-tab" href="#/c/${encodeURIComponent(c.id)}"${c.id === clientId ? ' aria-current="page"' : ''}>${esc(c.name)}</a>`).join('');
    $top.innerHTML = `
      <div class="topbar__row">
        <h1 class="topbar__title">Contoare</h1>
        <a class="icon-btn" href="#/setari" aria-label="Setări">${icon('settings')}</a>
      </div>
      <nav class="clients" aria-label="Clienți">${tabs}<button class="client-tab client-tab--add" data-action="add-client" aria-label="Adaugă client">${icon('plus')}</button></nav>`;
  }

  function renderHome(clientId) {
    topbarHome(clientId);
    if (!clientId) {
      $app.innerHTML = `<div class="empty"><p>Nu există niciun client.</p><button class="btn btn--primary" data-action="add-client">Adaugă un client</button></div>`;
      return;
    }
    if (app.ui.clientId !== clientId) { app.ui.clientId = clientId; saveUi(); }
    const meters = metersOf(clientId);
    const plates = meters.map((m) => {
      const rows = historyOf(m.id);
      const st = calc.latestState(rows);
      return `
        <article class="plate t-${m.type}">
          <a class="plate__head" href="#/m/${encodeURIComponent(m.id)}">
            ${icon(m.type, 'type-icon')}
            <div><h2>${esc(m.name)}</h2><p>${esc(m.supplier || typeOf(m).label)}</p></div>
          </a>
          <a class="counter-link" href="#/m/${encodeURIComponent(m.id)}" style="text-decoration:none">${counterHtml(st ? st.read : null, m)}</a>
          ${factsHtml(m, rows)}
          ${windowHtml(m)}
          <div class="actions">
            <button class="btn btn--primary" data-action="new-reading" data-meter="${esc(m.id)}">${icon('plus')}Adaugă citire</button>
            <a class="btn" href="#/m/${encodeURIComponent(m.id)}">Istoric</a>
          </div>
        </article>`;
    }).join('');
    $app.innerHTML = `
      ${backupBanner()}
      ${meters.length ? `<div class="plates">${plates}</div>` : ''}
      ${meters.length ? '' : `<div class="empty"><p>${esc(clientById(clientId).name)} nu are încă niciun contor.</p></div>`}
      <p style="margin-top:14px"><button class="btn" data-action="add-meter" data-client="${esc(clientId)}">${icon('plus')}Adaugă contor</button></p>`;
  }

  function renderMeter(meter, tab) {
    const client = clientById(meter.clientId);
    const base = `#/m/${encodeURIComponent(meter.id)}`;
    $top.innerHTML = `
      <div class="topbar__row">
        <a class="back" href="#/c/${encodeURIComponent(client.id)}">${icon('back')}${esc(client.name)}</a>
        <span style="flex:1"></span>
        <a class="icon-btn" href="#/setari" aria-label="Setări">${icon('settings')}</a>
      </div>`;
    const rows = historyOf(meter.id);
    const st = calc.latestState(rows);
    const tabs = [['istoric', 'Istoric'], ['grafic', 'Grafic'], ['tarif', 'Tarif și detalii']]
      .map(([k, label]) => `<a href="${base}/${k}"${tab === k ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    let body = '';
    if (tab === 'grafic') body = chartPanelHtml(meter, rows);
    else if (tab === 'tarif') body = tariffTabHtml(meter);
    else body = historyHtml(meter, rows);
    $app.innerHTML = `
      <section class="meter-hero t-${meter.type}">
        <div class="meter-hero__head">
          ${icon(meter.type, 'type-icon')}
          <div><h1>${esc(meter.name)}</h1><p>${esc(client.name)}${meter.supplier ? `, ${esc(meter.supplier)}` : ''}</p></div>
        </div>
        <div>${counterHtml(st ? st.read : null, meter, { large: true })}</div>
        <div style="display:grid;gap:14px">${factsHtml(meter, rows)}${windowHtml(meter)}</div>
        <div class="actions"><button class="btn btn--primary" data-action="new-reading" data-meter="${esc(meter.id)}">${icon('plus')}Adaugă citire</button></div>
      </section>
      <nav class="tabs t-${meter.type}" aria-label="Secțiuni contor">${tabs}</nav>
      <div class="t-${meter.type}">${body}</div>`;
    if (tab === 'grafic') mountChart(meter, rows);
  }

  // ---------- istoric ----------

  function historyHtml(meter, rows) {
    if (!rows.length) {
      return `<div class="empty"><p>Nicio citire pentru acest contor.</p><button class="btn btn--primary" data-action="new-reading" data-meter="${esc(meter.id)}">Adaugă prima citire</button></div>`;
    }
    const unit = esc(meter.unit);
    const years = calc.yearSummaries(rows);
    const anyApprox = years.some((y) => y.approx);
    const earliestTariff = calc.sortTariffs(tariffsOf(meter.id))[0];
    if (![...app.openYears].some((k) => k.startsWith(`${meter.id}:`))) app.openYears.add(`${meter.id}:${years[0].year}`);
    const html = years.map((y) => {
      const open = app.openYears.has(`${meter.id}:${y.year}`);
      const body = [...y.rows].reverse().map((row) => rowHtml(meter, row)).join('');
      return `
        <details class="year" data-year-key="${esc(meter.id)}:${y.year}"${open ? ' open' : ''}>
          <summary>
            <span class="year__n">${y.year}</span>
            <dl class="stats">
              <div><dt>Consum</dt><dd>${fmtQty(y.consReal || y.consBilled, 0)} ${unit}</dd></div>
              <div><dt>Cost estimat</dt><dd>${y.hasCost ? `${y.approx ? '≈ ' : ''}${fmtMoney(y.cost)}` : '—'}</dd></div>
              <div><dt>Medie lunară</dt><dd>${y.perMonth != null ? `${fmtQty(y.perMonth, 0)} ${unit}` : '—'}</dd></div>
            </dl>
            ${icon('chevron', 'year__chev')}
          </summary>
          <div style="overflow-x:auto">
            <table class="hist">
              <thead><tr><th>Data</th><th>Citit</th><th>Transmis</th><th>Consum</th><th>Cost (lei)</th></tr></thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </details>`;
    }).join('');
    const note = anyApprox && earliestTariff
      ? `<p class="muted" style="margin-top:8px"><small>Costurile dinainte de ${fmtDate(earliestTariff.validFrom)} sunt calculate cu primul tarif cunoscut (≈). Adaugă tarifele vechi în „Tarif și detalii” pentru valori mai exacte.</small></p>` : '';
    return html + note;
  }

  function rowHtml(meter, row) {
    const r = row.reading;
    const tags = [];
    if (r.source === 'distribuitor') tags.push('<span class="tag">distribuitor</span>');
    if (r.source === 'estimat') tags.push('<span class="tag">estimat</span>');
    if (r.meterReset) tags.push('<span class="tag tag--type">contor nou</span>');
    if (r.uncertain) tags.push('<span class="tag tag--warn" title="Valoare corectată la import; verifică">⚠ verifică</span>');
    const neg = row.warnings.includes('negative');
    const cons = row.consReal != null ? row.consReal : row.consBilled;
    const billedDiff = row.consBilled != null && row.consReal != null && row.consBilled !== row.consReal
      ? `<small>fact. ${fmtQty(row.consBilled)}</small>` : '';
    const cost = row.cost
      ? `<span class="${row.cost.approx ? 'approx' : ''}">${row.cost.approx ? '≈' : ''}${fmtMoneyBare(row.cost.total)}</span>` : '—';
    const label = `Citirea din ${fmtDate(r.date)}, editează`;
    return `
      <tr data-action="edit-reading" data-id="${esc(r.id)}" tabindex="0" aria-label="${esc(label)}">
        <td>${fmtDayMonth(r.date)}${tags.join('')}${r.note ? `<span class="note">${esc(r.note)}</span>` : ''}</td>
        <td>${fmtIndex(r.indexRead)}</td>
        <td>${r.indexSubmitted != null && r.indexSubmitted !== r.indexRead ? fmtIndex(r.indexSubmitted) : r.indexSubmitted != null ? '<span class="muted">=</span>' : '—'}</td>
        <td class="${neg ? 'neg' : ''}">${row.start ? '<span class="muted">—</span>' : cons != null ? fmtQty(cons) : '—'}${billedDiff}</td>
        <td>${cost}</td>
      </tr>`;
  }

  // ---------- grafic ----------

  function chartYears(months) {
    return [...new Set([...months.keys()].map((k) => Number(k.slice(0, 4))))].sort((a, b) => b - a);
  }

  function chartPanelHtml(meter, rows) {
    const months = calc.monthlyConsumption(rows);
    const years = chartYears(months);
    if (!years.length) return '<div class="empty"><p>Graficul apare după cel puțin două citiri.</p></div>';
    const chosen = (app.ui.chartYear || {})[meter.id];
    const year = years.includes(chosen) ? chosen : years[0];
    const chips = years.map((y) => `<button class="chip" data-action="chart-year" data-meter="${esc(meter.id)}" data-year="${y}" aria-pressed="${y === year}">${y}</button>`).join('');
    const total = (y) => {
      let s = 0; let any = false;
      for (let m = 1; m <= 12; m++) { const v = months.get(`${y}-${pad(m)}`); if (v) { s += v.value; any = true; } }
      return any ? s : null;
    };
    const unit = esc(meter.unit);
    const tCur = total(year);
    const tPrev = total(year - 1);
    const rowsHtml = MONTHS_LONG.map((name, i) => {
      const a = months.get(`${year}-${pad(i + 1)}`);
      const b = months.get(`${year - 1}-${pad(i + 1)}`);
      const cell = (v) => (v ? fmtQty(v.value, 1) : '—');
      return `<tr><td>${name}</td><td>${cell(a)}</td><td>${cell(b)}</td></tr>`;
    }).join('');
    return `
      <section class="panel">
        <div class="chips" role="group" aria-label="Anul afișat">${chips}</div>
        <dl class="stats" style="margin-bottom:12px">
          <div><dt>Total ${year}</dt><dd>${tCur != null ? `${fmtQty(tCur, 0)} ${unit}` : '—'}</dd></div>
          <div><dt>Total ${year - 1}</dt><dd>${tPrev != null ? `${fmtQty(tPrev, 0)} ${unit}` : '—'}</dd></div>
        </dl>
        <div class="readout" id="readout" aria-live="polite"></div>
        <div id="chart-host" data-year="${year}"></div>
        <div class="legend"><span><i></i>${year}</span>${tPrev != null ? `<span><i class="prev"></i>${year - 1}</span>` : ''}</div>
        <p class="muted" style="margin-top:8px"><small>Consumul dintre două citiri e împărțit pe luni după numărul de zile, ca să poți compara lunile între ele.</small></p>
        <details class="data-table">
          <summary>Vezi valorile lunare</summary>
          <table><thead><tr><th>Luna</th><th>${year} (${unit})</th><th>${year - 1} (${unit})</th></tr></thead><tbody>${rowsHtml}</tbody></table>
        </details>
      </section>`;
  }

  function niceScale(max, ticks = 4) {
    const rough = max / ticks;
    const mag = 10 ** Math.floor(Math.log10(rough));
    const norm = rough / mag;
    const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
    return { step, top: Math.ceil(max / step) * step };
  }

  function mountChart(meter, rows) {
    const host = document.getElementById('chart-host');
    if (!host) return;
    const months = calc.monthlyConsumption(rows);
    const year = Number(host.dataset.year);
    const draw = () => drawChart(host, meter, months, year);
    draw();
    if ('ResizeObserver' in window) {
      let w = host.clientWidth;
      app.chartObserver = new ResizeObserver(() => { if (Math.abs(host.clientWidth - w) > 4) { w = host.clientWidth; draw(); } });
      app.chartObserver.observe(host);
    }
  }

  function drawChart(host, meter, months, year) {
    const W = Math.max(280, host.clientWidth);
    const H = 220;
    const m = { l: 40, r: 6, t: 20, b: 24 };
    const pw = W - m.l - m.r;
    const ph = H - m.t - m.b;
    const get = (y, i) => months.get(`${y}-${pad(i + 1)}`) || null;
    const cur = MONTHS_AXIS.map((_, i) => get(year, i));
    const prev = MONTHS_AXIS.map((_, i) => get(year - 1, i));
    const values = [...cur, ...prev].filter(Boolean).map((v) => Math.max(0, v.value));
    const { step, top } = niceScale(Math.max(1, ...values));
    const y = (v) => m.t + ph - (Math.max(0, v) / top) * ph;
    const band = pw / 12;
    const bw = Math.min(16, Math.max(4, (band - 8) / 2));
    const hasPrev = prev.some(Boolean);
    const unit = meter.unit;

    const bar = (x, v, cls) => {
      if (!v || v.value <= 0) return '';
      const yt = y(v.value);
      const h = m.t + ph - yt;
      const r = Math.min(4, h, bw / 2);
      return `<path class="${cls}" d="M${x},${m.t + ph}V${yt + r}Q${x},${yt} ${x + r},${yt}H${x + bw - r}Q${x + bw},${yt} ${x + bw},${yt + r}V${m.t + ph}Z"/>`;
    };

    let grid = '';
    for (let v = 0; v <= top + 1e-9; v += step) {
      const yy = y(v).toFixed(1);
      grid += `<line class="${v === 0 ? 'base' : 'grid'}" x1="${m.l}" x2="${W - m.r}" y1="${yy}" y2="${yy}"/>`;
      grid += `<text x="${m.l - 6}" y="${Number(yy) + 4}" text-anchor="end">${fmtQty(v, 1)}</text>`;
    }

    let maxI = -1;
    cur.forEach((v, i) => { if (v && (maxI < 0 || v.value > cur[maxI].value)) maxI = i; });

    let bars = '';
    let labels = '';
    let hits = '';
    cur.forEach((v, i) => {
      const gx = m.l + i * band;
      const pair = hasPrev ? bw * 2 + 2 : bw;
      const x0 = gx + (band - pair) / 2;
      bars += `<g data-i="${i}">${hasPrev ? bar(x0, prev[i], 'bar-prev') : ''}${bar(hasPrev ? x0 + bw + 2 : x0, v, 'bar-cur')}</g>`;
      labels += `<text x="${(gx + band / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle">${MONTHS_AXIS[i]}</text>`;
      if (i === maxI && v.value > 0) {
        const cx = (hasPrev ? x0 + bw + 2 : x0) + bw / 2;
        // deasupra celei mai înalte bare din pereche, ca eticheta să nu atingă bara anului trecut
        const topY = Math.min(y(v.value), hasPrev && prev[i] ? y(prev[i].value) : Infinity);
        labels += `<text class="label-max" x="${cx.toFixed(1)}" y="${(topY - 5).toFixed(1)}" text-anchor="middle">${fmtQty(v.value, 0)}</text>`;
      }
      hits += `<rect class="hit" data-i="${i}" x="${gx.toFixed(1)}" y="${m.t}" width="${band.toFixed(1)}" height="${ph + m.b}" tabindex="0" aria-label="${MONTHS_LONG[i]} ${year}"/>`;
    });

    host.innerHTML = `<svg class="chart" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Consum lunar ${year}${hasPrev ? ` față de ${year - 1}` : ''}">${grid}<g class="bars">${bars}</g>${labels}${hits}</svg>`;

    const svg = host.querySelector('svg');
    const readout = document.getElementById('readout');
    const daysIn = (yy, i) => calc.lastDayOfMonth(yy, i + 1);
    const lastWithData = (() => { for (let i = 11; i >= 0; i--) if (cur[i]) return i; return 0; })();

    const show = (i, active) => {
      const a = cur[i];
      const b = prev[i];
      const part = (v, yy) => (v && v.days > 0 && v.days < daysIn(yy, i) ? `${MONTHS_LONG[i]} ${yy} are citiri pentru ${v.days} din ${plural(daysIn(yy, i), 'zi', 'zile')}` : '');
      const notes = [part(a, year), part(b, year - 1)].filter(Boolean);
      // Valorile vin din calcule, dar etichetele se pun tot prin textContent.
      readout.replaceChildren();
      const item = (v, yy, prevKey) => {
        const wrap = document.createElement('span');
        wrap.className = 'readout__v';
        const key = document.createElement('i');
        key.className = `readout__key${prevKey ? ' readout__key--prev' : ''}`;
        const strong = document.createElement('strong');
        strong.textContent = v ? `${fmtQty(v.value, 1)} ${unit}` : '—';
        const label = document.createElement('span');
        label.textContent = `${MONTHS_LONG[i]} ${yy}`;
        wrap.append(key, strong, label);
        return wrap;
      };
      readout.append(item(a, year, false));
      if (hasPrev) readout.append(item(b, year - 1, true));
      if (notes.length) {
        const n = document.createElement('span');
        n.className = 'readout__note';
        n.textContent = `Lună incompletă: ${notes.join('; ')}.`;
        readout.append(n);
      }
      svg.classList.toggle('has-active', !!active);
      svg.querySelectorAll('.bars g').forEach((g) => g.classList.toggle('is-active', active && Number(g.dataset.i) === i));
    };

    show(lastWithData, false);
    const pick = (e) => { const t = e.target.closest('.hit'); if (t) show(Number(t.dataset.i), true); };
    svg.addEventListener('pointermove', pick);
    svg.addEventListener('pointerdown', pick);
    svg.addEventListener('focusin', pick);
    svg.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') show(lastWithData, false); });
    svg.addEventListener('focusout', () => show(lastWithData, false));
  }

  // ---------- tarif și detalii ----------

  function perUnitWithVat(t) {
    return t.components.reduce((s, c) => s + c.price * (1 + c.vat / 100), 0);
  }

  function tariffTabHtml(meter) {
    const list = calc.sortTariffs(tariffsOf(meter.id)).reverse();
    const current = calc.tariffAt(tariffsOf(meter.id), today());
    const billed = typeOf(meter).billedUnit;
    const cards = list.map((t) => {
      const rows = t.components.map((c) => `
        <tr><td>${esc(c.name)}</td><td>${fmtPrice(c.price)}</td><td>${fmtQty(c.vat)}%</td><td>${fmtPrice(Math.round(c.price * (1 + c.vat / 100) * 1e7) / 1e7)}</td></tr>`).join('');
      const net = t.components.reduce((s, c) => s + c.price, 0);
      const gross = perUnitWithVat(t);
      const extra = [];
      if (meter.type === 'gas' && t.conversionFactor) {
        extra.push(`<p>1 m³ = ${fmtPrice(t.conversionFactor)} kWh (puterea calorifică de pe factură), adică <strong>${fmtPrice(Math.round(gross * t.conversionFactor * 10000) / 10000)} lei/m³</strong> cu TVA.</p>`);
      }
      for (const f of t.fees) {
        const per = f.period === 'quarter' ? 'trimestru' : 'lună';
        extra.push(`<p class="${f.enabled ? '' : 'off'}">${esc(f.name)}: ${fmtMoney(f.amount)}/${per} + TVA ${fmtQty(f.vat)}% = ${fmtMoney(calc.round2(f.amount * (1 + f.vat / 100)))}${f.enabled ? '' : ' (nu se include)'}</p>`);
      }
      return `
        <section class="tariff">
          <div class="tariff__head"><h3>Din ${fmtDate(t.validFrom)}</h3>${current && current.id === t.id ? '<span class="tag tag--type">în vigoare</span>' : ''}</div>
          ${t.note ? `<p class="tariff__note">${esc(t.note)}</p>` : ''}
          <div style="overflow-x:auto"><table>
            <thead><tr><th>Componentă</th><th>lei/${billed} fără TVA</th><th>TVA</th><th>cu TVA</th></tr></thead>
            <tbody>${rows}</tbody>
            <tfoot><tr><td>Total pe ${billed}</td><td>${fmtPrice(Math.round(net * 1e7) / 1e7)}</td><td></td><td>${fmtPrice(Math.round(gross * 1e5) / 1e5)}</td></tr></tfoot>
          </table></div>
          ${extra.length ? `<div class="tariff__extra">${extra.join('')}</div>` : ''}
          <div class="tariff__actions">
            <button class="btn btn--sm" data-action="edit-tariff" data-id="${esc(t.id)}">Editează</button>
            ${list.length > 1 ? `<button class="btn btn--sm btn--danger" data-action="delete-tariff" data-id="${esc(t.id)}">Șterge</button>` : ''}
          </div>
        </section>`;
    }).join('');
    const w = meter.window;
    const win = w && w.startDay ? `${w.startDay} – ${w.endDay === 'end' ? 'sfârșitul lunii' : w.endDay}` : 'nesetată';
    return `
      ${cards || '<div class="empty"><p>Contorul nu are tarif, deci costul nu se poate estima.</p></div>'}
      <p style="margin-bottom:24px"><button class="btn" data-action="new-tariff" data-meter="${esc(meter.id)}">${icon('plus')}Tarif nou de la o dată</button></p>
      <section class="panel">
        <h2 style="font-size:1.125rem;margin-bottom:12px">Contor</h2>
        <dl class="details-list">
          <dt>Furnizor</dt><dd>${esc(meter.supplier) || '—'}</dd>
          <dt>Serie contor</dt><dd>${esc(meter.serial) || '—'}</dd>
          <dt>Cod client</dt><dd>${esc(meter.clientCode) || '—'}</dd>
          <dt>Transmitere</dt><dd>în fiecare lună, zilele ${win}</dd>
          ${meter.notes ? `<dt>Note</dt><dd>${esc(meter.notes)}</dd>` : ''}
        </dl>
        <button class="btn btn--sm" data-action="edit-meter" data-id="${esc(meter.id)}">Editează contorul</button>
      </section>`;
  }

  // ---------- setări ----------

  function renderSettings() {
    $top.innerHTML = `
      <div class="topbar__row">
        <a class="back" href="#/">${icon('back')}Contoare</a>
        <h1 class="topbar__title" style="text-align:center">Setări</h1>
        <span style="width:44px"></span>
      </div>`;
    const clients = app.state.clients.map((c) => {
      const meters = metersOf(c.id).map((m) => `
        <li class="t-${m.type}">${icon(m.type, 'type-icon')}<div><strong>${esc(m.name)}</strong><p>${esc(m.supplier || '')}${m.serial ? `, contor ${esc(m.serial)}` : ''}</p></div>
          <button class="btn btn--sm" data-action="edit-meter" data-id="${esc(m.id)}">Editează</button></li>`).join('');
      const count = app.state.readings.filter((r) => metersOf(c.id).some((m) => m.id === r.meterId)).length;
      return `
        <div class="client-block">
          <div class="client-block__head"><div style="flex:1"><h3>${esc(c.name)}</h3><small class="muted">${plural(count, 'citire', 'citiri')}</small></div>
            <button class="btn btn--sm" data-action="rename-client" data-id="${esc(c.id)}">Editează</button></div>
          <ul class="meter-list">${meters}</ul>
          <div class="client-block__foot"><button class="btn btn--sm" data-action="add-meter" data-client="${esc(c.id)}">${icon('plus')}Adaugă contor</button></div>
        </div>`;
    }).join('');
    const m = app.state.meta;
    const backup = m.lastBackupAt ? `Ultimul backup: ${fmtDate(m.lastBackupAt.slice(0, 10))}${m.dirtySince ? ', cu modificări făcute după el' : ', nimic nou de atunci'}.` : 'Nu ai făcut încă un backup.';
    $app.innerHTML = `
      <section class="section">
        <h2>Clienți și contoare</h2>
        ${clients}
        <button class="btn" data-action="add-client">${icon('plus')}Adaugă client</button>
      </section>
      <section class="section">
        <h2>Backup și mutarea datelor</h2>
        <p>Datele stau doar în browserul acestui dispozitiv. Ca să le ai și pe celălalt dispozitiv, exportă un fișier aici și importă-l acolo (prin AirDrop, iCloud Drive, OneDrive sau e-mail). ${backup}</p>
        <div class="actions" style="max-width:520px">
          <button class="btn btn--primary" data-action="export">Exportă datele</button>
          <button class="btn" data-action="import">Importă din fișier</button>
        </div>
      </section>
      <section class="section">
        <h2>Instalează pe ecranul principal</h2>
        <ol class="steps">
          <li>iPhone: deschide pagina în Safari, apasă Partajare, apoi „Adaugă pe ecranul principal”.</li>
          <li>Windows 11: în Edge, meniul ⋯ → Aplicații → „Instalează acest site ca aplicație”.</li>
          <li>Pe iPhone, folosește aplicația de pe ecranul principal: Safari poate șterge datele site-urilor nevizitate de 7 zile.</li>
        </ol>
      </section>
      <section class="section">
        <h2>Șterge datele</h2>
        <p>Șterge toți clienții, contoarele, citirile și tarifele de pe acest dispozitiv. Fișierele exportate rămân neatinse.</p>
        <button class="btn btn--danger" data-action="wipe">Șterge toate datele de pe acest dispozitiv</button>
      </section>
      <p class="about" id="about">Citire contoare, versiunea 1.0</p>`;
    if (navigator.storage && navigator.storage.persisted) {
      navigator.storage.persisted().then((p) => {
        const el = document.getElementById('about');
        if (el) el.textContent += p ? '. Stocare permanentă activată.' : '. Browserul poate curăța stocarea dacă rămâne fără spațiu.';
      }).catch(() => {});
    }
  }

  // ---------- foi de dialog ----------

  function openSheet(html, mount) {
    $sheet.innerHTML = html;
    if (!$sheet.open) $sheet.showModal();
    $sheet.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); closeSheet(); }));
    if (mount) mount($sheet);
    const first = $sheet.querySelector('[autofocus]');
    if (first && matchMedia('(pointer: fine)').matches) first.focus();
  }

  function closeSheet() {
    if ($sheet.open) $sheet.close();
    $sheet.innerHTML = '';
  }

  $sheet.addEventListener('click', (e) => {
    if (e.target !== $sheet) return;
    const r = $sheet.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) closeSheet();
  });

  const sheetHead = (title, sub = '') => `
    <header class="sheet__head"><div style="flex:1"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>
      <button class="icon-btn" data-close aria-label="Închide">${icon('close')}</button></header>`;

  // Citire nouă / editare citire, cu previzualizarea costului.
  function openReadingSheet(meterId, readingId) {
    const meter = meterById(meterId);
    if (!meter) return;
    const client = clientById(meter.clientId);
    const existing = readingId ? app.state.readings.find((r) => r.id === readingId) : null;
    const unit = esc(meter.unit);
    const r = existing || { date: today(), indexRead: null, indexSubmitted: null, source: 'autocitire', meterReset: false, uncertain: false, note: '' };
    const sources = Object.entries(SOURCE_LABELS).map(([k, label]) => `
      <label><input type="radio" name="source" value="${k}"${r.source === k ? ' checked' : ''}><span>${label}</span></label>`).join('');
    const submittedValue = existing && existing.indexSubmitted != null && existing.indexSubmitted !== existing.indexRead ? fmtIndex(existing.indexSubmitted) : '';
    openSheet(`
      <form class="t-${meter.type}" novalidate>
        ${sheetHead(existing ? 'Editează citirea' : 'Citire nouă', `${esc(meter.name)}, ${esc(client.name)}`)}
        <div class="sheet__body">
          <label class="field"><span>Data citirii</span><input type="date" name="date" value="${esc(r.date)}" required max="2100-12-31"></label>
          <div class="row2">
            <label class="field"><span>Index citit (${unit})</span>
              <input class="big" name="indexRead" inputmode="decimal" autocomplete="off" value="${esc(fmtIndex(r.indexRead) === '—' ? '' : fmtIndex(r.indexRead))}" autofocus></label>
            <label class="field"><span>Index transmis (${unit})</span>
              <input class="big" name="indexSubmitted" inputmode="decimal" autocomplete="off" value="${esc(submittedValue)}" placeholder="la fel"></label>
          </div>
          <div class="round-chips" aria-label="Completează indexul transmis">
            <button type="button" class="chip" data-round="0">Ca citit</button>
            <button type="button" class="chip" data-round="5">Rotunjit la 5</button>
            <button type="button" class="chip" data-round="10">Rotunjit la 10</button>
          </div>
          <fieldset class="field"><legend>Cine a citit</legend><div class="choice">${sources}</div></fieldset>
          <label class="check"><input type="checkbox" name="meterReset"${r.meterReset ? ' checked' : ''}><span>Contor înlocuit: indexul pornește de la zero, fără consum față de citirea anterioară</span></label>
          ${existing && existing.uncertain ? `<label class="check"><input type="checkbox" name="uncertain" checked><span>Marcată „verifică” (dată sau valoare corectată la import)</span></label>` : ''}
          <label class="field"><span>Notă</span><input name="note" value="${esc(r.note)}" autocomplete="off" placeholder="opțional"></label>
          <section class="preview" id="preview" aria-live="polite"></section>
        </div>
        <footer class="sheet__foot">
          ${existing ? '<button type="button" class="btn btn--danger" data-del>Șterge</button>' : ''}
          <span class="spacer"></span>
          <button type="button" class="btn" data-close>Renunță</button>
          <button type="submit" class="btn btn--primary">Salvează citirea</button>
        </footer>
      </form>`, (root) => {
      const form = root.querySelector('form');
      const f = form.elements;
      const preview = root.querySelector('#preview');

      const read = () => {
        const indexRead = parseNumber(f.indexRead.value, { index: true });
        const sub = parseNumber(f.indexSubmitted.value, { index: true });
        return {
          id: existing ? existing.id : '__draft',
          meterId: meter.id,
          date: f.date.value,
          indexRead,
          indexSubmitted: sub == null ? indexRead : sub,
          source: form.querySelector('input[name="source"]:checked').value,
          meterReset: f.meterReset.checked,
          uncertain: f.uncertain ? f.uncertain.checked : false,
          note: f.note.value.trim(),
        };
      };

      const update = () => {
        const d = read();
        const errors = [];
        f.indexRead.setAttribute('aria-invalid', Number.isNaN(d.indexRead));
        f.indexSubmitted.setAttribute('aria-invalid', Number.isNaN(d.indexSubmitted));
        if (Number.isNaN(d.indexRead) || Number.isNaN(d.indexSubmitted)) errors.push('Indexul trebuie să fie un număr, de exemplu 30490 sau 2004,5.');
        if (!calc.isValidIso(d.date)) errors.push('Alege data citirii.');
        if (errors.length) { preview.innerHTML = errors.map((e) => `<p class="alert">${e}</p>`).join(''); return; }
        if (d.indexRead == null && d.indexSubmitted == null) {
          preview.innerHTML = '<p class="muted">Introdu indexul ca să vezi consumul și factura estimată.</p>';
          return;
        }
        const others = readingsOf(meter.id).filter((x) => !existing || x.id !== existing.id);
        const rows = calc.buildHistory([...others, d], tariffsOf(meter.id));
        const row = rows.find((x) => x.reading === d);
        const parts = [];
        if (others.some((x) => x.date === d.date)) parts.push(`<p class="alert">Există deja o citire pe ${fmtDate(d.date)}.</p>`);
        if (row.start) {
          parts.push(`<p class="muted">${d.meterReset ? 'Contor nou' : 'Prima citire a contorului'}: nu există consum de calculat. De la această citire se va calcula consumul următoarei.</p>`);
          preview.innerHTML = parts.join('');
          return;
        }
        const prevRow = rows[rows.indexOf(row) - 1];
        if (row.warnings.includes('negative')) {
          parts.push(`<p class="alert">Indexul e mai mic decât cel anterior (${fmtIndex(calc.billedIndex(prevRow.reading))}). Dacă s-a schimbat contorul, bifează „Contor înlocuit”.</p>`);
        }
        const cons = [];
        cons.push(`<div><dt>Față de</dt><dd>${fmtDate(prevRow.reading.date)}<small>${row.days != null ? plural(row.days, 'zi', 'zile') : ''}</small></dd></div>`);
        if (row.consReal != null) cons.push(`<div><dt>Consum real</dt><dd>${fmtQty(row.consReal)} ${unit}</dd></div>`);
        if (row.consBilled != null) {
          const kwh = meter.type === 'gas' && row.cost ? `<small>${fmtQty(row.cost.billedQty, 1)} kWh</small>` : '';
          cons.push(`<div><dt>Consum facturat</dt><dd>${fmtQty(row.consBilled)} ${unit}${kwh}</dd></div>`);
        }
        parts.push(`<dl class="facts">${cons.join('')}</dl>`);
        if (row.cost) parts.push(costHtml(row.cost, meter));
        else if (!tariffsOf(meter.id).length) parts.push('<p class="muted">Adaugă un tarif ca să vezi factura estimată.</p>');
        preview.innerHTML = parts.join('');
      };

      let submittedTouched = !!submittedValue;
      f.indexSubmitted.addEventListener('input', () => { submittedTouched = f.indexSubmitted.value.trim() !== ''; });
      f.indexRead.addEventListener('input', () => { if (!submittedTouched) f.indexSubmitted.placeholder = f.indexRead.value.trim() || 'la fel'; });
      root.querySelectorAll('[data-round]').forEach((b) => b.addEventListener('click', () => {
        const v = parseNumber(f.indexRead.value, { index: true });
        if (v == null || Number.isNaN(v)) { f.indexRead.focus(); return; }
        const step = Number(b.dataset.round);
        f.indexSubmitted.value = step ? fmtIndex(Math.ceil(v / step) * step) : '';
        submittedTouched = !!step;
        update();
      }));
      form.addEventListener('input', update);
      form.addEventListener('change', update);
      update();

      const del = root.querySelector('[data-del]');
      if (del) del.addEventListener('click', () => {
        if (!confirm(`Ștergi citirea din ${fmtDate(existing.date)}?`)) return;
        app.state.readings = app.state.readings.filter((x) => x.id !== existing.id);
        persist();
        closeSheet();
        toast('Citirea a fost ștearsă');
        render();
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const d = read();
        if (!calc.isValidIso(d.date)) { f.date.focus(); return; }
        if (Number.isNaN(d.indexRead) || Number.isNaN(d.indexSubmitted)) { f.indexRead.focus(); return; }
        if (d.indexRead == null && d.indexSubmitted == null) { f.indexRead.focus(); return; }
        const saved = { ...d, id: existing ? existing.id : store.uid('r'), updatedAt: store.nowIso() };
        store.upsert(app.state.readings, saved);
        persist();
        closeSheet();
        toast(existing ? 'Citirea a fost actualizată' : 'Citirea a fost salvată');
        render();
      });
    });
  }

  function costHtml(cost, meter) {
    const billed = typeOf(meter).billedUnit;
    const lines = cost.lines.map((l) => {
      const when = l.kind === 'unit' && l.split ? ` <span class="muted">(${fmtDayMonth(l.from)}–${fmtDayMonth(l.to)})</span>` : '';
      const qty = l.kind === 'fee'
        ? `${l.qty} × ${fmtMoney(l.price)}/${l.period === 'quarter' ? 'trimestru' : 'lună'}`
        : `${fmtQty(l.qty, 2)} ${billed} × ${fmtPrice(l.price)}`;
      return `<tr><td>${esc(l.name)}${when}<br><span class="muted">${qty}</span></td><td>${fmtMoneyBare(l.net)}</td></tr>`;
    }).join('');
    const vats = Object.entries(cost.vatByRate).map(([rate, v]) => `<tr><td>TVA ${fmtQty(Number(rate))}%</td><td>${fmtMoneyBare(v)}</td></tr>`).join('');
    const approx = cost.approx
      ? `<p class="muted"><small>Perioada e înainte de primul tarif cunoscut (${fmtDate(cost.approxFrom)}); costul folosește acel tarif.</small></p>` : '';
    return `
      <div class="preview__total"><strong>≈ ${fmtMoney(cost.total)}</strong><span class="muted">factură estimată, din care TVA ${fmtMoney(cost.vat)}</span></div>
      ${approx}
      <details><summary>Cum s-a calculat</summary>
        <table class="preview__lines"><tbody>${lines}
          <tr class="sum"><td>Total fără TVA</td><td>${fmtMoneyBare(cost.net)}</td></tr>${vats}
          <tr class="sum"><td>Total cu TVA</td><td>${fmtMoneyBare(cost.total)}</td></tr>
        </tbody></table>
      </details>`;
  }

  function openClientSheet(clientId) {
    const client = clientId ? clientById(clientId) : null;
    openSheet(`
      <form novalidate>
        ${sheetHead(client ? 'Editează clientul' : 'Client nou')}
        <div class="sheet__body">
          <label class="field"><span>Nume</span><input name="name" value="${esc(client ? client.name : '')}" required autocomplete="off" autofocus placeholder="de exemplu Mama"></label>
          ${client ? '' : '<p class="muted"><small>După ce îl creezi, adaugă-i contoarele din pagina lui.</small></p>'}
        </div>
        <footer class="sheet__foot">
          ${client ? `<button type="button" class="btn btn--danger" data-action="delete-client" data-id="${esc(client.id)}">Șterge clientul</button>` : ''}
          <span class="spacer"></span><button type="button" class="btn" data-close>Renunță</button><button type="submit" class="btn btn--primary">${client ? 'Salvează' : 'Creează clientul'}</button></footer>
      </form>`, (root) => {
      const form = root.querySelector('form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.elements.name.value.trim();
        if (!name) { form.elements.name.setAttribute('aria-invalid', 'true'); form.elements.name.focus(); return; }
        if (client) client.name = name;
        else {
          const c = { id: store.uid('c'), name };
          app.state.clients.push(c);
          app.ui.clientId = c.id;
          saveUi();
          location.hash = `#/c/${encodeURIComponent(c.id)}`;
        }
        persist();
        closeSheet();
        toast(client ? 'Clientul a fost salvat' : 'Clientul a fost creat');
        render();
      });
    });
  }

  function openMeterSheet(clientId, meterId) {
    const meter = meterId ? meterById(meterId) : null;
    const cid = meter ? meter.clientId : clientId;
    const client = clientById(cid);
    const type = meter ? meter.type : 'electricity';
    const w = meter ? meter.window : defaults.WINDOWS[type];
    const typeOptions = Object.entries(METER_TYPES).map(([k, t]) => `<option value="${k}"${k === type ? ' selected' : ''}>${t.label} (${t.unit})</option>`).join('');
    openSheet(`
      <form novalidate>
        ${sheetHead(meter ? 'Editează contorul' : 'Contor nou', esc(client.name))}
        <div class="sheet__body">
          <label class="field"><span>Tip</span><select name="type"${meter ? ' disabled' : ''}>${typeOptions}</select>
            ${meter ? '' : '<small>Contorul nou primește tariful din facturile din octombrie 2026 pentru tipul ales; îl poți modifica apoi.</small>'}</label>
          <label class="field"><span>Nume</span><input name="name" value="${esc(meter ? meter.name : METER_TYPES[type].label)}" autocomplete="off"></label>
          <label class="field"><span>Furnizor</span><input name="supplier" value="${esc(meter ? meter.supplier : defaults.SUPPLIERS[type])}" autocomplete="off"></label>
          <div class="row2">
            <label class="field"><span>Serie contor</span><input name="serial" value="${esc(meter ? meter.serial : '')}" autocomplete="off"></label>
            <label class="field"><span>Cod client</span><input name="clientCode" value="${esc(meter ? meter.clientCode : '')}" autocomplete="off"></label>
          </div>
          <fieldset class="field"><legend>Perioada de transmitere a indexului (zilele lunii)</legend>
            <div class="row2">
              <label class="field"><span>De la ziua</span><input type="number" name="startDay" min="1" max="31" inputmode="numeric" value="${w && w.startDay ? w.startDay : ''}"></label>
              <label class="field"><span>Până în ziua</span><input type="number" name="endDay" min="1" max="31" inputmode="numeric" value="${w && w.endDay !== 'end' ? w.endDay : ''}"${w && w.endDay === 'end' ? ' disabled' : ''}></label>
            </div>
            <label class="check" style="margin-top:8px"><input type="checkbox" name="toEnd"${w && w.endDay === 'end' ? ' checked' : ''}><span>Până la sfârșitul lunii</span></label>
            <small>Lasă „De la ziua” gol dacă nu vrei memento.</small>
          </fieldset>
          <label class="field"><span>Note</span><textarea name="notes" rows="2">${esc(meter ? meter.notes : '')}</textarea></label>
        </div>
        <footer class="sheet__foot">
          ${meter ? '<button type="button" class="btn btn--danger" data-del>Șterge contorul</button>' : ''}
          <span class="spacer"></span>
          <button type="button" class="btn" data-close>Renunță</button>
          <button type="submit" class="btn btn--primary">${meter ? 'Salvează' : 'Adaugă contorul'}</button>
        </footer>
      </form>`, (root) => {
      const form = root.querySelector('form');
      const f = form.elements;
      f.toEnd.addEventListener('change', () => { f.endDay.disabled = f.toEnd.checked; });
      if (!meter) {
        f.type.addEventListener('change', () => {
          const t = f.type.value;
          f.name.value = METER_TYPES[t].label;
          f.supplier.value = defaults.SUPPLIERS[t];
          const dw = defaults.WINDOWS[t];
          f.startDay.value = dw.startDay;
          f.toEnd.checked = dw.endDay === 'end';
          f.endDay.disabled = f.toEnd.checked;
          f.endDay.value = dw.endDay === 'end' ? '' : dw.endDay;
        });
      }
      const del = root.querySelector('[data-del]');
      if (del) del.addEventListener('click', () => {
        const n = readingsOf(meter.id).length;
        if (!confirm(`Ștergi contorul „${meter.name}” și ${plural(n, 'citire', 'citiri')}? Acțiunea nu se poate anula.`)) return;
        store.removeMeter(app.state, meter.id);
        persist();
        closeSheet();
        toast('Contorul a fost șters');
        location.hash = `#/c/${encodeURIComponent(cid)}`;
        render();
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const start = parseNumber(f.startDay.value);
        const end = f.toEnd.checked ? 'end' : parseNumber(f.endDay.value);
        const okDay = (d) => Number.isInteger(d) && d >= 1 && d <= 31;
        let window = null;
        if (start != null) {
          if (!okDay(start) || !(end === 'end' || (okDay(end) && end >= start))) {
            f.startDay.setAttribute('aria-invalid', 'true');
            toast('Perioada de transmitere: zilele trebuie să fie între 1 și 31, iar ziua de final după cea de început.', 'error');
            return;
          }
          window = { startDay: start, endDay: end };
        }
        const fields = {
          name: f.name.value.trim() || METER_TYPES[meter ? meter.type : f.type.value].label,
          supplier: f.supplier.value.trim(),
          serial: f.serial.value.trim(),
          clientCode: f.clientCode.value.trim(),
          notes: f.notes.value.trim(),
          window,
        };
        if (meter) Object.assign(meter, fields);
        else {
          const m = store.makeMeter(app.state, cid, f.type.value, fields);
          m.window = window;
        }
        persist();
        closeSheet();
        toast(meter ? 'Contorul a fost actualizat' : 'Contorul a fost adăugat');
        render();
      });
    });
  }

  function componentRow(c = { name: '', price: '', vat: 21 }) {
    return `<div class="row-edit" data-row="component">
      <input name="cname" value="${esc(c.name)}" placeholder="Denumire" aria-label="Denumire componentă">
      <input name="cprice" value="${esc(c.price === '' ? '' : String(c.price).replace('.', ','))}" inputmode="decimal" placeholder="0,00000" aria-label="Preț fără TVA">
      <input name="cvat" value="${esc(c.vat)}" inputmode="decimal" aria-label="TVA %">
      <button type="button" class="x" data-remove aria-label="Elimină">×</button></div>`;
  }

  function feeRow(fee = { name: '', amount: '', vat: 21, period: 'month', enabled: true }) {
    return `<div class="row-edit row-edit--fee" data-row="fee">
      <input name="fname" value="${esc(fee.name)}" placeholder="Denumire" aria-label="Denumire taxă">
      <input name="famount" value="${esc(fee.amount === '' ? '' : String(fee.amount).replace('.', ','))}" inputmode="decimal" placeholder="0,00" aria-label="Sumă fără TVA">
      <input name="fvat" value="${esc(fee.vat)}" inputmode="decimal" aria-label="TVA %">
      <select name="fperiod" aria-label="Frecvență"><option value="month"${fee.period === 'month' ? ' selected' : ''}>lunar</option><option value="quarter"${fee.period === 'quarter' ? ' selected' : ''}>trimestrial</option></select>
      <button type="button" class="x" data-remove aria-label="Elimină">×</button>
      <label class="fee-on"><input type="checkbox" name="fenabled"${fee.enabled ? ' checked' : ''}> se include în factura estimată</label></div>`;
  }

  function openTariffSheet(meterId, tariffId) {
    const meter = meterById(meterId);
    const tariff = tariffId ? app.state.tariffs.find((t) => t.id === tariffId) : null;
    const latest = calc.sortTariffs(tariffsOf(meterId)).pop();
    const base = tariff || (latest ? { ...latest, id: null, validFrom: today(), note: '' } : { validFrom: today(), components: [], fees: [], conversionFactor: meter.type === 'gas' ? 10.452 : null, note: '' });
    const billed = typeOf(meter).billedUnit;
    openSheet(`
      <form class="t-${meter.type}" novalidate>
        ${sheetHead(tariff ? 'Editează tariful' : 'Tarif nou', `${esc(meter.name)}, prețuri fără TVA, în lei/${billed}`)}
        <div class="sheet__body">
          <div class="row2">
            <label class="field"><span>Valabil din</span><input type="date" name="validFrom" value="${esc(base.validFrom)}" required></label>
            ${meter.type === 'gas' ? `<label class="field"><span>Putere calorifică (kWh/m³)</span><input name="pcs" inputmode="decimal" value="${esc(base.conversionFactor ? String(base.conversionFactor).replace('.', ',') : '')}"></label>` : ''}
          </div>
          <div class="field"><span>Componente de preț (lei/${billed})</span>
            <div class="row-head"><span>Denumire</span><span>fără TVA</span><span>TVA %</span><span></span></div>
            <div class="rows-edit" id="components">${base.components.map(componentRow).join('')}</div>
            <button type="button" class="btn btn--sm" data-add="component" style="justify-self:start">${icon('plus')}Componentă</button>
            <small>O reducere (de exemplu plafonarea OUG) se trece cu minus.</small>
          </div>
          <div class="field"><span>Taxe fixe (abonamente, servicii)</span>
            <div class="row-head row-head--fee"><span>Denumire</span><span>lei fără TVA</span><span>TVA %</span><span>Frecvență</span><span></span></div>
            <div class="rows-edit" id="fees">${base.fees.map(feeRow).join('')}</div>
            <button type="button" class="btn btn--sm" data-add="fee" style="justify-self:start">${icon('plus')}Taxă fixă</button>
          </div>
          <label class="field"><span>Notă</span><input name="note" value="${esc(base.note || '')}" placeholder="de exemplu: factura din noiembrie 2026"></label>
        </div>
        <footer class="sheet__foot"><span class="spacer"></span><button type="button" class="btn" data-close>Renunță</button><button type="submit" class="btn btn--primary">Salvează tariful</button></footer>
      </form>`, (root) => {
      const form = root.querySelector('form');
      root.addEventListener('click', (e) => {
        const rm = e.target.closest('[data-remove]');
        if (rm) { rm.closest('[data-row]').remove(); return; }
        const add = e.target.closest('[data-add]');
        if (add) {
          const target = root.querySelector(add.dataset.add === 'fee' ? '#fees' : '#components');
          target.insertAdjacentHTML('beforeend', add.dataset.add === 'fee' ? feeRow() : componentRow({ name: '', price: '', vat: meter.type === 'water' ? 11 : 21 }));
          target.lastElementChild.querySelector('input').focus();
        }
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = form.elements;
        const problems = [];
        const validFrom = f.validFrom.value;
        if (!calc.isValidIso(validFrom)) problems.push('Alege data de la care e valabil tariful.');
        if (tariffsOf(meterId).some((t) => t.validFrom === validFrom && (!tariff || t.id !== tariff.id))) problems.push(`Există deja un tarif valabil din ${fmtDate(validFrom)}.`);
        const components = [...root.querySelectorAll('[data-row="component"]')].map((row) => {
          const q = (n) => row.querySelector(`[name="${n}"]`).value;
          return { name: q('cname').trim(), price: parseNumber(q('cprice')), vat: parseNumber(q('cvat')) };
        }).filter((c) => c.name || c.price != null);
        const fees = [...root.querySelectorAll('[data-row="fee"]')].map((row) => {
          const q = (n) => row.querySelector(`[name="${n}"]`);
          return { name: q('fname').value.trim(), amount: parseNumber(q('famount').value), vat: parseNumber(q('fvat').value), period: q('fperiod').value, enabled: q('fenabled').checked };
        }).filter((x) => x.name || x.amount != null);
        if (components.some((c) => c.price == null || Number.isNaN(c.price) || c.vat == null || Number.isNaN(c.vat))) problems.push('Fiecare componentă are nevoie de preț și cotă TVA (numere).');
        if (fees.some((x) => x.amount == null || Number.isNaN(x.amount) || x.vat == null || Number.isNaN(x.vat))) problems.push('Fiecare taxă fixă are nevoie de sumă și cotă TVA (numere).');
        let pcs = null;
        if (meter.type === 'gas') {
          pcs = parseNumber(f.pcs.value);
          if (!(pcs > 0)) problems.push('Puterea calorifică trebuie să fie un număr pozitiv (de exemplu 10,452).');
        }
        if (problems.length) { toast(problems[0], 'error'); return; }
        const saved = {
          id: tariff ? tariff.id : store.uid('t'), meterId, validFrom, conversionFactor: pcs,
          note: f.note.value.trim(),
          components: components.map((c) => ({ name: c.name || 'Componentă', price: c.price, vat: c.vat })),
          fees: fees.map((x) => ({ ...x, name: x.name || 'Taxă fixă' })),
        };
        store.upsert(app.state.tariffs, saved);
        persist();
        closeSheet();
        toast('Tariful a fost salvat');
        render();
      });
    });
  }

  function openImportSheet(incoming) {
    const count = (s) => `${plural(s.clients.length, 'client', 'clienți')}, ${plural(s.meters.length, 'contor', 'contoare')}, ${plural(s.readings.length, 'citire', 'citiri')}`;
    openSheet(`
      <form novalidate>
        ${sheetHead('Importă datele')}
        <div class="sheet__body">
          <p>Fișierul conține ${count(incoming)}.</p>
          <p class="muted">Pe acest dispozitiv ai acum ${count(app.state)}.</p>
          <p><strong>Înlocuiește tot</strong> șterge datele de aici și le pune pe cele din fișier. <strong>Adaugă ce lipsește</strong> păstrează tot ce ai aici și adaugă din fișier doar înregistrările noi.</p>
        </div>
        <footer class="sheet__foot"><button type="button" class="btn" data-close>Renunță</button><span class="spacer"></span>
          <button type="button" class="btn" data-mode="merge">Adaugă ce lipsește</button>
          <button type="button" class="btn btn--primary" data-mode="replace">Înlocuiește tot</button></footer>
      </form>`, (root) => {
      root.querySelector('[data-mode="merge"]').addEventListener('click', () => {
        const added = store.merge(app.state, incoming);
        persist();
        closeSheet();
        const parts = [
          added.clients && plural(added.clients, 'client', 'clienți'),
          added.meters && plural(added.meters, 'contor', 'contoare'),
          added.readings && plural(added.readings, 'citire', 'citiri'),
          added.tariffs && plural(added.tariffs, 'tarif', 'tarife'),
        ].filter(Boolean);
        toast(parts.length ? `Adăugat din fișier: ${parts.join(', ')}` : 'Nu era nimic nou în fișier');
        render();
      });
      root.querySelector('[data-mode="replace"]').addEventListener('click', () => { closeSheet(); replaceState(incoming); });
    });
  }

  function replaceState(incoming) {
    app.state = incoming;
    store.markBackedUp(app.state);
    store.save(app.state, { changed: false });
    app.ui.clientId = app.state.clients[0] ? app.state.clients[0].id : null;
    saveUi();
    app.openYears.clear();
    store.requestPersist();
    toast(`Importat: ${plural(incoming.readings.length, 'citire', 'citiri')}`);
    if (location.hash && location.hash !== '#/') location.hash = '#/';
    render();
  }

  // Citirile incluse în aplicație (js/seed.js), fără coduri de client sau serii de contor.
  function loadBuiltInSeed() {
    app.state = store.normalize(JSON.parse(JSON.stringify(window.CC.seed)));
    store.save(app.state, { changed: false });
    store.markSeedApplied();
    app.ui.clientId = app.state.clients[0] ? app.state.clients[0].id : null;
    saveUi();
    app.openYears.clear();
    store.requestPersist();
  }

  // ---------- export / import ----------

  async function exportData() {
    const text = store.serialize(app.state);
    const name = `citiri-contoare-${today()}.json`;
    const blob = new Blob([text], { type: 'application/json' });
    let shared = false;
    if (matchMedia('(pointer: coarse)').matches && navigator.canShare) {
      const file = new File([blob], name, { type: 'application/json' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Citiri contoare' });
          shared = true;
        } catch (e) {
          if (e.name === 'AbortError') return;
        }
      }
    }
    if (!shared) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.append(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    }
    store.markBackedUp(app.state);
    store.save(app.state, { changed: false });
    toast('Datele au fost exportate');
    render();
  }

  // Folosit și din consolă la testare: CC.ui.importText(textJSON).
  function importText(text) {
    let incoming;
    try {
      incoming = store.parseFile(text);
    } catch (e) {
      toast(e.message, 'error');
      return false;
    }
    if (hasData()) openImportSheet(incoming);
    else replaceState(incoming);
    return true;
  }

  $file.addEventListener('change', async () => {
    const file = $file.files && $file.files[0];
    $file.value = '';
    if (!file) return;
    importText(await file.text());
  });

  // ---------- acțiuni ----------

  const ACTIONS = {
    'new-reading': (el) => openReadingSheet(el.dataset.meter),
    'edit-reading': (el) => {
      const r = app.state.readings.find((x) => x.id === el.dataset.id);
      if (r) openReadingSheet(r.meterId, r.id);
    },
    'add-client': () => openClientSheet(),
    'rename-client': (el) => openClientSheet(el.dataset.id),
    'delete-client': (el) => {
      const c = clientById(el.dataset.id);
      const n = app.state.readings.filter((r) => metersOf(c.id).some((m) => m.id === r.meterId)).length;
      if (!confirm(`Ștergi clientul „${c.name}”, contoarele lui și ${plural(n, 'citire', 'citiri')}? Acțiunea nu se poate anula.`)) return;
      store.removeClient(app.state, c.id);
      persist();
      closeSheet();
      toast('Clientul a fost șters');
      render();
    },
    'add-meter': (el) => openMeterSheet(el.dataset.client),
    'edit-meter': (el) => openMeterSheet(null, el.dataset.id),
    'new-tariff': (el) => openTariffSheet(el.dataset.meter),
    'edit-tariff': (el) => {
      const t = app.state.tariffs.find((x) => x.id === el.dataset.id);
      if (t) openTariffSheet(t.meterId, t.id);
    },
    'delete-tariff': (el) => {
      const t = app.state.tariffs.find((x) => x.id === el.dataset.id);
      if (!t || !confirm(`Ștergi tariful valabil din ${fmtDate(t.validFrom)}?`)) return;
      app.state.tariffs = app.state.tariffs.filter((x) => x.id !== t.id);
      persist();
      toast('Tariful a fost șters');
      render();
    },
    'chart-year': (el) => {
      app.ui.chartYear = { ...(app.ui.chartYear || {}), [el.dataset.meter]: Number(el.dataset.year) };
      saveUi();
      render();
    },
    export: () => exportData(),
    import: () => $file.click(),
    'load-seed': () => {
      loadBuiltInSeed();
      toast(`Încărcate: ${plural(app.state.readings.length, 'citire', 'citiri')}`);
      if (location.hash && location.hash !== '#/') location.hash = '#/';
      render();
    },
    'start-fresh': () => {
      app.state = store.starterState();
      persist();
      app.ui.clientId = app.state.clients[0].id;
      saveUi();
      store.requestPersist();
      render();
    },
    wipe: () => {
      if (!confirm('Ștergi toate datele de pe acest dispozitiv? Dacă nu ai un fișier exportat, nu le mai poți recupera.')) return;
      store.clear();
      app.state = null;
      app.openYears.clear();
      location.hash = '#/';
      render();
    },
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || !ACTIONS[el.dataset.action]) return;
    e.preventDefault();
    ACTIONS[el.dataset.action](el, e);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target.closest('tr[data-action]');
    if (el) { e.preventDefault(); el.click(); }
  });

  // Ține minte anii deschiși în istoric (evenimentul toggle nu urcă în DOM, de aceea capture).
  document.addEventListener('toggle', (e) => {
    const key = e.target.dataset && e.target.dataset.yearKey;
    if (!key) return;
    if (e.target.open) app.openYears.add(key);
    else app.openYears.delete(key);
  }, true);

  let toastTimer = null;
  function toast(message, kind = '') {
    $toast.textContent = message;
    $toast.className = `toast show ${kind}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $toast.className = 'toast'; }, kind === 'error' ? 4500 : 2500);
  }

  window.addEventListener('hashchange', () => { closeSheet(); render(); window.scrollTo(0, 0); });

  // Reîmprospătează ferestrele de transmitere când aplicația revine în prim-plan într-o altă zi.
  let renderedDay = today();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && today() !== renderedDay && !$sheet.open) { renderedDay = today(); render(); }
  });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    // Când se instalează o versiune nouă, reîncarcă o dată ca să fie folosită imediat.
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return;
      if ($sheet.open) { toast('Există o versiune nouă a aplicației. Redeschide-o ca să o folosești.'); return; }
      location.reload();
    });
    navigator.serviceWorker.register('./sw.js').catch((e) => console.warn('Service worker neînregistrat', e));
  }

  // Prima deschidere pe un dispozitiv fără citiri: pornește cu citirile incluse.
  if (window.CC.seed && !store.seedApplied() && !store.wasCorrupt() && (!app.state || app.state.readings.length === 0)) {
    loadBuiltInSeed();
  }

  window.CC.ui = { importText, render, app };
  render();
})();
