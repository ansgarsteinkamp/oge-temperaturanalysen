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

import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";
import drop from "lodash/drop.js";
import head from "lodash/head.js";
import last from "lodash/last.js";
import max from "lodash/max.js";

import clsx from "clsx";

import ScatterPlot from "./UI/ScatterPlot";
import ScatterPlotRotesRechteck from "./UI/ScatterPlotRotesRechteck";
import VergleichScatterPlot from "./UI/VergleichScatterPlot";
import VergleichScatterPlotRotesRechteck_X from "./UI/VergleichScatterPlotRotesRechteck_X";
import VergleichScatterPlotRotesRechteck_Y from "./UI/VergleichScatterPlotRotesRechteck_Y";
import Verteilungsfunktion from "./UI/Verteilungsfunktion";
import VerteilungsfunktionRotesRechteck from "./UI/VerteilungsfunktionRotesRechteck";
import MyPie from "./UI/MyPie";
import Select from "./UI/Select";
import HorizontalRule from "./UI/HorizontalRule";

import fetchDaten from "./utils/fetchDaten";
import bezirkZuTemperaturen from "./utils/bezirkZuTemperaturen";
import { temperaturenZuZweitagesmitteln } from "./utils/temperaturenZuZweiUndViertagesmitteln";
import { temperaturenZuViertagesmitteln } from "./utils/temperaturenZuZweiUndViertagesmitteln";
import temperaturenZuPunktwolke from "./utils/temperaturenZuPunktwolke";
import temperaturenZuVerteilungsfunktion from "./utils/temperaturenZuVerteilungsfunktion";
import temperaturenZuPunktwolkeVergleich from "./utils/temperaturenZuPunktwolkeVergleich";
import { tageDesMonats } from "./utils/tageUndMonate";
import { monateDesJahres } from "./utils/tageUndMonate";
import { maxTagDesMonats } from "./utils/tageUndMonate";
import { tagLabel } from "./utils/tageUndMonate";
import { monatLabel } from "./utils/tageUndMonate";
import { auswahlUntereIntervallgrenzen, auswahlObereIntervallgrenzen } from "./utils/auswahlIntervallgrenzen";

