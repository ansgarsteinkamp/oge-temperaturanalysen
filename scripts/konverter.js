#!/usr/bin/env node
// Wandelt die Rohdaten-CSV in public/temperaturen.txt um.
//
// Aufruf:   node scripts/konverter.js
// Erwartet: scripts/quelldaten.csv liegt neben diesem Skript.
// Ergebnis: public/temperaturen.txt wird neu geschrieben, sofern alle Plausi-Checks bestehen.
//
// Erwartetes Quellformat (Komma- ODER Semikolon-getrennt, Header-Zeile):
//    "DATE","INTERNATIONALES_KENNZEICHEN","VALUE"          (Komma-Variante)
//    2024-12-31,"10400","1,7"     (Werte mit Dezimalkomma müssen gequotet sein)
//    2024-12-31,10315,2            (ganzzahlige Werte dürfen ungequotet sein)
//  oder
//    "DATE";"INTERNATIONALES_KENNZEICHEN";"VALUE"          (Semikolon-Variante)
//    2025-12-31;P586;-5,96        (Dezimalkomma hier auch ungequotet erlaubt)
//
// Zielformat:
//    UTF-8 mit BOM, Semikolon-getrennt, Punkt als Dezimaltrenner, keine Anführungszeichen,
//    aufsteigend nach Datum, innerhalb eines Datums alphabetisch nach Stations-ID, LF-Zeilenenden.

