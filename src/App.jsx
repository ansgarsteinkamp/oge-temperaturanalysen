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

import { Tooltip } from "react-tooltip";

import { InformationCircleIcon } from "@heroicons/react/24/outline";

import uniq from "lodash/uniq.js";
import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";
import drop from "lodash/drop.js";
import groupBy from "lodash/groupBy.js";
import min from "lodash/min.js";
import max from "lodash/max.js";

import clsx from "clsx";

import MyScatterPlot from "./UI/ScatterPlot";
import Select from "./UI/Select";
import HorizontalRule from "./UI/HorizontalRule";

import fetchDaten from "./utils/fetchDaten";
import bezirkZuTemperaturen from "./utils/bezirkZuTemperaturen";
import { temperaturenZuZweitagesmitteln } from "./utils/temperaturenZuZweiUndViertagesmitteln";
import { temperaturenZuViertagesmitteln } from "./utils/temperaturenZuZweiUndViertagesmitteln";
import temperaturenZuPunktwolke from "./utils/temperaturenZuPunktwolke";
import { tageDesMonats } from "./utils/tageUndMonate";
import { monateDesJahres } from "./utils/tageUndMonate";
import { maxTagDesMonats } from "./utils/tageUndMonate";
import { tagLabel } from "./utils/tageUndMonate";
import { monatLabel } from "./utils/tageUndMonate";

