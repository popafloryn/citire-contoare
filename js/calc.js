/* Calcule pure: consum între citiri, alegerea tarifului, costul estimat, ferestre de transmitere.
   Datele sunt șiruri ISO 'YYYY-MM-DD'; intern se lucrează cu numărul zilei (UTC). */
(function (root) {
  'use strict';

  const DAY_MS = 86400000;
  const QUARTER_END_MONTHS = [3, 6, 9, 12];

  const pad = (n) => String(n).padStart(2, '0');

  function dayNum(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
  }

  function isoFromDay(n) {
    return new Date(n * DAY_MS).toISOString().slice(0, 10);
  }

  function isoDate(y, m, d) {
    return `${y}-${pad(m)}-${pad(d)}`;
  }

  function isValidIso(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    return isoFromDay(dayNum(s)) === s;
  }

  function todayIso(now = new Date()) {
    return isoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  function lastDayOfMonth(y, m) {
    return new Date(Date.UTC(y, m, 0)).getUTCDate();
  }

  // Rotunjire la bani, simetrică pentru valori negative (ca pe facturi).
  function round2(x) {
    return (Math.sign(x) * Math.round(Math.abs(x) * 100 + 1e-9)) / 100;
  }

  function round3(x) {
    return Math.round(x * 1000) / 1000;
  }

  function billedIndex(r) {
    if (r.indexSubmitted != null) return r.indexSubmitted;
    return r.indexRead != null ? r.indexRead : null;
  }

  function sortReadings(list) {
    return list
      .map((r, i) => [r, i])
      .sort(([a, i], [b, j]) => (a.date < b.date ? -1 : a.date > b.date ? 1 : i - j))
      .map(([r]) => r);
  }

  function sortTariffs(list) {
    return [...list].sort((a, b) => (a.validFrom < b.validFrom ? -1 : a.validFrom > b.validFrom ? 1 : 0));
  }

  // Versiunea de tarif în vigoare la o dată; înainte de prima versiune se folosește prima.
  function tariffAt(tariffs, iso) {
    const sorted = sortTariffs(tariffs);
    let found = sorted[0] || null;
    for (const t of sorted) if (t.validFrom <= iso) found = t;
    return found;
  }

  // Împarte intervalul de zile [fromDay, toDay] pe versiunile de tarif.
  function tariffSegments(tariffs, fromDay, toDay) {
    const sorted = sortTariffs(tariffs);
    const segments = [];
    sorted.forEach((t, i) => {
      const start = i === 0 ? -Infinity : dayNum(t.validFrom);
      const end = i < sorted.length - 1 ? dayNum(sorted[i + 1].validFrom) - 1 : Infinity;
      const s = Math.max(fromDay, start);
      const e = Math.min(toDay, end);
      if (s <= e) segments.push({ tariff: t, from: s, to: e, days: e - s + 1 });
    });
    const approx = sorted.length > 0 && fromDay < dayNum(sorted[0].validFrom);
    return { segments, approx, earliest: sorted.length ? sorted[0].validFrom : null };
  }

  // Sfârșiturile de lună (sau de trimestru) din intervalul (prevIso, iso].
  function periodEnds(prevIso, iso, period) {
    const from = dayNum(prevIso);
    const to = dayNum(iso);
    let [y, m] = prevIso.split('-').map(Number);
    const out = [];
    for (;;) {
      const endIso = isoDate(y, m, lastDayOfMonth(y, m));
      const end = dayNum(endIso);
      if (end > to) break;
      if (end > from && (period === 'month' || QUARTER_END_MONTHS.includes(m))) out.push(endIso);
      m += 1;
      if (m > 12) { m = 1; y += 1; }
    }
    return out;
  }

  /* Costul estimat pentru `consumption` unități de contor consumate în (prevIso, iso].
     Consumul se împarte proporțional pe zile între versiunile de tarif. La gaz, m³ × Pcs = kWh.
     Taxele fixe se aplică o dată la fiecare sfârșit de lună/trimestru din interval. */
  function estimateCost(tariffs, prevIso, iso, consumption) {
    if (!tariffs || !tariffs.length || prevIso == null || consumption == null) return null;
    const prevDay = dayNum(prevIso);
    const endDay = dayNum(iso);
    const totalDays = endDay - prevDay;
    if (totalDays <= 0) return null;

    const { segments, approx, earliest } = tariffSegments(tariffs, prevDay + 1, endDay);
    const split = segments.length > 1;
    const lines = [];
    let billedQty = 0;

    for (const seg of segments) {
      const t = seg.tariff;
      const factor = t.conversionFactor > 0 ? t.conversionFactor : 1;
      const qty = consumption * (seg.days / totalDays) * factor;
      billedQty += qty;
      for (const c of t.components) {
        const net = round2(qty * c.price);
        lines.push({
          kind: 'unit', name: c.name, qty, price: c.price, vatRate: c.vat,
          net, vat: round2((net * c.vat) / 100),
          from: isoFromDay(seg.from), to: isoFromDay(seg.to), split,
        });
      }
    }

    const feeGroups = new Map();
    for (const period of ['month', 'quarter']) {
      for (const endIso of periodEnds(prevIso, iso, period)) {
        const t = tariffAt(tariffs, endIso);
        for (const f of (t && t.fees) || []) {
          if (!f.enabled || f.period !== period) continue;
          const key = `${f.name}|${f.amount}|${f.vat}|${period}`;
          const g = feeGroups.get(key) || { fee: f, count: 0 };
          g.count += 1;
          feeGroups.set(key, g);
        }
      }
    }
    for (const { fee, count } of feeGroups.values()) {
      const net = round2(fee.amount * count);
      lines.push({
        kind: 'fee', name: fee.name, qty: count, price: fee.amount, vatRate: fee.vat, period: fee.period,
        net, vat: round2((net * fee.vat) / 100),
      });
    }

    const net = round2(lines.reduce((s, l) => s + l.net, 0));
    const vat = round2(lines.reduce((s, l) => s + l.vat, 0));
    const vatByRate = {};
    for (const l of lines) vatByRate[l.vatRate] = round2((vatByRate[l.vatRate] || 0) + l.vat);

    return { lines, net, vat, total: round2(net + vat), vatByRate, approx, approxFrom: earliest, days: totalDays, billedQty: round3(billedQty) };
  }

  /* Istoricul unui contor: pentru fiecare citire, consumul real (după indexul citit),
     consumul facturat (după indexul transmis, altfel cel citit) și costul estimat.
     O citire cu `meterReset` pornește un contor nou: nu are consum față de cea anterioară. */
  function buildHistory(readings, tariffs) {
    const rows = [];
    let lastBilled = null;
    let lastRead = null;
    let started = false;

    for (const r of sortReadings(readings)) {
      const row = {
        reading: r, start: false, consBilled: null, consReal: null,
        billedFrom: null, realFrom: null, days: null, cost: null, warnings: [],
      };
      const billed = billedIndex(r);

      if (!started || r.meterReset) {
        row.start = true;
        started = true;
        lastBilled = null;
        lastRead = null;
      } else {
        if (billed != null && lastBilled) {
          row.consBilled = round3(billed - lastBilled.value);
          row.billedFrom = lastBilled.date;
          row.days = dayNum(r.date) - dayNum(lastBilled.date);
          row.cost = estimateCost(tariffs, lastBilled.date, r.date, row.consBilled);
          if (row.consBilled < 0) row.warnings.push('negative');
        }
        if (r.indexRead != null && lastRead) {
          row.consReal = round3(r.indexRead - lastRead.value);
          row.realFrom = lastRead.date;
          if (row.consReal < 0 && !row.warnings.includes('negative')) row.warnings.push('negative');
        }
      }

      if (billed != null) lastBilled = { value: billed, date: r.date };
      if (r.indexRead != null) lastRead = { value: r.indexRead, date: r.date };
      rows.push(row);
    }
    return rows;
  }

  // Ultimul index citit, ultimul transmis și ultima perioadă cu consum.
  function latestState(rows) {
    if (!rows.length) return null;
    let segmentStart = 0;
    rows.forEach((row, i) => { if (row.start) segmentStart = i; });
    const seg = rows.slice(segmentStart);
    const lastReadRow = [...seg].reverse().find((row) => row.reading.indexRead != null) || null;
    const lastSubmittedRow = [...seg].reverse().find((row) => row.reading.indexSubmitted != null) || null;
    const lastPeriod = [...seg].reverse().find((row) => row.consBilled != null || row.consReal != null) || null;
    const read = lastReadRow ? lastReadRow.reading.indexRead : null;
    const submitted = lastSubmittedRow ? lastSubmittedRow.reading.indexSubmitted : null;
    const advance = read != null && submitted != null ? round3(submitted - read) : null;
    return { last: rows[rows.length - 1], lastReadRow, lastSubmittedRow, lastPeriod, read, submitted, advance };
  }

  /* Consumul (real, altfel facturat) repartizat pe luni, proporțional cu zilele din fiecare lună.
     Întoarce Map 'YYYY-MM' → { value, days } (days = zilele lunii acoperite de citiri). */
  function monthlyConsumption(rows) {
    const byMonth = new Map();
    const add = (key, v, days = 1) => {
      const cur = byMonth.get(key) || { value: 0, days: 0 };
      byMonth.set(key, { value: cur.value + v, days: cur.days + days });
    };
    for (const row of rows) {
      const value = row.consReal != null ? row.consReal : row.consBilled;
      const from = row.consReal != null ? row.realFrom : row.billedFrom;
      if (value == null || from == null) continue;
      const start = dayNum(from) + 1;
      const end = dayNum(row.reading.date);
      if (end < start) { add(row.reading.date.slice(0, 7), value, 0); continue; }
      const perDay = value / (end - start + 1);
      for (let d = start; d <= end; d++) add(isoFromDay(d).slice(0, 7), perDay);
    }
    return byMonth;
  }

  // Rezumat pe ani (după data citirii care închide perioada).
  function yearSummaries(rows) {
    const years = new Map();
    for (const row of rows) {
      const y = Number(row.reading.date.slice(0, 4));
      if (!years.has(y)) years.set(y, { year: y, rows: [], consReal: 0, consBilled: 0, cost: 0, days: 0, approx: false, hasCost: false });
      const s = years.get(y);
      s.rows.push(row);
      if (row.consReal != null) s.consReal = round3(s.consReal + row.consReal);
      if (row.consBilled != null) {
        s.consBilled = round3(s.consBilled + row.consBilled);
        s.days += row.days || 0;
      }
      if (row.cost) {
        s.cost = round2(s.cost + row.cost.total);
        s.hasCost = true;
        if (row.cost.approx) s.approx = true;
      }
    }
    for (const s of years.values()) {
      const base = s.consReal || s.consBilled;
      s.perMonth = s.days > 0 ? (base / s.days) * 30.4375 : null;
    }
    return [...years.values()].sort((a, b) => b.year - a.year);
  }

  function windowFor(y, m, w) {
    const last = lastDayOfMonth(y, m);
    const s = Math.min(w.startDay, last);
    const e = w.endDay === 'end' ? last : Math.min(w.endDay, last);
    return { start: isoDate(y, m, s), end: isoDate(y, m, e) };
  }

  /* Starea ferestrei de transmitere față de azi:
     'open' (deschisă, netransmis), 'done' (transmis în fereastra curentă), 'upcoming' (următoarea). */
  function windowStatus(w, readings, today) {
    if (!w || !w.startDay) return null;
    const t = dayNum(today);
    const [y, m] = today.split('-').map(Number);
    const inWindow = (win) => sortReadings(readings).reverse().find((r) => r.date >= win.start && r.date <= win.end) || null;
    const cur = windowFor(y, m, w);

    if (t >= dayNum(cur.start) && t <= dayNum(cur.end)) {
      const done = inWindow(cur);
      return { state: done ? 'done' : 'open', ...cur, today, daysLeft: dayNum(cur.end) - t, reading: done };
    }
    const next = t > dayNum(cur.end) ? windowFor(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1, w) : cur;
    const prev = t > dayNum(cur.end) ? cur : windowFor(m === 1 ? y - 1 : y, m === 1 ? 12 : m - 1, w);
    return { state: 'upcoming', ...next, today, daysUntil: dayNum(next.start) - t, reading: inWindow(prev) };
  }

  root.CC = root.CC || {};
  root.CC.calc = {
    dayNum, isoFromDay, isValidIso, todayIso, lastDayOfMonth, round2, round3,
    billedIndex, sortReadings, sortTariffs, tariffAt, tariffSegments, periodEnds,
    estimateCost, buildHistory, latestState, monthlyConsumption, yearSummaries, windowStatus,
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
