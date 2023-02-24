// Vorbereitung der Datei temperaturen.txt:
// 1. Excel / Optionen / Erweitert: Trennzeichen vom Betriebssystem übernehmen DEAKTIVIEREN
// 2. csv-Datei von Ulrich Letmathe in .txt-Datei umbenennen und mit Excel öffnen
//    - Trennzeichen Semikolon
//    - Datenformat der ersten Spalte: Datum (JMT)
//    - Datenformat der zweiten Spalte: Text
// 3. Datum-Spalte markieren / Zellen formatieren... / Datum yyyy-mm-dd
// 4. Temperaturen-Spalte runden auf eine Nachkommastelle
// 5. Tabelle Sortieren nach
//    - Spalte A / Nach Alter (absteigend)
//    - Spalte B / A bis Z
// 6. Alle Zeilen löschen außer die letzten 20 Jahre + 3 Tage (=> 29. Dezember ist der erste Eintrag)
// 7. Speichern unter... CSV UTF-8
// 8. Dateiendung umbenennen in .txt
// 9. Überflüssige leere Zeile am Ende entfernen

// Vorbereitung der Dateien stationen.txt und bezirke.txt:
// Vorsortierung nach dem Namen

import { useState, useEffect } from "react";

import uniq from "lodash/uniq.js";
import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";
import drop from "lodash/drop.js";
import groupBy from "lodash/groupBy.js";
import min from "lodash/min.js";
import max from "lodash/max.js";

import MyScatterPlot from "./UI/ScatterPlot";
import Select from "./UI/Select";

import bezirkZuTemperaturen from "./utils/bezirkZuTemperaturen";
import { temperaturenZuZweitagesmitteln } from "./utils/temperaturenZuZweiUndViertagesmitteln";
import { temperaturenZuViertagesmitteln } from "./utils/temperaturenZuZweiUndViertagesmitteln";
import temperaturenZuPunktwolke from "./utils/temperaturenZuPunktwolke";

const fetchDaten = async (datei, konverter, setState) => {
   const response = await fetch(datei);
   const data = await response.text();

   const result = data
      .split("\r\n")
      .map(el => el.split(";"))
      .map(konverter);

   setState(result);
};

