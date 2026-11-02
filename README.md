# Citire contoare

Aplicație web pentru evidența citirilor de curent, gaz și apă, pentru mai mulți clienți. Arată indexul curent, istoricul pe ani, un grafic lunar și estimează factura (cu TVA) din tarifele introduse.

Merge pe iPhone și pe Windows 11, fără App Store: e o pagină web care se instalează pe ecranul principal și funcționează și fără internet. Nu are server și nu are dependențe; e doar HTML, CSS și JavaScript.

## Unde stau datele

Datele stau **doar în browserul dispozitivului** (localStorage). Nimic nu se trimite nicăieri. Pentru backup și pentru a muta datele între telefon și PC:

1. Pe dispozitivul cu datele: **Setări → Exportă datele** (se creează un fișier `citiri-contoare-AAAA-LL-ZZ.json`).
2. Trimite fișierul pe celălalt dispozitiv (AirDrop, iCloud Drive, OneDrive, e-mail).
3. Acolo: **Setări → Importă din fișier**, apoi alege „Înlocuiește tot” sau „Adaugă ce lipsește”.

Pe iPhone, folosește aplicația instalată pe ecranul principal: Safari poate șterge datele site-urilor nevizitate de 7 zile. Aplicația îți amintește să faci backup dacă ai modificări mai vechi de o săptămână neexportate.

## Instalare

- **iPhone:** deschide adresa aplicației în Safari → butonul Partajare → „Adaugă pe ecranul principal”.
- **Windows 11:** deschide adresa în Edge → meniul ⋯ → Aplicații → „Instalează acest site ca aplicație”.

## Cum se calculează factura

- Consumul facturat = diferența dintre indexul **transmis** acum și cel transmis data trecută. Consumul real se calculează din indexul **citit**.
- Gaz: m³ × puterea calorifică (kWh/m³, de pe factură) = kWh, apoi kWh × prețul componentelor.
- Fiecare contor are versiuni de tarif „valabil din”. Dacă perioada dintre două citiri prinde două versiuni, consumul se împarte pe zile.
- Taxele fixe (abonament lunar, taxă trimestrială) se adaugă o dată pentru fiecare sfârșit de lună sau de trimestru din perioadă.
- Fiecare linie se rotunjește la bani și primește TVA-ul ei, ca pe factură.

Tarifele implicite sunt luate din facturile din octombrie 2026 (E.ON gaz, Electrica Furnizare curent, Apă Canal Sibiu apă). Când se schimbă prețurile, adaugă un tarif nou din pagina contorului → **Tarif și detalii → Tarif nou de la o dată**.

## Fișiere

```
index.html            pagina
styles.css            stiluri
js/defaults.js        tipuri de contoare și tarife implicite
js/calc.js            calcule (consum, cost, ferestre de transmitere)
js/store.js           salvare locală, export/import
js/ui.js              interfața
sw.js                 funcționare offline
manifest.webmanifest  instalare pe ecranul principal
```

La fiecare modificare a fișierelor, crește `VERSION` din `sw.js` ca dispozitivele instalate să încarce versiunea nouă.
