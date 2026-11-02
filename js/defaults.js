/* Tipuri de contoare și tarife implicite, preluate din facturile din octombrie 2026
   (E.ON gaz, Electrica Furnizare curent, Apă Canal Sibiu apă). Prețurile sunt fără TVA. */
(function (root) {
  'use strict';

  const METER_TYPES = {
    electricity: { label: 'Curent', unit: 'kWh', billedUnit: 'kWh', digits: 6 },
    gas: { label: 'Gaz', unit: 'm³', billedUnit: 'kWh', digits: 5 },
    water: { label: 'Apă', unit: 'm³', billedUnit: 'm³', digits: 5 },
  };

  const SUPPLIERS = {
    electricity: 'Electrica Furnizare',
    gas: 'E.ON Energie România',
    water: 'Apă Canal Sibiu',
  };

  // Perioada lunară în care se transmite indexul (din facturi).
  const WINDOWS = {
    electricity: { startDay: 20, endDay: 24 },
    gas: { startDay: 1, endDay: 7 },
    water: { startDay: 25, endDay: 'end' },
  };

  const electricityComponents = (energy, cogeneration) => [
    ['Energie activă', energy],
    ['Tarif distribuție', 0.35534],
    ['Transport – introducere în rețea', 0.00363],
    ['Transport – extragere din rețea', 0.03645],
    ['Servicii de sistem', 0.0147],
    ['Contribuție cogenerare', cogeneration],
    ['Certificate verzi', 0.0740192],
    ['Contribuție CfD', 0.000144],
    ['Acciză consum necomercial', 0.00768],
  ];

  const EON_SERVICE = { name: 'E.ON ServExpress PRO', amount: 31.4, vat: 21, period: 'month', enabled: true };

  // Fiecare componentă: [denumire, preț lei/unitate fără TVA, cota TVA %].
  const TEMPLATES = {
    electricity: [
      { validFrom: '2026-06-09', vat: 21, note: 'Factura Electrica din 09.10.2026', components: electricityComponents(0.7557, 0.0136), fees: [] },
      { validFrom: '2026-07-01', vat: 21, note: 'Factura Electrica din 09.10.2026', components: electricityComponents(0.79545, 0.0145), fees: [] },
    ],
    gas: [
      {
        validFrom: '2026-09-01', vat: 21, conversionFactor: 10.452, note: 'Factura E.ON din 15.10.2026',
        components: [['Preț furnizare', 0.27039], ['Reducere OUG 12/2026', -0.05289]], fees: [EON_SERVICE],
      },
      {
        validFrom: '2026-10-01', vat: 21, conversionFactor: 10.452, note: 'Factura E.ON din 15.10.2026',
        components: [['Preț furnizare', 0.26667], ['Reducere OUG 12/2026', -0.04357]], fees: [EON_SERVICE],
      },
    ],
    water: [
      {
        validFrom: '2026-09-01', vat: 11, note: 'Factura Apă Canal din 12.10.2026',
        components: [['Apă', 7.81], ['Canal', 5.89]],
        fees: [{ name: 'Prestație contract condominiu', amount: 13.88, vat: 21, period: 'quarter', enabled: true }],
      },
    ],
  };

  function tariffsFor(type, meterId, makeId) {
    return (TEMPLATES[type] || []).map((t) => ({
      id: makeId(),
      meterId,
      validFrom: t.validFrom,
      conversionFactor: t.conversionFactor || null,
      note: t.note || '',
      components: t.components.map(([name, price, vat]) => ({ name, price, vat: vat == null ? t.vat : vat })),
      fees: t.fees.map((f) => ({ ...f })),
    }));
  }

  root.CC = root.CC || {};
  root.CC.defaults = { METER_TYPES, SUPPLIERS, WINDOWS, TEMPLATES, tariffsFor };
})(typeof globalThis !== 'undefined' ? globalThis : this);
