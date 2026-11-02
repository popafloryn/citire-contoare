/* Citirile inițiale, generate din „Citire contoare.txt” de tools/build-seed.mjs.
   Fără coduri de client, serii de contor sau adrese. Se încarcă la prima deschidere a aplicației. */
(function (root) {
  'use strict';
  root.CC = root.CC || {};
  root.CC.seed = {
    "schemaVersion": 1,
    "clients": [
      {
        "id": "c-eu",
        "name": "Eu"
      },
      {
        "id": "c-mama",
        "name": "Mama"
      }
    ],
    "meters": [
      {
        "id": "m-eu-curent",
        "clientId": "c-eu",
        "type": "electricity",
        "name": "Curent",
        "unit": "kWh",
        "supplier": "Electrica Furnizare",
        "serial": "",
        "clientCode": "",
        "notes": "",
        "window": {
          "startDay": 20,
          "endDay": 24
        }
      },
      {
        "id": "m-eu-gaz",
        "clientId": "c-eu",
        "type": "gas",
        "name": "Gaz",
        "unit": "m³",
        "supplier": "E.ON Energie România",
        "serial": "",
        "clientCode": "",
        "notes": "",
        "window": {
          "startDay": 1,
          "endDay": 7
        }
      },
      {
        "id": "m-eu-apa",
        "clientId": "c-eu",
        "type": "water",
        "name": "Apă",
        "unit": "m³",
        "supplier": "Apă Canal Sibiu",
        "serial": "",
        "clientCode": "",
        "notes": "",
        "window": {
          "startDay": 25,
          "endDay": "end"
        }
      },
      {
        "id": "m-mama-gaz",
        "clientId": "c-mama",
        "type": "gas",
        "name": "Gaz",
        "unit": "m³",
        "supplier": "E.ON Energie România",
        "serial": "",
        "clientCode": "",
        "notes": "Tarif copiat de la contorul tău de gaz; verifică-l pe o factură a mamei.",
        "window": {
          "startDay": 20,
          "endDay": 22
        }
      },
      {
        "id": "m-mama-curent",
        "clientId": "c-mama",
        "type": "electricity",
        "name": "Curent",
        "unit": "kWh",
        "supplier": "Electrica Furnizare",
        "serial": "",
        "clientCode": "",
        "notes": "Tarif copiat de la contorul tău de curent; verifică-l pe o factură a mamei.",
        "window": {
          "startDay": 20,
          "endDay": 24
        }
      }
    ],
    "readings": [
      {
        "id": "r-eu-curent-004",
        "meterId": "m-eu-curent",
        "date": "2022-02-23",
        "indexRead": 18250,
        "indexSubmitted": null,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-005",
        "meterId": "m-eu-curent",
        "date": "2022-11-21",
        "indexRead": 20057,
        "indexSubmitted": 20060,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-006",
        "meterId": "m-eu-curent",
        "date": "2022-12-20",
        "indexRead": 20270,
        "indexSubmitted": 20280,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "Data lipsește în fișier; estimată între 21.11.2022 și 19.01.2023.",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-007",
        "meterId": "m-eu-curent",
        "date": "2023-01-19",
        "indexRead": 20506,
        "indexSubmitted": 20510,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-008",
        "meterId": "m-eu-curent",
        "date": "2023-02-19",
        "indexRead": 20760,
        "indexSubmitted": 20760,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-009",
        "meterId": "m-eu-curent",
        "date": "2023-03-19",
        "indexRead": 20976,
        "indexSubmitted": 20980,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-010",
        "meterId": "m-eu-curent",
        "date": "2023-04-19",
        "indexRead": 21197,
        "indexSubmitted": 21200,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-011",
        "meterId": "m-eu-curent",
        "date": "2023-05-19",
        "indexRead": 21413,
        "indexSubmitted": 21415,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-012",
        "meterId": "m-eu-curent",
        "date": "2023-06-19",
        "indexRead": 21615,
        "indexSubmitted": 21615,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-013",
        "meterId": "m-eu-curent",
        "date": "2023-07-19",
        "indexRead": 21828,
        "indexSubmitted": 21830,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-014",
        "meterId": "m-eu-curent",
        "date": "2023-09-24",
        "indexRead": 22271,
        "indexSubmitted": 22275,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-015",
        "meterId": "m-eu-curent",
        "date": "2023-10-24",
        "indexRead": 22484,
        "indexSubmitted": 22500,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-016",
        "meterId": "m-eu-curent",
        "date": "2023-11-24",
        "indexRead": 22678,
        "indexSubmitted": 22680,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-017",
        "meterId": "m-eu-curent",
        "date": "2023-12-24",
        "indexRead": 22912,
        "indexSubmitted": null,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "au schimbat termenul pe 20",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-018",
        "meterId": "m-eu-curent",
        "date": "2024-02-21",
        "indexRead": 23412,
        "indexSubmitted": 23415,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-019",
        "meterId": "m-eu-curent",
        "date": "2024-03-25",
        "indexRead": 23681,
        "indexSubmitted": 23660,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-020",
        "meterId": "m-eu-curent",
        "date": "2024-04-24",
        "indexRead": 23893,
        "indexSubmitted": 23900,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-021",
        "meterId": "m-eu-curent",
        "date": "2024-05-24",
        "indexRead": 24092,
        "indexSubmitted": 24100,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-022",
        "meterId": "m-eu-curent",
        "date": "2024-06-24",
        "indexRead": 24288,
        "indexSubmitted": 24300,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-023",
        "meterId": "m-eu-curent",
        "date": "2024-07-24",
        "indexRead": 24477,
        "indexSubmitted": 24490,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-024",
        "meterId": "m-eu-curent",
        "date": "2024-09-24",
        "indexRead": 24826,
        "indexSubmitted": 24830,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-025",
        "meterId": "m-eu-curent",
        "date": "2024-11-24",
        "indexRead": 25347,
        "indexSubmitted": 25350,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-026",
        "meterId": "m-eu-curent",
        "date": "2024-12-24",
        "indexRead": 25636,
        "indexSubmitted": 25640,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-027",
        "meterId": "m-eu-curent",
        "date": "2025-01-24",
        "indexRead": 25900,
        "indexSubmitted": 25900,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-028",
        "meterId": "m-eu-curent",
        "date": "2025-02-21",
        "indexRead": 26168,
        "indexSubmitted": 26170,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-029",
        "meterId": "m-eu-curent",
        "date": "2025-03-24",
        "indexRead": 26438,
        "indexSubmitted": 26450,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-030",
        "meterId": "m-eu-curent",
        "date": "2025-05-24",
        "indexRead": 26919,
        "indexSubmitted": 26920,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-031",
        "meterId": "m-eu-curent",
        "date": "2025-06-24",
        "indexRead": 27122,
        "indexSubmitted": null,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "Netransmis.",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-032",
        "meterId": "m-eu-curent",
        "date": "2025-07-24",
        "indexRead": 27321,
        "indexSubmitted": 27325,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-033",
        "meterId": "m-eu-curent",
        "date": "2025-08-24",
        "indexRead": 27486,
        "indexSubmitted": 27490,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-034",
        "meterId": "m-eu-curent",
        "date": "2025-10-24",
        "indexRead": 27950,
        "indexSubmitted": 27950,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-035",
        "meterId": "m-eu-curent",
        "date": "2025-11-23",
        "indexRead": 28168,
        "indexSubmitted": 28170,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-036",
        "meterId": "m-eu-curent",
        "date": "2025-12-24",
        "indexRead": 28429,
        "indexSubmitted": 28430,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-037",
        "meterId": "m-eu-curent",
        "date": "2026-01-24",
        "indexRead": 28729,
        "indexSubmitted": 28730,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-038",
        "meterId": "m-eu-curent",
        "date": "2026-02-21",
        "indexRead": 28974,
        "indexSubmitted": 28980,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-039",
        "meterId": "m-eu-curent",
        "date": "2026-03-24",
        "indexRead": 29128,
        "indexSubmitted": 29150,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-040",
        "meterId": "m-eu-curent",
        "date": "2026-04-23",
        "indexRead": 29472,
        "indexSubmitted": 29475,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-041",
        "meterId": "m-eu-curent",
        "date": "2026-05-24",
        "indexRead": 29719,
        "indexSubmitted": 29720,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-042",
        "meterId": "m-eu-curent",
        "date": "2026-06-23",
        "indexRead": 29929,
        "indexSubmitted": 29930,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-043",
        "meterId": "m-eu-curent",
        "date": "2026-07-24",
        "indexRead": 30164,
        "indexSubmitted": 30170,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-044",
        "meterId": "m-eu-curent",
        "date": "2026-08-24",
        "indexRead": 30387,
        "indexSubmitted": 30400,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-045",
        "meterId": "m-eu-curent",
        "date": "2026-09-23",
        "indexRead": 30467,
        "indexSubmitted": 30470,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-curent-046",
        "meterId": "m-eu-curent",
        "date": "2026-10-24",
        "indexRead": 30490,
        "indexSubmitted": 30490,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-049",
        "meterId": "m-eu-gaz",
        "date": "2022-12-07",
        "indexRead": 4154,
        "indexSubmitted": 4260,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-050",
        "meterId": "m-eu-gaz",
        "date": "2023-01-07",
        "indexRead": 4347,
        "indexSubmitted": 4450,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "citit de către autorități 4324",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-051",
        "meterId": "m-eu-gaz",
        "date": "2023-03-07",
        "indexRead": 4748,
        "indexSubmitted": 4750,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-052",
        "meterId": "m-eu-gaz",
        "date": "2023-04-07",
        "indexRead": 4912,
        "indexSubmitted": 4915,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "citit de către autorități",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-053",
        "meterId": "m-eu-gaz",
        "date": "2023-06-07",
        "indexRead": 5079,
        "indexSubmitted": 5080,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "În fișier: 4079 (introdus 4080); corectat la 5079/5080, între 4912 și 5111.",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-054",
        "meterId": "m-eu-gaz",
        "date": "2023-07-07",
        "indexRead": 5111,
        "indexSubmitted": 5110,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-055",
        "meterId": "m-eu-gaz",
        "date": "2023-08-07",
        "indexRead": 5140,
        "indexSubmitted": 5140,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-056",
        "meterId": "m-eu-gaz",
        "date": "2023-09-07",
        "indexRead": 5159,
        "indexSubmitted": 5260,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-057",
        "meterId": "m-eu-gaz",
        "date": "2023-11-07",
        "indexRead": 5216,
        "indexSubmitted": 5300,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-058",
        "meterId": "m-eu-gaz",
        "date": "2023-12-07",
        "indexRead": 5359,
        "indexSubmitted": 5530,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-059",
        "meterId": "m-eu-gaz",
        "date": "2024-01-07",
        "indexRead": 5522,
        "indexSubmitted": 5630,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-060",
        "meterId": "m-eu-gaz",
        "date": "2024-02-07",
        "indexRead": 5702,
        "indexSubmitted": 5710,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-061",
        "meterId": "m-eu-gaz",
        "date": "2024-03-07",
        "indexRead": 5813,
        "indexSubmitted": 5820,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-062",
        "meterId": "m-eu-gaz",
        "date": "2024-04-07",
        "indexRead": 5910,
        "indexSubmitted": 5910,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-063",
        "meterId": "m-eu-gaz",
        "date": "2024-05-07",
        "indexRead": 5965,
        "indexSubmitted": 5970,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-064",
        "meterId": "m-eu-gaz",
        "date": "2024-06-07",
        "indexRead": 5994,
        "indexSubmitted": 6000,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-065",
        "meterId": "m-eu-gaz",
        "date": "2024-09-07",
        "indexRead": 6037,
        "indexSubmitted": 6040,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-066",
        "meterId": "m-eu-gaz",
        "date": "2024-10-07",
        "indexRead": 6053,
        "indexSubmitted": 6060,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-067",
        "meterId": "m-eu-gaz",
        "date": "2024-11-07",
        "indexRead": 6122,
        "indexSubmitted": 6125,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-068",
        "meterId": "m-eu-gaz",
        "date": "2024-12-07",
        "indexRead": 6268,
        "indexSubmitted": 6300,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-069",
        "meterId": "m-eu-gaz",
        "date": "2025-02-07",
        "indexRead": 6629,
        "indexSubmitted": 6630,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-070",
        "meterId": "m-eu-gaz",
        "date": "2025-03-07",
        "indexRead": 6784,
        "indexSubmitted": 6790,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-071",
        "meterId": "m-eu-gaz",
        "date": "2025-04-07",
        "indexRead": 6895,
        "indexSubmitted": 6900,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-072",
        "meterId": "m-eu-gaz",
        "date": "2025-05-07",
        "indexRead": 6947,
        "indexSubmitted": 6950,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-073",
        "meterId": "m-eu-gaz",
        "date": "2025-06-07",
        "indexRead": 6995,
        "indexSubmitted": 7000,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-074",
        "meterId": "m-eu-gaz",
        "date": "2025-08-07",
        "indexRead": 7021,
        "indexSubmitted": 7025,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-075",
        "meterId": "m-eu-gaz",
        "date": "2025-09-07",
        "indexRead": 7032,
        "indexSubmitted": 7035,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-076",
        "meterId": "m-eu-gaz",
        "date": "2025-10-07",
        "indexRead": 7068,
        "indexSubmitted": 7070,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-077",
        "meterId": "m-eu-gaz",
        "date": "2025-12-07",
        "indexRead": 7228,
        "indexSubmitted": 7230,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-078",
        "meterId": "m-eu-gaz",
        "date": "2026-01-07",
        "indexRead": 7369,
        "indexSubmitted": 7370,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-079",
        "meterId": "m-eu-gaz",
        "date": "2026-02-07",
        "indexRead": 7527,
        "indexSubmitted": 7530,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-080",
        "meterId": "m-eu-gaz",
        "date": "2026-04-07",
        "indexRead": 7725,
        "indexSubmitted": 7725,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-081",
        "meterId": "m-eu-gaz",
        "date": "2026-06-07",
        "indexRead": 7808,
        "indexSubmitted": 7810,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-082",
        "meterId": "m-eu-gaz",
        "date": "2026-07-07",
        "indexRead": 7822,
        "indexSubmitted": 7825,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-083",
        "meterId": "m-eu-gaz",
        "date": "2026-08-07",
        "indexRead": 7839,
        "indexSubmitted": 7840,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-084",
        "meterId": "m-eu-gaz",
        "date": "2026-09-07",
        "indexRead": 7853,
        "indexSubmitted": 7860,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-gaz-085",
        "meterId": "m-eu-gaz",
        "date": "2026-10-07",
        "indexRead": 7872,
        "indexSubmitted": 7875,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-088",
        "meterId": "m-eu-apa",
        "date": "2022-12-30",
        "indexRead": 1235,
        "indexSubmitted": 1235,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-089",
        "meterId": "m-eu-apa",
        "date": "2023-02-28",
        "indexRead": 1253,
        "indexSubmitted": 1253,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-090",
        "meterId": "m-eu-apa",
        "date": "2023-03-31",
        "indexRead": 1265,
        "indexSubmitted": 1265,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-091",
        "meterId": "m-eu-apa",
        "date": "2023-04-30",
        "indexRead": 1274,
        "indexSubmitted": 1274,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-092",
        "meterId": "m-eu-apa",
        "date": "2023-05-31",
        "indexRead": 1308,
        "indexSubmitted": 1308,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-093",
        "meterId": "m-eu-apa",
        "date": "2023-06-30",
        "indexRead": 1343,
        "indexSubmitted": 1343,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-094",
        "meterId": "m-eu-apa",
        "date": "2023-07-31",
        "indexRead": 1382,
        "indexSubmitted": 1382,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-095",
        "meterId": "m-eu-apa",
        "date": "2023-08-31",
        "indexRead": 1411,
        "indexSubmitted": 1411,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-096",
        "meterId": "m-eu-apa",
        "date": "2023-09-30",
        "indexRead": 1423,
        "indexSubmitted": 1423,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-097",
        "meterId": "m-eu-apa",
        "date": "2023-10-31",
        "indexRead": 1440,
        "indexSubmitted": 1440,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-098",
        "meterId": "m-eu-apa",
        "date": "2023-11-30",
        "indexRead": 1451,
        "indexSubmitted": 1451,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "În fișier: 31.11.2023 (dată inexistentă).",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-099",
        "meterId": "m-eu-apa",
        "date": "2023-12-31",
        "indexRead": 1463,
        "indexSubmitted": 1463,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-100",
        "meterId": "m-eu-apa",
        "date": "2024-01-31",
        "indexRead": 1475,
        "indexSubmitted": 1475,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-101",
        "meterId": "m-eu-apa",
        "date": "2024-02-29",
        "indexRead": 1487,
        "indexSubmitted": 1487,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-102",
        "meterId": "m-eu-apa",
        "date": "2024-04-30",
        "indexRead": 1526,
        "indexSubmitted": 1526,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-103",
        "meterId": "m-eu-apa",
        "date": "2024-05-31",
        "indexRead": 1546,
        "indexSubmitted": 1546,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-104",
        "meterId": "m-eu-apa",
        "date": "2024-07-31",
        "indexRead": 1595,
        "indexSubmitted": 1595,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-105",
        "meterId": "m-eu-apa",
        "date": "2024-08-31",
        "indexRead": 1620,
        "indexSubmitted": 1620,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-106",
        "meterId": "m-eu-apa",
        "date": "2024-09-30",
        "indexRead": 1636,
        "indexSubmitted": 1636,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-107",
        "meterId": "m-eu-apa",
        "date": "2024-10-31",
        "indexRead": 1657,
        "indexSubmitted": 1657,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-108",
        "meterId": "m-eu-apa",
        "date": "2024-11-30",
        "indexRead": 1670,
        "indexSubmitted": 1670,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-109",
        "meterId": "m-eu-apa",
        "date": "2024-12-31",
        "indexRead": 1683,
        "indexSubmitted": 1683,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-110",
        "meterId": "m-eu-apa",
        "date": "2025-01-31",
        "indexRead": 1694,
        "indexSubmitted": 1694,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-111",
        "meterId": "m-eu-apa",
        "date": "2025-02-28",
        "indexRead": 1704,
        "indexSubmitted": 1704,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "În fișier: 28.02.025.",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-112",
        "meterId": "m-eu-apa",
        "date": "2025-03-31",
        "indexRead": 1716,
        "indexSubmitted": 1716,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-113",
        "meterId": "m-eu-apa",
        "date": "2025-04-30",
        "indexRead": 1728,
        "indexSubmitted": 1728,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-114",
        "meterId": "m-eu-apa",
        "date": "2025-05-31",
        "indexRead": 1743,
        "indexSubmitted": 1743,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-115",
        "meterId": "m-eu-apa",
        "date": "2025-06-30",
        "indexRead": 1777,
        "indexSubmitted": 1777,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-116",
        "meterId": "m-eu-apa",
        "date": "2025-07-31",
        "indexRead": 1812,
        "indexSubmitted": 1812,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-117",
        "meterId": "m-eu-apa",
        "date": "2025-08-31",
        "indexRead": 1825,
        "indexSubmitted": 1825,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-118",
        "meterId": "m-eu-apa",
        "date": "2025-09-30",
        "indexRead": 1841,
        "indexSubmitted": 1841,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-119",
        "meterId": "m-eu-apa",
        "date": "2025-10-31",
        "indexRead": 1851,
        "indexSubmitted": 1851,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-120",
        "meterId": "m-eu-apa",
        "date": "2025-11-30",
        "indexRead": 1861,
        "indexSubmitted": 1861,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "În fișier: 30.10.2025, după citirea din 31.10.2025.",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-121",
        "meterId": "m-eu-apa",
        "date": "2026-02-28",
        "indexRead": 1893,
        "indexSubmitted": 1893,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-122",
        "meterId": "m-eu-apa",
        "date": "2026-03-31",
        "indexRead": 1902,
        "indexSubmitted": 1902,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-123",
        "meterId": "m-eu-apa",
        "date": "2026-05-31",
        "indexRead": 1933,
        "indexSubmitted": 1933,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-124",
        "meterId": "m-eu-apa",
        "date": "2026-06-30",
        "indexRead": 1951,
        "indexSubmitted": 1951,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "În fișier: 30.07.2026, înainte de citirea din 31.07.2026.",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-125",
        "meterId": "m-eu-apa",
        "date": "2026-07-31",
        "indexRead": 1965,
        "indexSubmitted": 1965,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-126",
        "meterId": "m-eu-apa",
        "date": "2026-08-31",
        "indexRead": 1977,
        "indexSubmitted": 1977,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-127",
        "meterId": "m-eu-apa",
        "date": "2026-09-30",
        "indexRead": 1991,
        "indexSubmitted": 1991,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-eu-apa-128",
        "meterId": "m-eu-apa",
        "date": "2026-10-31",
        "indexRead": 2004,
        "indexSubmitted": 2004,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-133",
        "meterId": "m-mama-gaz",
        "date": "2022-11-21",
        "indexRead": 6775,
        "indexSubmitted": 6860,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-134",
        "meterId": "m-mama-gaz",
        "date": "2022-12-21",
        "indexRead": 6968,
        "indexSubmitted": 7100,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "de plată 240 mc",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-135",
        "meterId": "m-mama-gaz",
        "date": "2023-02-21",
        "indexRead": 7416,
        "indexSubmitted": 7420,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-136",
        "meterId": "m-mama-gaz",
        "date": "2023-03-21",
        "indexRead": 7559,
        "indexSubmitted": 7560,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-137",
        "meterId": "m-mama-gaz",
        "date": "2023-04-21",
        "indexRead": 7686,
        "indexSubmitted": 7690,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-138",
        "meterId": "m-mama-gaz",
        "date": "2023-05-21",
        "indexRead": 7741,
        "indexSubmitted": 7750,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-139",
        "meterId": "m-mama-gaz",
        "date": "2023-06-21",
        "indexRead": 7755,
        "indexSubmitted": 7760,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-140",
        "meterId": "m-mama-gaz",
        "date": "2023-07-21",
        "indexRead": 7763,
        "indexSubmitted": 7770,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-141",
        "meterId": "m-mama-gaz",
        "date": "2023-08-21",
        "indexRead": 7777,
        "indexSubmitted": 7780,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-142",
        "meterId": "m-mama-gaz",
        "date": "2023-09-21",
        "indexRead": 7788,
        "indexSubmitted": 7790,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-143",
        "meterId": "m-mama-gaz",
        "date": "2023-10-21",
        "indexRead": 7796,
        "indexSubmitted": 7800,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-144",
        "meterId": "m-mama-gaz",
        "date": "2023-11-21",
        "indexRead": 7860,
        "indexSubmitted": 7860,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-145",
        "meterId": "m-mama-gaz",
        "date": "2023-12-21",
        "indexRead": 8020,
        "indexSubmitted": 8020,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-146",
        "meterId": "m-mama-gaz",
        "date": "2024-01-21",
        "indexRead": 8222,
        "indexSubmitted": 8225,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-147",
        "meterId": "m-mama-gaz",
        "date": "2024-02-21",
        "indexRead": 8400,
        "indexSubmitted": 8400,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "În fișier: 21.02.2924.",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-148",
        "meterId": "m-mama-gaz",
        "date": "2024-03-21",
        "indexRead": 8505,
        "indexSubmitted": 8510,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-149",
        "meterId": "m-mama-gaz",
        "date": "2024-04-21",
        "indexRead": 8552,
        "indexSubmitted": 8555,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-150",
        "meterId": "m-mama-gaz",
        "date": "2024-05-21",
        "indexRead": 8590,
        "indexSubmitted": 8600,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-151",
        "meterId": "m-mama-gaz",
        "date": "2024-06-21",
        "indexRead": 8601,
        "indexSubmitted": 8610,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-152",
        "meterId": "m-mama-gaz",
        "date": "2024-07-21",
        "indexRead": 8613,
        "indexSubmitted": 8620,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-153",
        "meterId": "m-mama-gaz",
        "date": "2024-08-21",
        "indexRead": 8618,
        "indexSubmitted": 8630,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "În fișier: 21.07.2024 (a doua oară).",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-154",
        "meterId": "m-mama-gaz",
        "date": "2024-09-21",
        "indexRead": 8625,
        "indexSubmitted": 8640,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "În fișier: 21.09.204.",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-155",
        "meterId": "m-mama-gaz",
        "date": "2024-10-21",
        "indexRead": 8644,
        "indexSubmitted": 8650,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-156",
        "meterId": "m-mama-gaz",
        "date": "2024-11-21",
        "indexRead": 8757,
        "indexSubmitted": 8760,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-157",
        "meterId": "m-mama-gaz",
        "date": "2024-12-21",
        "indexRead": 8928,
        "indexSubmitted": 8930,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-158",
        "meterId": "m-mama-gaz",
        "date": "2025-01-21",
        "indexRead": 9143,
        "indexSubmitted": 9150,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-159",
        "meterId": "m-mama-gaz",
        "date": "2025-02-21",
        "indexRead": 9343,
        "indexSubmitted": 9350,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-160",
        "meterId": "m-mama-gaz",
        "date": "2025-03-21",
        "indexRead": 9486,
        "indexSubmitted": 9490,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-161",
        "meterId": "m-mama-gaz",
        "date": "2025-04-21",
        "indexRead": 9595,
        "indexSubmitted": 9600,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-162",
        "meterId": "m-mama-gaz",
        "date": "2025-05-21",
        "indexRead": 9633,
        "indexSubmitted": 9635,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-163",
        "meterId": "m-mama-gaz",
        "date": "2025-06-21",
        "indexRead": 9655,
        "indexSubmitted": 9660,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-164",
        "meterId": "m-mama-gaz",
        "date": "2025-07-21",
        "indexRead": 9664,
        "indexSubmitted": 9670,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-165",
        "meterId": "m-mama-gaz",
        "date": "2025-08-21",
        "indexRead": 9674,
        "indexSubmitted": 9680,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-166",
        "meterId": "m-mama-gaz",
        "date": "2025-09-21",
        "indexRead": 9684,
        "indexSubmitted": 9690,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-167",
        "meterId": "m-mama-gaz",
        "date": "2025-10-21",
        "indexRead": 9727,
        "indexSubmitted": 9730,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-168",
        "meterId": "m-mama-gaz",
        "date": "2025-11-21",
        "indexRead": 9829,
        "indexSubmitted": 9830,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-169",
        "meterId": "m-mama-gaz",
        "date": "2025-12-21",
        "indexRead": 811,
        "indexSubmitted": 815,
        "source": "autocitire",
        "meterReset": true,
        "uncertain": true,
        "note": "Indexul scade de la 9829 la 811: contor înlocuit (presupus).",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-170",
        "meterId": "m-mama-gaz",
        "date": "2026-01-21",
        "indexRead": 1088,
        "indexSubmitted": 1090,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-171",
        "meterId": "m-mama-gaz",
        "date": "2026-02-21",
        "indexRead": 1296,
        "indexSubmitted": 1300,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-172",
        "meterId": "m-mama-gaz",
        "date": "2026-03-21",
        "indexRead": 1436,
        "indexSubmitted": 1440,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-173",
        "meterId": "m-mama-gaz",
        "date": "2026-04-21",
        "indexRead": 1545,
        "indexSubmitted": 1545,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-174",
        "meterId": "m-mama-gaz",
        "date": "2026-05-21",
        "indexRead": 1587,
        "indexSubmitted": 1590,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-175",
        "meterId": "m-mama-gaz",
        "date": "2026-06-21",
        "indexRead": 1592,
        "indexSubmitted": 1600,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-176",
        "meterId": "m-mama-gaz",
        "date": "2026-07-21",
        "indexRead": 1599,
        "indexSubmitted": 1610,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-177",
        "meterId": "m-mama-gaz",
        "date": "2026-08-21",
        "indexRead": 1610,
        "indexSubmitted": 1620,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-178",
        "meterId": "m-mama-gaz",
        "date": "2026-09-21",
        "indexRead": 1618,
        "indexSubmitted": 1625,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-gaz-179",
        "meterId": "m-mama-gaz",
        "date": "2026-10-21",
        "indexRead": 1650,
        "indexSubmitted": 1650,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-183",
        "meterId": "m-mama-curent",
        "date": "2022-12-01",
        "indexRead": 1637,
        "indexSubmitted": 1650,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-184",
        "meterId": "m-mama-curent",
        "date": "2023-01-02",
        "indexRead": 1734,
        "indexSubmitted": 1750,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-185",
        "meterId": "m-mama-curent",
        "date": "2023-03-01",
        "indexRead": 1914,
        "indexSubmitted": 1920,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-186",
        "meterId": "m-mama-curent",
        "date": "2023-04-01",
        "indexRead": 2002,
        "indexSubmitted": 2005,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "În fișier: 01.03.2023 (a doua oară); ritmul de ~85 kWh/lună indică 01.04.2023.",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-187",
        "meterId": "m-mama-curent",
        "date": "2023-05-01",
        "indexRead": 2088,
        "indexSubmitted": 2090,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-188",
        "meterId": "m-mama-curent",
        "date": "2023-06-01",
        "indexRead": 2170,
        "indexSubmitted": 2170,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": true,
        "note": "În fișier: 01.06.2024, într-o serie din 2023.",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-189",
        "meterId": "m-mama-curent",
        "date": "2023-07-01",
        "indexRead": null,
        "indexSubmitted": 2250,
        "source": "estimat",
        "meterReset": false,
        "uncertain": false,
        "note": "Fără citire; transmis estimat (+80 kWh).",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-190",
        "meterId": "m-mama-curent",
        "date": "2023-08-01",
        "indexRead": 2342,
        "indexSubmitted": 2345,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-191",
        "meterId": "m-mama-curent",
        "date": "2023-09-01",
        "indexRead": 2433,
        "indexSubmitted": 2435,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-192",
        "meterId": "m-mama-curent",
        "date": "2023-10-01",
        "indexRead": 2517,
        "indexSubmitted": 2520,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-193",
        "meterId": "m-mama-curent",
        "date": "2023-11-01",
        "indexRead": 2590,
        "indexSubmitted": 2600,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-194",
        "meterId": "m-mama-curent",
        "date": "2023-12-01",
        "indexRead": 2684,
        "indexSubmitted": 2690,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-195",
        "meterId": "m-mama-curent",
        "date": "2024-01-04",
        "indexRead": 2779,
        "indexSubmitted": 2780,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-196",
        "meterId": "m-mama-curent",
        "date": "2024-02-04",
        "indexRead": 2876,
        "indexSubmitted": null,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "Netransmis: site-ul furnizorului era în lucru.",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-197",
        "meterId": "m-mama-curent",
        "date": "2024-02-21",
        "indexRead": 2925,
        "indexSubmitted": 2925,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-198",
        "meterId": "m-mama-curent",
        "date": "2024-03-25",
        "indexRead": 3016,
        "indexSubmitted": 3020,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-199",
        "meterId": "m-mama-curent",
        "date": "2024-04-24",
        "indexRead": 3099,
        "indexSubmitted": 3100,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-200",
        "meterId": "m-mama-curent",
        "date": "2024-05-24",
        "indexRead": 3177,
        "indexSubmitted": 3180,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-201",
        "meterId": "m-mama-curent",
        "date": "2024-06-24",
        "indexRead": 3262,
        "indexSubmitted": 3270,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-202",
        "meterId": "m-mama-curent",
        "date": "2024-07-24",
        "indexRead": 3359,
        "indexSubmitted": 3360,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-203",
        "meterId": "m-mama-curent",
        "date": "2024-09-24",
        "indexRead": 3537,
        "indexSubmitted": 3560,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-204",
        "meterId": "m-mama-curent",
        "date": "2024-10-24",
        "indexRead": 3612,
        "indexSubmitted": 3620,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-205",
        "meterId": "m-mama-curent",
        "date": "2024-11-24",
        "indexRead": 3705,
        "indexSubmitted": 3710,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-206",
        "meterId": "m-mama-curent",
        "date": "2024-12-24",
        "indexRead": 3805,
        "indexSubmitted": 3810,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-207",
        "meterId": "m-mama-curent",
        "date": "2025-01-24",
        "indexRead": 3918,
        "indexSubmitted": 3920,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-208",
        "meterId": "m-mama-curent",
        "date": "2025-02-21",
        "indexRead": 4011,
        "indexSubmitted": 4020,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-209",
        "meterId": "m-mama-curent",
        "date": "2025-03-24",
        "indexRead": 4110,
        "indexSubmitted": 4110,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-210",
        "meterId": "m-mama-curent",
        "date": "2025-07-24",
        "indexRead": 4469,
        "indexSubmitted": 4470,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-211",
        "meterId": "m-mama-curent",
        "date": "2025-08-24",
        "indexRead": 4571,
        "indexSubmitted": 4575,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-212",
        "meterId": "m-mama-curent",
        "date": "2025-10-24",
        "indexRead": 4752,
        "indexSubmitted": 4755,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-213",
        "meterId": "m-mama-curent",
        "date": "2025-11-23",
        "indexRead": 4849,
        "indexSubmitted": 4850,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-214",
        "meterId": "m-mama-curent",
        "date": "2025-12-23",
        "indexRead": 4959,
        "indexSubmitted": 4960,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-215",
        "meterId": "m-mama-curent",
        "date": "2026-01-24",
        "indexRead": 5084,
        "indexSubmitted": 5085,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-216",
        "meterId": "m-mama-curent",
        "date": "2026-02-21",
        "indexRead": 5178,
        "indexSubmitted": 5180,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-217",
        "meterId": "m-mama-curent",
        "date": "2026-03-21",
        "indexRead": 5276,
        "indexSubmitted": 5280,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-218",
        "meterId": "m-mama-curent",
        "date": "2026-04-23",
        "indexRead": 5366,
        "indexSubmitted": 5370,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-219",
        "meterId": "m-mama-curent",
        "date": "2026-05-24",
        "indexRead": 5445,
        "indexSubmitted": 5450,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-220",
        "meterId": "m-mama-curent",
        "date": "2026-06-23",
        "indexRead": 5530,
        "indexSubmitted": 5530,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-221",
        "meterId": "m-mama-curent",
        "date": "2026-07-23",
        "indexRead": 5620,
        "indexSubmitted": 5620,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-222",
        "meterId": "m-mama-curent",
        "date": "2026-08-24",
        "indexRead": 5726,
        "indexSubmitted": 5730,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-223",
        "meterId": "m-mama-curent",
        "date": "2026-09-23",
        "indexRead": 5830,
        "indexSubmitted": 5830,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      },
      {
        "id": "r-mama-curent-224",
        "meterId": "m-mama-curent",
        "date": "2026-10-24",
        "indexRead": 5915,
        "indexSubmitted": 5915,
        "source": "autocitire",
        "meterReset": false,
        "uncertain": false,
        "note": "",
        "updatedAt": null
      }
    ],
    "tariffs": [
      {
        "id": "t-eu-curent-1",
        "meterId": "m-eu-curent",
        "validFrom": "2026-06-09",
        "conversionFactor": null,
        "note": "Factura Electrica din 09.10.2026",
        "components": [
          {
            "name": "Energie activă",
            "price": 0.7557,
            "vat": 21
          },
          {
            "name": "Tarif distribuție",
            "price": 0.35534,
            "vat": 21
          },
          {
            "name": "Transport – introducere în rețea",
            "price": 0.00363,
            "vat": 21
          },
          {
            "name": "Transport – extragere din rețea",
            "price": 0.03645,
            "vat": 21
          },
          {
            "name": "Servicii de sistem",
            "price": 0.0147,
            "vat": 21
          },
          {
            "name": "Contribuție cogenerare",
            "price": 0.0136,
            "vat": 21
          },
          {
            "name": "Certificate verzi",
            "price": 0.0740192,
            "vat": 21
          },
          {
            "name": "Contribuție CfD",
            "price": 0.000144,
            "vat": 21
          },
          {
            "name": "Acciză consum necomercial",
            "price": 0.00768,
            "vat": 21
          }
        ],
        "fees": []
      },
      {
        "id": "t-eu-curent-2",
        "meterId": "m-eu-curent",
        "validFrom": "2026-07-01",
        "conversionFactor": null,
        "note": "Factura Electrica din 09.10.2026",
        "components": [
          {
            "name": "Energie activă",
            "price": 0.79545,
            "vat": 21
          },
          {
            "name": "Tarif distribuție",
            "price": 0.35534,
            "vat": 21
          },
          {
            "name": "Transport – introducere în rețea",
            "price": 0.00363,
            "vat": 21
          },
          {
            "name": "Transport – extragere din rețea",
            "price": 0.03645,
            "vat": 21
          },
          {
            "name": "Servicii de sistem",
            "price": 0.0147,
            "vat": 21
          },
          {
            "name": "Contribuție cogenerare",
            "price": 0.0145,
            "vat": 21
          },
          {
            "name": "Certificate verzi",
            "price": 0.0740192,
            "vat": 21
          },
          {
            "name": "Contribuție CfD",
            "price": 0.000144,
            "vat": 21
          },
          {
            "name": "Acciză consum necomercial",
            "price": 0.00768,
            "vat": 21
          }
        ],
        "fees": []
      },
      {
        "id": "t-eu-gaz-1",
        "meterId": "m-eu-gaz",
        "validFrom": "2026-09-01",
        "conversionFactor": 10.452,
        "note": "Factura E.ON din 15.10.2026",
        "components": [
          {
            "name": "Preț furnizare",
            "price": 0.27039,
            "vat": 21
          },
          {
            "name": "Reducere OUG 12/2026",
            "price": -0.05289,
            "vat": 21
          }
        ],
        "fees": [
          {
            "name": "E.ON ServExpress PRO",
            "amount": 31.4,
            "vat": 21,
            "period": "month",
            "enabled": true
          }
        ]
      },
      {
        "id": "t-eu-gaz-2",
        "meterId": "m-eu-gaz",
        "validFrom": "2026-10-01",
        "conversionFactor": 10.452,
        "note": "Factura E.ON din 15.10.2026",
        "components": [
          {
            "name": "Preț furnizare",
            "price": 0.26667,
            "vat": 21
          },
          {
            "name": "Reducere OUG 12/2026",
            "price": -0.04357,
            "vat": 21
          }
        ],
        "fees": [
          {
            "name": "E.ON ServExpress PRO",
            "amount": 31.4,
            "vat": 21,
            "period": "month",
            "enabled": true
          }
        ]
      },
      {
        "id": "t-eu-apa-1",
        "meterId": "m-eu-apa",
        "validFrom": "2026-09-01",
        "conversionFactor": null,
        "note": "Factura Apă Canal din 12.10.2026",
        "components": [
          {
            "name": "Apă",
            "price": 7.81,
            "vat": 11
          },
          {
            "name": "Canal",
            "price": 5.89,
            "vat": 11
          }
        ],
        "fees": [
          {
            "name": "Prestație contract condominiu",
            "amount": 13.88,
            "vat": 21,
            "period": "quarter",
            "enabled": true
          }
        ]
      },
      {
        "id": "t-mama-gaz-1",
        "meterId": "m-mama-gaz",
        "validFrom": "2026-09-01",
        "conversionFactor": 10.452,
        "note": "Factura E.ON din 15.10.2026",
        "components": [
          {
            "name": "Preț furnizare",
            "price": 0.27039,
            "vat": 21
          },
          {
            "name": "Reducere OUG 12/2026",
            "price": -0.05289,
            "vat": 21
          }
        ],
        "fees": [
          {
            "name": "E.ON ServExpress PRO",
            "amount": 31.4,
            "vat": 21,
            "period": "month",
            "enabled": true
          }
        ]
      },
      {
        "id": "t-mama-gaz-2",
        "meterId": "m-mama-gaz",
        "validFrom": "2026-10-01",
        "conversionFactor": 10.452,
        "note": "Factura E.ON din 15.10.2026",
        "components": [
          {
            "name": "Preț furnizare",
            "price": 0.26667,
            "vat": 21
          },
          {
            "name": "Reducere OUG 12/2026",
            "price": -0.04357,
            "vat": 21
          }
        ],
        "fees": [
          {
            "name": "E.ON ServExpress PRO",
            "amount": 31.4,
            "vat": 21,
            "period": "month",
            "enabled": true
          }
        ]
      },
      {
        "id": "t-mama-curent-1",
        "meterId": "m-mama-curent",
        "validFrom": "2026-06-09",
        "conversionFactor": null,
        "note": "Factura Electrica din 09.10.2026",
        "components": [
          {
            "name": "Energie activă",
            "price": 0.7557,
            "vat": 21
          },
          {
            "name": "Tarif distribuție",
            "price": 0.35534,
            "vat": 21
          },
          {
            "name": "Transport – introducere în rețea",
            "price": 0.00363,
            "vat": 21
          },
          {
            "name": "Transport – extragere din rețea",
            "price": 0.03645,
            "vat": 21
          },
          {
            "name": "Servicii de sistem",
            "price": 0.0147,
            "vat": 21
          },
          {
            "name": "Contribuție cogenerare",
            "price": 0.0136,
            "vat": 21
          },
          {
            "name": "Certificate verzi",
            "price": 0.0740192,
            "vat": 21
          },
          {
            "name": "Contribuție CfD",
            "price": 0.000144,
            "vat": 21
          },
          {
            "name": "Acciză consum necomercial",
            "price": 0.00768,
            "vat": 21
          }
        ],
        "fees": []
      },
      {
        "id": "t-mama-curent-2",
        "meterId": "m-mama-curent",
        "validFrom": "2026-07-01",
        "conversionFactor": null,
        "note": "Factura Electrica din 09.10.2026",
        "components": [
          {
            "name": "Energie activă",
            "price": 0.79545,
            "vat": 21
          },
          {
            "name": "Tarif distribuție",
            "price": 0.35534,
            "vat": 21
          },
          {
            "name": "Transport – introducere în rețea",
            "price": 0.00363,
            "vat": 21
          },
          {
            "name": "Transport – extragere din rețea",
            "price": 0.03645,
            "vat": 21
          },
          {
            "name": "Servicii de sistem",
            "price": 0.0147,
            "vat": 21
          },
          {
            "name": "Contribuție cogenerare",
            "price": 0.0145,
            "vat": 21
          },
          {
            "name": "Certificate verzi",
            "price": 0.0740192,
            "vat": 21
          },
          {
            "name": "Contribuție CfD",
            "price": 0.000144,
            "vat": 21
          },
          {
            "name": "Acciză consum necomercial",
            "price": 0.00768,
            "vat": 21
          }
        ],
        "fees": []
      }
    ],
    "meta": {
      "lastBackupAt": null,
      "dirtySince": null
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
