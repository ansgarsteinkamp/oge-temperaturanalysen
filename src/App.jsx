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
import isEqual from "lodash/isEqual.js";
import drop from "lodash/drop.js";

import MyScatterPlot from "./UI/ScatterPlot";
import Select from "./UI/Select";

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
   const [stationen, setStationen] = useState([]);
   const [bezirke, setBezirke] = useState([]);
   const [temperaturen, setTemperaturen] = useState([]);

   const [station, setStation] = useState("10410");
   const nameDerStation = stationen.find(el => el.id === station)?.name;

   useEffect(() => {
      fetchDaten("/stationen.txt", el => ({ id: el[0], name: el[1] }), setStationen);
      fetchDaten("/bezirke.txt", el => ({ id: el[0], name: el[0], idStation: el[1], gewichtStation: Number(el[2]) }), setBezirke);
      fetchDaten("/temperaturen.txt", el => ({ datum: el[0], idStation: el[1], temperatur: Number(el[2]) }), setTemperaturen);
   }, []);

   let xAchse = stationen.length === 0 ? [] : temperaturen.filter(el => el.idStation === stationen[0].id).map(el => el.datum);

   // ###############################################################################
   // ###############################################################################
   // #########                                                             #########
   // #########      Test, ob alle Stationen die gleiche x-Achse haben      #########

   for (let i = 0; i < stationen.length; i++) {
      const xAchseStation = temperaturen.filter(el => el.idStation === stationen[i].id).map(el => el.datum);
      console.log(isEqual(xAchse, xAchseStation), stationen[i].name);
   }

   // #########      Test, ob alle Stationen die gleiche x-Achse haben      #########
   // #########                                                             #########
   // ###############################################################################
   // ###############################################################################

   xAchse = drop(xAchse, 3);

   // => 29.12. bis 31.12. entfernt

   const datenSpeicher = stationen.map(el => ({
      id: el.id,
      name: el.name,
      bezirk: false,
      temperaturen: temperaturen.filter(t => t.idStation === el.id).map(el => el.temperatur)
   }));

   // const jahre = uniq(temperaturen.map(el => el.jahr));
   // const minJahr = Math.min(...jahre);
   // const maxJahr = Math.max(...jahre);

   // Für jedes Jahr ein Array mit den Temperaturen der Station
   // const punktwolke = jahre.map(jahr => ({
   //    id: jahr,
   //    data: temperaturen.filter(el => el.id === station && el.jahr === jahr).map(el => ({ x: el.datum, y: el.temperatur }))
   // }));

   return (
      <div className="mx-auto mt-10 max-w-5xl">
         <div className="mb-1 sm:mb-3 ml-[59px] sm:ml-[89px] ">
            <Select className="mb-3" label="Temperaturstation" options={stationen} value={station} onChange={event => setStation(event.target.value)} />
            <h1 className="font-semibold text-xs sm:text-2xl">Tagesmitteltemperaturen {nameDerStation}</h1>
            {/* <h2 className="text-4xs sm:text-xs text-stone-400">
               01.01.{minJahr} bis 31.12.{maxJahr}
            </h2> */}
         </div>
         {/* <div className="hidden sm:block w-full aspect-[16/11]">
            <MyScatterPlot data={punktwolke} />
         </div>
         <div className="sm:hidden w-full aspect-[16/11]">
            <MyScatterPlot data={punktwolke} smartphone />
         </div> */}
      </div>
   );
}

export default App;