function App() {
   const [stationen, setStationen] = useState([]);
   const [bezirke, setBezirke] = useState([]);
   const [temperaturenGesamt, setTemperaturenGesamt] = useState([]);

   useEffect(() => {
      fetchDaten("/stationen.txt", el => ({ id: el[0], name: el[1] }), setStationen);
      fetchDaten("/bezirke.txt", el => ({ id: el[0], name: el[1], idStation: el[2], gewichtStation: Number(el[3]) }), setBezirke);
      fetchDaten("/temperaturen.txt", el => ({ datum: el[0], idStation: el[1], temperatur: Number(el[2]) }), setTemperaturenGesamt);
   }, []);

   const bezirkeIDundName = uniqWith(
      bezirke.map(el => ({ id: el.id, name: el.name })),
      isEqual
   );

   const [anzahlJahre, setAnzahlJahre] = useState(20);
   const [station, setStation] = useState("10410");
   const [bezirk, setBezirk] = useState(undefined);

   useEffect(() => {
      if (!!station && !!bezirk) setBezirk("");
   }, [station]);

   useEffect(() => {
      if (!!bezirk && !!station) setStation("");
   }, [bezirk]);

   const nameDerStation = stationen.find(el => el.id === station)?.name;
   const nameDesBezirks = bezirkeIDundName.find(el => el.id === bezirk)?.name;

   const id = !!station ? station : bezirk;
   const name = !!station ? nameDerStation : nameDesBezirks;

   const [mittelung, setMittelung] = useState("Tagesmittel");

   const [startTag, setStartTag] = useState(1);
   const [startMonat, setStartMonat] = useState(1);
   const [endeTag, setEndeTag] = useState(31);
   const [endeMonat, setEndeMonat] = useState(12);

   useEffect(() => {
      if (!!startMonat && startTag > maxTagDesMonats[startMonat]) setStartTag(maxTagDesMonats[startMonat]);
   }, [startMonat]);

   useEffect(() => {
      if (!!endeMonat && endeTag > maxTagDesMonats[endeMonat]) setEndeTag(maxTagDesMonats[endeMonat]);
   }, [endeMonat]);

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

   let tooltipBezirk = null;

   if (bezirksZusammensetzung.length > 1) {
      tooltipBezirk = (
         <>
            <p className="font-semibold mb-0.5">Temperaturbezirk {nameDesBezirks}</p>
            <ul className="ml-5 list-disc">
               {bezirksZusammensetzung.map(el => (
                  <li key={el.idStation}>
                     {stationen.find(s => s.id === el.idStation)?.name}: {Math.round(el.gewichtStation * 100)}%
                  </li>
               ))}
            </ul>
         </>
      );
   }

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

   // console.log("xAchse", xAchse);
   // console.log("temperaturen", temperaturen);

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
      <>
         <div className="mx-auto my-6 md:my-12 max-w-5xl space-y-4 md:space-y-8">
            <section className="ml-[49px] md:ml-[89px] flex flex-col md:flex-row md:items-center md:space-x-5 space-y-2 md:space-y-0">
               <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-5 space-y-2 lg:space-y-0">
                  <Select
                     label="Temperaturstation des DWD"
                     options={stationen.map(el => ({ id: el.id, label: el.name }))}
                     value={station}
                     onChange={event => setStation(event.target.value)}
                     leereOption={true}
                  />
                  <Select
                     label="Temperaturbezirk"
                     options={bezirkeIDundName.map(el => ({ id: el.id, label: el.name }))}
                     value={bezirk}
                     onChange={event => setBezirk(event.target.value)}
                     leereOption={true}
                     icon={
                        <InformationCircleIcon
                           data-tooltip-id="Zusammensetzung des Bezirks"
                           className={clsx("flex-shrink-0 w-4 h-4 2xs:w-5 2xs:h-5 focus:outline-none", !!bezirk ? "text-stone-500" : "text-stone-300")}
                        />
                     }
                  />
               </div>

               <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-5 space-y-2 lg:space-y-0">
                  <Select
                     label="Art der Mittelung"
                     options={["Tagesmittel", "Zweitagesmittel", "Viertagesmittel"].map(el => ({ id: el, label: el }))}
                     value={mittelung}
                     onChange={event => setMittelung(event.target.value)}
                     icon={
                        <InformationCircleIcon
                           data-tooltip-id="tagesmittel"
                           className="text-stone-500 flex-shrink-0 w-4 h-4 2xs:w-5 2xs:h-5 focus:outline-none"
                        />
                     }
                  />
                  <Select
                     label="Historie"
                     options={[5, 10, 15, 20].map(el => ({ id: el, label: `${el} Jahre` }))}
                     value={anzahlJahre}
                     onChange={event => setAnzahlJahre(Number(event.target.value))}
                  />
               </div>
            </section>

            <HorizontalRule />

            <section>
               <div className="ml-[49px] md:ml-[89px]">
                  <h2 className="mb-1 font-semibold text-base md:text-2xl">
                     {ueberschrift}{" "}
                     <span className="md:hidden">
                        <br />
                     </span>
                     {name}
                  </h2>
                  <h3 className="text-2xs md:text-sm text-stone-400">
                     01.01.{startJahr} bis 31.12.{maxJahr}
                  </h3>
               </div>
               {punktwolke && (
                  <>
                     <div className="hidden md:block w-full aspect-[16/11]">
                        <MyScatterPlot data={punktwolke} />
                     </div>
                     <div className="md:hidden w-full aspect-[16/11]">
                        <MyScatterPlot data={punktwolke} smartphone />
                     </div>
                  </>
               )}
            </section>

            <HorizontalRule />

            <section className="ml-[49px] md:ml-[89px] flex flex-col md:flex-row md:items-center md:space-x-5 space-y-2 md:space-y-0">
               <div>
                  <p className="ml-1 mb-1 font-semibold">Start des Zeitraums</p>
                  <div className="flex items-center space-x-1">
                     <Select options={tageDesMonats[startMonat]} value={startTag} onChange={event => setStartTag(Number(event.target.value))} />
                     <Select options={monateDesJahres} value={startMonat} onChange={event => setStartMonat(Number(event.target.value))} />
                  </div>
               </div>

               <div>
                  <p className="ml-1 mb-1 font-semibold">Ende des Zeitraums</p>
                  <div className="flex items-center space-x-1">
                     <Select options={tageDesMonats[endeMonat]} value={endeTag} onChange={event => setEndeTag(Number(event.target.value))} />
                     <Select options={monateDesJahres} value={endeMonat} onChange={event => setEndeMonat(Number(event.target.value))} />
                  </div>
               </div>
            </section>

            <section>
               <div className="ml-[49px] md:ml-[89px]">
                  <h2 className="mb-1 font-semibold text-base md:text-2xl">Empirische Wahrscheinlichkeiten</h2>
                  <h3 className="text-2xs md:text-sm text-stone-400">
                     des Zeitraums {tagLabel[startTag]} {monatLabel[startMonat]} bis {tagLabel[endeTag]} {monatLabel[endeMonat]}
                  </h3>
               </div>
            </section>
         </div>

         <Tooltip id="tagesmittel" delayShow={400} variant="error">
            <div className="space-y-2">
               <div>
                  <p className="font-semibold">Tagesmitteltemperatur</p>
                  <p>Durchschnittliche Temperatur des Tages ("Heute")</p>
                  <ul className="ml-5 list-disc">
                     <li>Heute: 100%</li>
                  </ul>
               </div>
               <div>
                  <p className="font-semibold">Zweitagesmitteltemperatur</p>
                  <p>Durchschnittliche Temperatur der letzten beiden Tage</p>
                  <ul className="ml-5 list-disc">
                     <li>Heute: 50%</li>
                     <li>Gestern: 50%</li>
                  </ul>
               </div>
               <div>
                  <p className="font-semibold">Viertagesmitteltemperatur</p>
                  <p>Durchschnittliche Temperatur der letzten vier Tage</p>
                  <ul className="ml-5 list-disc">
                     <li>Heute: 8/15</li>
                     <li>Gestern: 4/15</li>
                     <li>Vorgestern: 2/15</li>
                     <li>Vorvorgestern: 1/15</li>
                  </ul>
               </div>
            </div>
         </Tooltip>

         {tooltipBezirk && (
            <Tooltip id="Zusammensetzung des Bezirks" delayShow={400} variant="error">
               {tooltipBezirk}
            </Tooltip>
         )}

         <Tooltip id="tooltip" delayShow={400} variant="error" />
      </>
   );
}

export default App;