import { readFileSync as fsReadFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const readFileSync = (pfad, bedeutung) => {
   try {
      return fsReadFileSync(pfad, "utf8");
   } catch (e) {
      if (e.code === "ENOENT") {
         console.error(`Fehler: ${bedeutung} nicht gefunden: ${pfad}`);
      } else {
         console.error(`Fehler beim Lesen von ${bedeutung} (${pfad}): ${e.message}`);
      }
      process.exit(1);
   }
};

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(SCRIPT_DIR, "..", "public");
const ZIEL_DATEI = join(PUBLIC_DIR, "temperaturen.txt");
const STATIONEN_DATEI = join(PUBLIC_DIR, "stationen.txt");
const BEZIRKE_DATEI = join(PUBLIC_DIR, "bezirke.txt");
const QUELLDATEN_DATEI = join(SCRIPT_DIR, "quelldaten.csv");

const ERWARTETE_HEADER = {
   ",": '"DATE","INTERNATIONALES_KENNZEICHEN","VALUE"',
   ";": '"DATE";"INTERNATIONALES_KENNZEICHEN";"VALUE"',
};
const TEMP_MIN = -40;
const TEMP_MAX = 45;
const JAHRE = 20;

const fehler = [];
const addFehler = msg => fehler.push(msg);

// ---------- Stationen und Bezirke laden (Sanity-Checks) ----------
const stationenRoh = readFileSync(STATIONEN_DATEI, "stationen.txt").replace(/^\uFEFF/, "");
const bekannteStationen = new Set(
   stationenRoh
      .split(/\r?\n/)
      .filter(z => z.trim() !== "")
      .map(z => z.split(";")[0].trim())
);
if (bekannteStationen.size === 0) addFehler("stationen.txt enthaelt keine Eintraege.");

const bezirkeRoh = readFileSync(BEZIRKE_DATEI, "bezirke.txt").replace(/^\uFEFF/, "");
const bezirkeZeilen = bezirkeRoh.split(/\r?\n/).filter(z => z.trim() !== "");
const gewichteProBezirk = new Map();
for (let n = 0; n < bezirkeZeilen.length; n++) {
   const felder = bezirkeZeilen[n].split(";").map(s => s.trim());
   if (felder.length !== 4) {
      addFehler(`bezirke.txt Zeile ${n + 1}: erwartet 4 Felder, hat ${felder.length}.`);
      continue;
   }
   const [bezirkId, , stationId, gewichtStr] = felder;
   if (!bekannteStationen.has(stationId)) {
      addFehler(`bezirke.txt Zeile ${n + 1}: Stations-ID "${stationId}" nicht in stationen.txt.`);
   }
   const gewicht = Number(gewichtStr.replace(",", "."));
   if (!Number.isFinite(gewicht)) {
      addFehler(`bezirke.txt Zeile ${n + 1}: Gewicht "${gewichtStr}" nicht parsebar.`);
      continue;
   }
   gewichteProBezirk.set(bezirkId, (gewichteProBezirk.get(bezirkId) ?? 0) + gewicht);
}
for (const [bezirkId, summe] of gewichteProBezirk) {
   if (Math.abs(summe - 1) > 0.01) {
      addFehler(`bezirke.txt: Bezirk ${bezirkId} hat Gewichtssumme ${summe.toFixed(4)} (erwartet ~1.0).`);
   }
}

// ---------- Rohdaten einlesen ----------
const rohInhalt = readFileSync(QUELLDATEN_DATEI, "quelldaten.csv").replace(/^\uFEFF/, "");
const zeilen = rohInhalt.split(/\r?\n/);

// Header prüfen und Separator ableiten (, oder ;)
let SEP = null;
for (const [sep, header] of Object.entries(ERWARTETE_HEADER)) {
   if (zeilen[0] === header) {
      SEP = sep;
      break;
   }
}
if (SEP === null) {
   addFehler(`Unerwarteter Header: "${zeilen[0]}" (erwartet: ${ERWARTETE_HEADER[","]} oder ${ERWARTETE_HEADER[";"]})`);
   SEP = ","; // Fallback, damit Parsing nicht crasht; Abbruch erfolgt spaeter via fehler-Liste.
}

// Minimaler CSV-Parser: Separator wie im Header (, oder ;), Felder optional in " " gequotet.
// Bei ,-Trennung müssen Dezimalwerte gequotet sein ("0,7"); bei ;-Trennung ist das Dezimalkomma
// unproblematisch, weil es nicht mit dem Separator kollidiert.
const splitCsv = zeile => {
   const felder = [];
   let i = 0;
   while (i < zeile.length) {
      if (zeile[i] === '"') {
         const ende = zeile.indexOf('"', i + 1);
         if (ende === -1) return null;
         felder.push(zeile.slice(i + 1, ende));
         i = ende + 1;
         if (i < zeile.length && zeile[i] !== SEP) return null;
         i++;
      } else {
         const ende = zeile.indexOf(SEP, i);
         if (ende === -1) {
            felder.push(zeile.slice(i));
            i = zeile.length;
         } else {
            felder.push(zeile.slice(i, ende));
            i = ende + 1;
         }
      }
   }
   return felder;
};

const normStation = id => (/^\d+$/.test(id) ? id.padStart(5, "0") : id);

const datensaetze = [];
const gesehen = new Set();

for (let n = 1; n < zeilen.length; n++) {
   const zeile = zeilen[n];
   if (zeile === "") continue;

   const felder = splitCsv(zeile);
   if (!felder || felder.length !== 3) {
      addFehler(`Zeile ${n + 1}: Kann nicht in 3 Felder zerlegt werden: "${zeile}"`);
      continue;
   }

   const [datumRoh, idRoh, wertRoh] = felder.map(s => s.trim());

   if (!/^\d{4}-\d{2}-\d{2}$/.test(datumRoh)) {
      addFehler(`Zeile ${n + 1}: Ungueltiges Datumsformat "${datumRoh}"`);
      continue;
   }
   const [jahr, monat, tag] = datumRoh.split("-").map(Number);
   const datumTest = new Date(Date.UTC(jahr, monat - 1, tag));
   if (datumTest.getUTCFullYear() !== jahr || datumTest.getUTCMonth() !== monat - 1 || datumTest.getUTCDate() !== tag) {
      addFehler(`Zeile ${n + 1}: Kein gueltiges Kalenderdatum "${datumRoh}"`);
      continue;
   }

   const id = normStation(idRoh);
   if (!bekannteStationen.has(id)) {
      addFehler(`Zeile ${n + 1}: Unbekannte Stations-ID "${idRoh}" (normalisiert "${id}")`);
      continue;
   }

   if (wertRoh === "") {
      addFehler(`Zeile ${n + 1}: Temperaturwert ist leer.`);
      continue;
   }
   const wertStr = wertRoh.replace(",", ".");
   const wert = Number(wertStr);
   if (!Number.isFinite(wert)) {
      addFehler(`Zeile ${n + 1}: Temperatur nicht parsebar "${wertRoh}"`);
      continue;
   }
   if (wert < TEMP_MIN || wert > TEMP_MAX) {
      addFehler(`Zeile ${n + 1}: Temperatur ${wert} ausserhalb Plausi-Bereich [${TEMP_MIN}, ${TEMP_MAX}]`);
      continue;
   }

   const schluessel = `${datumRoh}|${id}`;
   if (gesehen.has(schluessel)) {
      addFehler(`Zeile ${n + 1}: Duplikat (${datumRoh}, ${id})`);
      continue;
   }
   gesehen.add(schluessel);

   datensaetze.push({ datum: datumRoh, id, wert: Math.round(wert * 10) / 10 });
}

// ---------- Globale Plausi-Checks ----------
if (datensaetze.length === 0) {
   addFehler("Keine Datensaetze nach dem Parsen uebrig.");
}

let startDatum, endDatum;
if (datensaetze.length > 0) {
   const alleDaten = [...new Set(datensaetze.map(d => d.datum))].sort();
   const minDatum = alleDaten[0];
   const maxDatum = alleDaten[alleDaten.length - 1];

   // Ziel-Zeitraum: 29.12.(Y-20) bis 31.12.Y, wobei Y = Jahr des letzten Datums.
   const jahrMax = Number(maxDatum.slice(0, 4));
   const erwartetEnde = `${jahrMax}-12-31`;
   const erwartetStart = `${jahrMax - JAHRE}-12-29`;

   if (maxDatum !== erwartetEnde) {
      addFehler(`Letztes Datum ist ${maxDatum}, erwartet wurde ${erwartetEnde}.`);
   }
   if (minDatum > erwartetStart) {
      addFehler(`Erstes Datum ist ${minDatum}, erwartet wurde spaetestens ${erwartetStart}.`);
   }

   // Datensaetze auf Zielzeitraum filtern
   const vorherAnzahl = datensaetze.length;
   const gefiltert = datensaetze.filter(d => d.datum >= erwartetStart && d.datum <= erwartetEnde);
   datensaetze.length = 0;
   for (const d of gefiltert) datensaetze.push(d);
   const verworfen = vorherAnzahl - datensaetze.length;
   if (verworfen > 0) {
      console.log(`Hinweis: ${verworfen} Zeilen ausserhalb ${erwartetStart}..${erwartetEnde} werden entfernt.`);
   }

   // Datumskontinuität: jeder Tag zwischen Start und Ende muss vorkommen
   const vorhandeneTage = new Set(datensaetze.map(d => d.datum));
   const fehlendeTage = [];
   const [sy, sm, sd] = erwartetStart.split("-").map(Number);
   const [ey, em, ed] = erwartetEnde.split("-").map(Number);
   let cursor = Date.UTC(sy, sm - 1, sd);
   const endUtc = Date.UTC(ey, em - 1, ed);
   while (cursor <= endUtc) {
      const dt = new Date(cursor);
      const iso = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
      if (!vorhandeneTage.has(iso)) fehlendeTage.push(iso);
      cursor += 86400000;
   }
   if (fehlendeTage.length > 0) {
      addFehler(`${fehlendeTage.length} Tage fehlen ganz, z.B. ${fehlendeTage.slice(0, 5).join(", ")}`);
   }

   // Stations-Abdeckung: welche bekannten Stationen kommen überhaupt vor?
   const vorhandeneIds = new Set(datensaetze.map(d => d.id));
   const fehlendeIds = [...bekannteStationen].filter(id => !vorhandeneIds.has(id));
   if (fehlendeIds.length > 0) {
      addFehler(`Stationen aus stationen.txt ohne jegliche Daten: ${fehlendeIds.join(", ")}`);
   }

   // Abdeckung pro Station: MUSS exakt gleich sein für alle Stationen, sonst
   // verschieben sich in der App die Datums-Zuordnungen (xAchse kommt nur von stationen[0],
   // Bezirksgewichtung zipt nach Index).
   const anzahlProStation = new Map();
   for (const d of datensaetze) {
      anzahlProStation.set(d.id, (anzahlProStation.get(d.id) ?? 0) + 1);
   }
   const erwarteteAnzahl = vorhandeneTage.size;
   for (const [id, anzahl] of [...anzahlProStation.entries()].sort()) {
      if (anzahl !== erwarteteAnzahl) {
         addFehler(`Station ${id}: ${anzahl} Tage statt erwartet ${erwarteteAnzahl} (${erwarteteAnzahl - anzahl} Luecken). Die App kann Luecken nicht verarbeiten.`);
      }
   }

   startDatum = erwartetStart;
   endDatum = erwartetEnde;
}

// ---------- Report & Abbruch bei Fehlern ----------
if (fehler.length > 0) {
   console.error(`\n${fehler.length} Fehler gefunden. temperaturen.txt wurde NICHT geschrieben:`);
   const anzeigen = fehler.slice(0, 30);
   for (const f of anzeigen) console.error(`  - ${f}`);
   if (fehler.length > anzeigen.length) {
      console.error(`  ... (${fehler.length - anzeigen.length} weitere Fehler nicht angezeigt)`);
   }
   process.exit(1);
}

// ---------- Sortieren und Ausgabe schreiben ----------
datensaetze.sort((a, b) => {
   if (a.datum !== b.datum) return a.datum < b.datum ? -1 : 1; // Datum aufsteigend
   return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; // Station aufsteigend
});

const zeilenAus = datensaetze.map(d => `${d.datum};${d.id};${d.wert.toFixed(1)}`);
const ausgabe = "\uFEFF" + zeilenAus.join("\n");
writeFileSync(ZIEL_DATEI, ausgabe, "utf8");

const anzahlStationen = new Set(datensaetze.map(d => d.id)).size;
console.log(`\nFertig: ${datensaetze.length} Zeilen geschrieben nach public/temperaturen.txt`);
console.log(`  Zeitraum:   ${startDatum} bis ${endDatum}`);
console.log(`  Stationen:  ${anzahlStationen} (alle mit lueckenloser Abdeckung)`);
console.log(`  Bezirke:    ${gewichteProBezirk.size} (alle Gewichtssummen ~1.0)`);