function App() {
   const [counter, setCounter] = useState(0);
   const [anzahlJahre, setAnzahlJahre] = useState(20);
   const [stationen, setStationen] = useState([]);
   const [bezirke, setBezirke] = useState([]);
   const [temperaturenGesamt, setTemperaturenGesamt] = useState([]);

   const bezirkeSmall = uniqWith(
      bezirke.map(el => ({ id: el.id, name: el.name })),
      isEqual
   );

   const [station, setStation] = useState("10410");
   const [bezirk, setBezirk] = useState("2");
   const nameDerStation = stationen.find(el => el.id === station)?.name;
   const nameDesBezirks = bezirkeSmall.find(el => el.id === bezirk)?.name;

   const id = !!station ? station : bezirk;
   const name = !!station ? nameDerStation : nameDesBezirks;

   const [mittelung, setMittelung] = useState("Tagesmittel");

   useEffect(() => {
      fetchDaten("/stationen.txt", el => ({ id: el[0], name: el[1] }), setStationen);
      fetchDaten("/bezirke.txt", el => ({ id: el[0], name: el[1], idStation: el[2], gewichtStation: Number(el[3]) }), setBezirke);
      fetchDaten("/temperaturen.txt", el => ({ datum: el[0], idStation: el[1], temperatur: Number(el[2]) }), setTemperaturenGesamt);
   }, []);

   useEffect(() => {
      if (!!station) setBezirk("");
      setCounter(counter => counter + 1);
   }, [station]);

   useEffect(() => {
      if (!!bezirk && counter) setStation("");
      setCounter(counter => counter + 1);
   }, [bezirk]);

   let xAchse = stationen.length === 0 ? [] : temperaturenGesamt.filter(el => el.idStation === stationen[0].id).map(el => el.datum);

   // ###############################################################################
   // ###############################################################################
   // #########                                                             #########
   // #########      Test, ob alle Stationen die gleiche x-Achse haben      #########

   // for (const s of stationen) {
   //    const xAchseStation = temperaturenGesamt.filter(el => el.idStation === s.id).map(el => el.datum);
   //    console.log(isEqual(xAchse, xAchseStation) ? "OK" : "🏴‍☠️ Achtung! x-Achse weicht ab!", s.name);
   // }

   // #########      Test, ob alle Stationen die gleiche x-Achse haben      #########
   // #########                                                             #########
   // ###############################################################################
   // ###############################################################################

   xAchse = drop(xAchse, 3);

   // => 29.12. bis 31.12. entfernt

   const jahre = uniq(xAchse.map(el => Number(el.slice(0, 4))));
   const maxJahr = max(jahre);
   const startJahr = maxJahr - anzahlJahre + 1;

   const datenSpeicher = stationen.map(el => ({
      id: el.id,
      name: el.name,
      temperaturen: temperaturenGesamt.filter(t => t.idStation === el.id).map(el => el.temperatur)
   }));

   const bezirksZusammensetzung = bezirke.filter(el => el.id === bezirk);

   const TEMP = !!station
      ? temperaturenGesamt.filter(t => t.idStation === station).map(el => el.temperatur)
      : bezirkZuTemperaturen(bezirksZusammensetzung, datenSpeicher);

   const temperaturen =
      mittelung === "Tagesmittel"
         ? drop(TEMP, 3)
         : mittelung === "Zweitagesmittel"
         ? drop(temperaturenZuZweitagesmitteln(TEMP), 3)
         : mittelung === "Viertagesmittel"
         ? drop(temperaturenZuViertagesmitteln(TEMP), 3)
         : [];

   const punktwolke = temperaturenZuPunktwolke(temperaturen, xAchse, startJahr);

   const ueberschrift =
      mittelung === "Tagesmittel"
         ? "Tagesmitteltemperaturen"
         : mittelung === "Zweitagesmittel"
         ? "Zweitagesmitteltemperaturen"
         : mittelung === "Viertagesmittel"
         ? "Viertagesmitteltemperaturen"
         : "";

   return (
      <div className="mx-auto mt-10 max-w-5xl">
         <div className="mb-1 sm:mb-3 ml-[59px] sm:ml-[89px] ">
            <div className="mb-3 flex items-center space-x-2">
               <Select
                  label="Temperaturstation des DWD"
                  options={stationen.map(el => ({ id: el.id, label: el.name }))}
                  value={station}
                  onChange={event => setStation(event.target.value)}
                  leereOption={true}
               />
               <Select
                  label="Temperaturbezirk"
                  options={bezirkeSmall.map(el => ({ id: el.id, label: el.name }))}
                  value={bezirk}
                  onChange={event => setBezirk(event.target.value)}
                  leereOption={true}
               />
               <Select
                  label="Art der Mittelung"
                  options={["Tagesmittel", "Zweitagesmittel", "Viertagesmittel"].map(el => ({ id: el, label: el }))}
                  value={mittelung}
                  onChange={event => setMittelung(event.target.value)}
               />
               <Select
                  label="Historie"
                  options={[5, 10, 15, 20].map(el => ({ id: el, label: `${el} Jahre` }))}
                  value={anzahlJahre}
                  onChange={event => setAnzahlJahre(event.target.value)}
               />
            </div>
            <h1 className="mb-1 font-semibold text-xs sm:text-2xl">
               {ueberschrift} {name}
            </h1>
            <h2 className="text-3xs sm:text-xs text-stone-400">
               01.01.{startJahr} bis 31.12.{maxJahr}
            </h2>
         </div>
         {punktwolke && (
            <>
               <div className="hidden sm:block w-full aspect-[16/11]">
                  <MyScatterPlot data={punktwolke} />
               </div>
               <div className="sm:hidden w-full aspect-[16/11]">
                  <MyScatterPlot data={punktwolke} smartphone />
               </div>
            </>
         )}
      </div>
   );
}

export default App;