function App() {
   const [stationen, setStationen] = useState([]);
   const [bezirke, setBezirke] = useState([]);
   const [temperaturenGesamt, setTemperaturenGesamt] = useState([]);

   useEffect(() => {
      fetchDaten("./stationen.txt", el => ({ id: el[0], name: el[1] }), setStationen);
      fetchDaten("./bezirke.txt", el => ({ id: el[0], name: el[1], idStation: el[2], gewichtStation: Number(el[3]) }), setBezirke);
      fetchDaten("./temperaturen.txt", el => ({ datum: el[0], idStation: el[1], temperatur: Number(el[2]) }), setTemperaturenGesamt);
   }, []);

   const bezirkeIDundName = uniqWith(
      bezirke.map(el => ({ id: el.id, name: el.name })),
      isEqual
   );

   const [anzahlJahre, setAnzahlJahre] = useState(20);
   const [station, setStation] = useState("10410");
   const [bezirk, setBezirk] = useState(undefined);

   const istStation = !!station;
   const istBezirk = !!bezirk;

   const [vergleichsStation, SetVergleichsStation] = useState(undefined);
   const [vergleichsBezirk, SetVergleichsBezirk] = useState(undefined);

   const istVergleichStation = !!vergleichsStation;
   const istVergleichBezirk = !!vergleichsBezirk;

   useEffect(() => {
      if (istStation && istBezirk) setBezirk("");
   }, [station]);

   useEffect(() => {
      if (istBezirk && istStation) setStation("");
   }, [bezirk]);

   useEffect(() => {
      if (istVergleichStation && istVergleichBezirk) SetVergleichsBezirk("");
   }, [vergleichsStation]);

   useEffect(() => {
      if (istVergleichStation && istVergleichBezirk) SetVergleichsStation("");
   }, [vergleichsBezirk]);

   const nameDerStation = stationen.find(el => el.id === station)?.name;
   const nameDesBezirks = bezirkeIDundName.find(el => el.id === bezirk)?.name;

   const nameDerVergleichsStation = stationen.find(el => el.id === vergleichsStation)?.name;
   const nameDesVergleichsBezirks = bezirkeIDundName.find(el => el.id === vergleichsBezirk)?.name;

   const name = istStation ? nameDerStation : nameDesBezirks;
   const nameVergleich = istVergleichStation ? nameDerVergleichsStation : nameDesVergleichsBezirks;

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

   // const minY = -20;
   // const maxY = 35;

   const minIntervallgrenze = -100;
   const maxIntervallgrenze = 100;

   const [untereIntervallgrenze, setUntereIntervallgrenze] = useState(minIntervallgrenze);
   const [obereIntervallgrenze, setObereIntervallgrenze] = useState(maxIntervallgrenze);

   useEffect(() => {
      if (!!untereIntervallgrenze && untereIntervallgrenze >= obereIntervallgrenze) setObereIntervallgrenze(untereIntervallgrenze + 1);
   }, [untereIntervallgrenze]);

   useEffect(() => {
      if (!!obereIntervallgrenze && obereIntervallgrenze <= untereIntervallgrenze) setUntereIntervallgrenze(obereIntervallgrenze - 1);
   }, [obereIntervallgrenze]);

   const [untereIntervallgrenzeVergleich, setUntereIntervallgrenzeVergleich] = useState(minIntervallgrenze);
   const [obereIntervallgrenzeVergleich, setObereIntervallgrenzeVergleich] = useState(maxIntervallgrenze);

   useEffect(() => {
      if (!!untereIntervallgrenzeVergleich && untereIntervallgrenzeVergleich >= obereIntervallgrenzeVergleich)
         setObereIntervallgrenzeVergleich(untereIntervallgrenzeVergleich + 1);
   }, [untereIntervallgrenzeVergleich]);

   useEffect(() => {
      if (!!obereIntervallgrenzeVergleich && obereIntervallgrenzeVergleich <= untereIntervallgrenzeVergleich)
         setUntereIntervallgrenzeVergleich(obereIntervallgrenzeVergleich - 1);
   }, [obereIntervallgrenzeVergleich]);

   const rotesRechteckVergleichDurchsichtig =
      (untereIntervallgrenze === minIntervallgrenze && obereIntervallgrenze === maxIntervallgrenze) ||
      (untereIntervallgrenzeVergleich === minIntervallgrenze && obereIntervallgrenzeVergleich === maxIntervallgrenze);

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

   const endeJahr = max(xAchse.map(el => Number(el.slice(0, 4))));
   const startJahr = endeJahr - anzahlJahre + 1;

   const datenSpeicher = stationen.map(el => ({
      id: el.id,
      name: el.name,
      temperaturen: temperaturenGesamt.filter(t => t.idStation === el.id).map(el => el.temperatur)
   }));

   const bezirksZusammensetzung = bezirke.filter(el => el.id === bezirk);
   const vergleichsBezirksZusammensetzung = bezirke.filter(el => el.id === vergleichsBezirk);

   let tooltipBezirk = null;
   let tooltipVergleichsBezirk = null;

   if (bezirksZusammensetzung.length !== 0) {
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

   if (vergleichsBezirksZusammensetzung.length !== 0) {
      tooltipVergleichsBezirk = (
         <>
            <p className="font-semibold mb-0.5">Temperaturbezirk {nameDesVergleichsBezirks}</p>
            <ul className="ml-5 list-disc">
               {vergleichsBezirksZusammensetzung.map(el => (
                  <li key={el.idStation}>
                     {stationen.find(s => s.id === el.idStation)?.name}: {Math.round(el.gewichtStation * 100)}%
                  </li>
               ))}
            </ul>
         </>
      );
   }

   let TEMP = istStation
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

   let temperaturenVergleich = [];

   if (istVergleichStation || istVergleichBezirk) {
      TEMP = istVergleichStation
         ? temperaturenGesamt.filter(t => t.idStation === vergleichsStation).map(el => el.temperatur)
         : bezirkZuTemperaturen(vergleichsBezirksZusammensetzung, datenSpeicher);

      temperaturenVergleich =
         mittelung === "Tagesmittel"
            ? drop(TEMP, 3)
            : mittelung === "Zweitagesmittel"
            ? drop(temperaturenZuZweitagesmitteln(TEMP), 3)
            : mittelung === "Viertagesmittel"
            ? drop(temperaturenZuViertagesmitteln(TEMP), 3)
            : [];
   }

   const verteilungsfunktion = temperaturenZuVerteilungsfunktion(temperaturen, xAchse, startJahr, startTag, startMonat, endeTag, endeMonat);

   const verteilungsfunktionIntervall = verteilungsfunktion.filter(el => el.x >= untereIntervallgrenze && el.x <= obereIntervallgrenze);

   const dataVerteilungsfunktion = verteilungsfunktion.length === 0 ? [] : [{ id: "Verteilungsfunktion", data: verteilungsfunktion }];

   const dataVerteilungsfunktionRotesRechteck =
      verteilungsfunktionIntervall.length === 0 ? [] : [{ id: "Verteilungsfunktion Intervall", data: verteilungsfunktionIntervall }];

   const anteilImIntervall = verteilungsfunktionIntervall.length === 0 ? 0 : last(verteilungsfunktionIntervall).y - head(verteilungsfunktionIntervall).y;

   const dataIntervallPie = [
      {
         id: "außerhalb",
         value: 1 - anteilImIntervall
      },
      {
         id: "innerhalb",
         value: anteilImIntervall
      }
   ];

   const punktwolke = temperaturenZuPunktwolke(temperaturen, xAchse, startJahr);

   let punktwolkeVergleich = [];

   if (istVergleichStation || istVergleichBezirk) {
      punktwolkeVergleich = temperaturenZuPunktwolkeVergleich(temperaturen, temperaturenVergleich, xAchse, startJahr, startTag, startMonat, endeTag, endeMonat);
   }

   let dataVergleichsPie = [];

   if (istVergleichStation || istVergleichBezirk) {
      const anteilInBeidenIntervallen =
         punktwolkeVergleich[0].data.length === 0
            ? 0
            : punktwolkeVergleich[0].data.filter(
                 el =>
                    el.x >= untereIntervallgrenze &&
                    el.x <= obereIntervallgrenze &&
                    el.y >= untereIntervallgrenzeVergleich &&
                    el.y <= obereIntervallgrenzeVergleich
              ).length / punktwolkeVergleich[0].data.length;

      dataVergleichsPie = [
         {
            id: "außerhalb Schnittmenge",
            value: 1 - anteilInBeidenIntervallen
         },
         {
            id: "innerhalb Schnittmenge",
            value: anteilInBeidenIntervallen
         }
      ];
   }

   let temperaturArt;

   switch (mittelung) {
      case "Tagesmittel":
         temperaturArt = "Tagesmitteltemperatur";
         break;
      case "Zweitagesmittel":
         temperaturArt = "Zweitagesmitteltemperatur";
         break;
      case "Viertagesmittel":
         temperaturArt = "Viertagesmitteltemperatur";
         break;
      default:
         temperaturArt = "Temperatur";
   }

   return (
      <>
         <div className="mx-auto mt-6 md:mt-12 mb-16 md:mb-32 max-w-5xl space-y-4 md:space-y-8">
            <section className="mx-[49px] md:mx-[89px]">
               <h2 className="font-bold text-base md:text-2xl text-DANGER-800 mb-1.5 md:mb-3">Grundeinstellungen</h2>

               <div className="flex flex-col md:flex-row md:items-center md:space-x-5 space-y-2 md:space-y-0">
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
                              className={clsx("flex-shrink-0 w-4 h-4 2xs:w-5 2xs:h-5 focus:outline-none", istBezirk ? "text-stone-500" : "text-stone-300")}
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
               </div>
            </section>

            <HorizontalRule />

            <section>
               <div className="mx-[49px] md:mx-[89px] space-y-0.5 md:space-y-1 mb-1.5 md:mb-3">
                  <h2 className="font-bold text-base md:text-2xl text-DANGER-800">{temperaturArt}en</h2>
                  <h3 className="text-2xs md:text-sm text-stone-400 italic space-y-0.5">
                     <p>
                        Messdaten der Kalenderjahre {startJahr} bis {endeJahr}
                     </p>

                     <p>
                        {istStation ? "Temperaturstation" : "Temperaturbezirk"} {name}
                     </p>
                  </h3>
               </div>

               {punktwolke && (
                  <>
                     <div className="relative hidden md:block w-full aspect-[16/11]">
                        <div className="absolute inset-0">
                           <ScatterPlotRotesRechteck startTag={startTag} startMonat={startMonat} endeTag={endeTag} endeMonat={endeMonat} />
                        </div>
                        <div className="absolute inset-0">
                           <ScatterPlot data={punktwolke} />
                        </div>
                     </div>
                     <div className="relative md:hidden w-full aspect-[16/11]">
                        <div className="absolute inset-0">
                           <ScatterPlotRotesRechteck startTag={startTag} startMonat={startMonat} endeTag={endeTag} endeMonat={endeMonat} smartphone />
                        </div>
                        <div className="absolute inset-0">
                           <ScatterPlot data={punktwolke} smartphone />
                        </div>
                     </div>
                  </>
               )}
            </section>

            <HorizontalRule />

            <section className="mx-[49px] md:mx-[89px]">
               <h2 className="font-bold text-base md:text-2xl text-DANGER-800 mb-1.5 md:mb-3">Eingrenzung der Jahreszeit</h2>

               <div className="flex flex-col md:flex-row md:items-center md:space-x-5 space-y-2 md:space-y-0">
                  <div>
                     <p className="mb-1 font-semibold ml-1">Start des Ausschnitts</p>
                     <div className="flex items-center space-x-1.5">
                        <Select options={tageDesMonats[startMonat]} value={startTag} onChange={event => setStartTag(Number(event.target.value))} />
                        <Select options={monateDesJahres} value={startMonat} onChange={event => setStartMonat(Number(event.target.value))} />
                     </div>
                  </div>

                  <div>
                     <p className="mb-1 font-semibold ml-1">Ende des Ausschnitts</p>
                     <div className="flex items-center space-x-1.5">
                        <Select options={tageDesMonats[endeMonat]} value={endeTag} onChange={event => setEndeTag(Number(event.target.value))} />
                        <div className="flex items-end 2xs:space-x-3 space-x-2">
                           <Select options={monateDesJahres} value={endeMonat} onChange={event => setEndeMonat(Number(event.target.value))} />
                           <InformationCircleIcon
                              data-tooltip-id="zeitraum"
                              className="mb-1 2xs:mb-1.5 text-stone-500 flex-shrink-0 w-4 h-4 2xs:w-5 2xs:h-5 focus:outline-none"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            <HorizontalRule />

            <section>
               <div className="mx-[49px] md:mx-[89px] space-y-0.5 md:space-y-1 mb-1.5 md:mb-3">
                  <h2 className="font-bold text-base md:text-2xl text-DANGER-800">Empirische Verteilungsfunktion</h2>
                  <h3 className="text-2xs md:text-sm text-stone-400 italic space-y-0.5">
                     <p>
                        Messdaten der Kalenderjahre {startJahr} bis {endeJahr}
                     </p>
                     <p>
                        Jahreszeit {tagLabel[startTag]} {monatLabel[startMonat]} bis {tagLabel[endeTag]} {monatLabel[endeMonat]}
                     </p>
                     <p>
                        {istStation ? "Temperaturstation" : "Temperaturbezirk"} {name}
                     </p>
                  </h3>
               </div>

               <div className="relative hidden md:block w-full aspect-[16/11]">
                  <div className="absolute inset-0">
                     <VerteilungsfunktionRotesRechteck
                        data={dataVerteilungsfunktionRotesRechteck}
                        durchsichtig={untereIntervallgrenze === minIntervallgrenze && obereIntervallgrenze === maxIntervallgrenze}
                     />
                  </div>
                  <div className="absolute inset-0">
                     <Verteilungsfunktion data={dataVerteilungsfunktion} temperaturArt={temperaturArt} />
                  </div>
               </div>

               <div className="relative md:hidden w-full aspect-[16/11]">
                  <div className="absolute inset-0">
                     <VerteilungsfunktionRotesRechteck
                        data={dataVerteilungsfunktionRotesRechteck}
                        smartphone
                        durchsichtig={untereIntervallgrenze === minIntervallgrenze && obereIntervallgrenze === maxIntervallgrenze}
                     />
                  </div>
                  <div className="absolute inset-0">
                     <Verteilungsfunktion data={dataVerteilungsfunktion} smartphone temperaturArt={temperaturArt} />
                  </div>
               </div>
            </section>

            <HorizontalRule />

            <section className="mx-[49px] md:mx-[89px]">
               <h2 className="font-bold text-base md:text-2xl text-DANGER-800 mb-1.5 md:mb-3">Temperaturintervall</h2>

               <div className="flex flex-col md:flex-row md:items-center md:space-x-5 space-y-2 md:space-y-0">
                  <div>
                     <p className="mb-1 font-semibold ml-1">Untere Intervallgrenze</p>
                     <Select
                        options={auswahlUntereIntervallgrenzen.map(el => ({ id: el.id, label: el.label }))}
                        value={untereIntervallgrenze}
                        onChange={event => setUntereIntervallgrenze(Number(event.target.value))}
                     />
                  </div>

                  <div>
                     <p className="mb-1 font-semibold ml-1">Obere Intervallgrenze</p>
                     <Select
                        options={auswahlObereIntervallgrenzen.map(el => ({ id: el.id, label: el.label }))}
                        value={obereIntervallgrenze}
                        onChange={event => setObereIntervallgrenze(Number(event.target.value))}
                     />
                  </div>
               </div>
            </section>

            <HorizontalRule />

            <section>
               <div className="mx-[49px] md:mx-[89px] space-y-0.5 md:space-y-1 mb-1.5 md:mb-3">
                  <h2 className="font-bold text-base md:text-2xl text-DANGER-800">Empirische Wahrscheinlichkeit des Temperaturintervalls</h2>
                  <h3 className="text-2xs md:text-sm text-stone-400 italic space-y-0.5">
                     <p>
                        Messdaten der Kalenderjahre {startJahr} bis {endeJahr}
                     </p>
                     <p>
                        Jahreszeit {tagLabel[startTag]} {monatLabel[startMonat]} bis {tagLabel[endeTag]} {monatLabel[endeMonat]}
                     </p>
                     <p>
                        {istStation ? "Temperaturstation" : "Temperaturbezirk"} {name}
                     </p>
                     <p>
                        Temperaturintervall {auswahlUntereIntervallgrenzen.find(el => el.id === untereIntervallgrenze).label} bis{" "}
                        {auswahlObereIntervallgrenzen.find(el => el.id === obereIntervallgrenze).label}
                     </p>
                     <p>{temperaturArt}en</p>
                  </h3>
               </div>

               <div className="hidden md:block w-full aspect-[2.8/1]">
                  <MyPie data={dataIntervallPie} />
               </div>

               <div className="md:hidden w-full aspect-[2.8/1]">
                  <MyPie data={dataIntervallPie} smartphone />
               </div>
            </section>

            <HorizontalRule />

            <section className="mx-[49px] md:mx-[89px]">
               <h2 className="font-bold text-base md:text-2xl text-DANGER-800 mb-1.5 md:mb-3">Vergleich mit einer zweiten Station bzw. einem zweiten Bezirk</h2>

               <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-5 space-y-2 lg:space-y-0">
                  <Select
                     label="Station zum Vergleich"
                     options={stationen.map(el => ({ id: el.id, label: el.name }))}
                     value={vergleichsStation}
                     onChange={event => SetVergleichsStation(event.target.value)}
                     leereOption={true}
                  />
                  <Select
                     label="Bezirk zum Vergleich"
                     options={bezirkeIDundName.map(el => ({ id: el.id, label: el.name }))}
                     value={vergleichsBezirk}
                     onChange={event => SetVergleichsBezirk(event.target.value)}
                     leereOption={true}
                     icon={
                        <InformationCircleIcon
                           data-tooltip-id="Zusammensetzung des Vergleichsbezirks"
                           className={clsx(
                              "flex-shrink-0 w-4 h-4 2xs:w-5 2xs:h-5 focus:outline-none",
                              istVergleichBezirk ? "text-stone-500" : "text-stone-300"
                           )}
                        />
                     }
                  />
               </div>
            </section>

            <HorizontalRule />

            {(istVergleichStation || istVergleichBezirk) && (
               <>
                  <section>
                     <div className="mx-[49px] md:mx-[89px] space-y-0.5 md:space-y-1 mb-1.5 md:mb-3">
                        <h2 className="font-bold text-base md:text-2xl text-DANGER-800">Vergleich der {temperaturArt}en</h2>
                        <h3 className="text-2xs md:text-sm text-stone-400 italic space-y-0.5">
                           <p>
                              Messdaten der Kalenderjahre {startJahr} bis {endeJahr}
                           </p>
                           <p>
                              Jahreszeit {tagLabel[startTag]} {monatLabel[startMonat]} bis {tagLabel[endeTag]} {monatLabel[endeMonat]}
                           </p>
                           <p>
                              {istStation ? "A: Temperaturstation" : "A: Temperaturbezirk"} {name}
                           </p>
                           <p>
                              {istVergleichStation ? "B: Temperaturstation" : "B: Temperaturbezirk"} {nameVergleich}
                           </p>
                        </h3>
                     </div>

                     {punktwolkeVergleich && (
                        <>
                           <div className="relative hidden md:block w-full aspect-[16/11]">
                              <div className="absolute inset-0">
                                 <VergleichScatterPlotRotesRechteck_X
                                    untereGrenze={untereIntervallgrenze}
                                    obereGrenze={obereIntervallgrenze}
                                    durchsichtig={rotesRechteckVergleichDurchsichtig}
                                 />
                              </div>
                              <div className="absolute inset-0">
                                 <VergleichScatterPlotRotesRechteck_Y
                                    untereGrenze={untereIntervallgrenzeVergleich}
                                    obereGrenze={obereIntervallgrenzeVergleich}
                                    durchsichtig={rotesRechteckVergleichDurchsichtig}
                                 />
                              </div>
                              <div className="absolute inset-0">
                                 <VergleichScatterPlot data={punktwolkeVergleich} nameX={name} nameY={nameVergleich} />
                              </div>
                           </div>
                           <div className="relative md:hidden w-full aspect-[16/11]">
                              <div className="absolute inset-0">
                                 <VergleichScatterPlotRotesRechteck_X
                                    untereGrenze={untereIntervallgrenze}
                                    obereGrenze={obereIntervallgrenze}
                                    durchsichtig={rotesRechteckVergleichDurchsichtig}
                                    smartphone
                                 />
                              </div>
                              <div className="absolute inset-0">
                                 <VergleichScatterPlotRotesRechteck_Y
                                    untereGrenze={untereIntervallgrenzeVergleich}
                                    obereGrenze={obereIntervallgrenzeVergleich}
                                    durchsichtig={rotesRechteckVergleichDurchsichtig}
                                    smartphone
                                 />
                              </div>
                              <div className="absolute inset-0">
                                 <VergleichScatterPlot data={punktwolkeVergleich} smartphone nameX={name} nameY={nameVergleich} />
                              </div>
                           </div>
                        </>
                     )}
                  </section>

                  <HorizontalRule />

                  <section className="mx-[49px] md:mx-[89px]">
                     <h2 className="font-bold text-base md:text-2xl text-DANGER-800 mb-1.5 md:mb-3">
                        Temperaturintervall {istVergleichStation ? "der Vergleichsstation" : "des Vergleichsbezirks"}
                     </h2>

                     <div className="flex flex-col md:flex-row md:items-center md:space-x-5 space-y-2 md:space-y-0">
                        <div>
                           <p className="mb-1 font-semibold ml-1">Untere Intervallgrenze</p>
                           <Select
                              options={auswahlUntereIntervallgrenzen.map(el => ({ id: el.id, label: el.label }))}
                              value={untereIntervallgrenzeVergleich}
                              onChange={event => setUntereIntervallgrenzeVergleich(Number(event.target.value))}
                           />
                        </div>

                        <div>
                           <p className="mb-1 font-semibold ml-1">Obere Intervallgrenze</p>
                           <Select
                              options={auswahlObereIntervallgrenzen.map(el => ({ id: el.id, label: el.label }))}
                              value={obereIntervallgrenzeVergleich}
                              onChange={event => setObereIntervallgrenzeVergleich(Number(event.target.value))}
                           />
                        </div>
                     </div>
                  </section>

                  <HorizontalRule />

                  <section>
                     <div className="mx-[49px] md:mx-[89px] space-y-0.5 md:space-y-1 mb-1.5 md:mb-3">
                        <h2 className="font-bold text-base md:text-2xl text-DANGER-800">Schnittmenge der Intervalle: Empirische Wahrscheinlichkeit</h2>
                        <h3 className="text-2xs md:text-sm text-stone-400 italic space-y-0.5">
                           <p>
                              Messdaten der Kalenderjahre {startJahr} bis {endeJahr}
                           </p>
                           <p>
                              Jahreszeit {tagLabel[startTag]} {monatLabel[startMonat]} bis {tagLabel[endeTag]} {monatLabel[endeMonat]}
                           </p>
                           <p>
                              {istStation ? "A: Temperaturstation" : "A: Temperaturbezirk"} {name}
                           </p>
                           <p>
                              {istVergleichStation ? "B: Temperaturstation" : "B: Temperaturbezirk"} {nameVergleich}
                           </p>

                           <p>
                              Temperaturintervall {name}: {auswahlUntereIntervallgrenzen.find(el => el.id === untereIntervallgrenze).label} bis{" "}
                              {auswahlObereIntervallgrenzen.find(el => el.id === obereIntervallgrenze).label}
                           </p>
                           <p>
                              Temperaturintervall {nameVergleich}: {auswahlUntereIntervallgrenzen.find(el => el.id === untereIntervallgrenzeVergleich).label}{" "}
                              bis {auswahlObereIntervallgrenzen.find(el => el.id === obereIntervallgrenzeVergleich).label}
                           </p>
                           <p>{temperaturArt}en</p>
                        </h3>
                     </div>

                     <div className="hidden md:block w-full aspect-[2.8/1]">
                        <MyPie data={dataVergleichsPie} />
                     </div>

                     <div className="md:hidden w-full aspect-[2.8/1]">
                        <MyPie data={dataVergleichsPie} smartphone />
                     </div>
                  </section>

                  <HorizontalRule />
               </>
            )}
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

         <Tooltip id="zeitraum" delayShow={400} variant="error">
            <div className="space-y-2 max-w-sm">
               <p>Eingrenzung der Jahreszeit, die bei der Bestimmung der empirischen Verteilungsfunktion berücksichtigt wird</p>
               <div>
                  <p className="font-semibold">Beispiel: Monate April und Mai</p>
                  <p>Start des Ausschnitts: 01. April</p>
                  <p>Ende des Ausschnitts: 31. Mai</p>
               </div>
               <div>
                  <p className="font-semibold">Beispiel: Winterhalbjahr</p>
                  <p>Start des Ausschnitts: 01. Oktober</p>
                  <p>Ende des Ausschnitts: 31. März</p>
               </div>
            </div>
         </Tooltip>

         {tooltipBezirk && (
            <Tooltip id="Zusammensetzung des Bezirks" delayShow={400} variant="error">
               {tooltipBezirk}
            </Tooltip>
         )}

         {tooltipVergleichsBezirk && (
            <Tooltip id="Zusammensetzung des Vergleichsbezirks" delayShow={400} variant="error">
               {tooltipVergleichsBezirk}
            </Tooltip>
         )}

         <Tooltip id="tooltip" delayShow={400} variant="error" />
      </>
   );
}

export default App;
