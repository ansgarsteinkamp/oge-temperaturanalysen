import { useState, useEffect } from "react";

import uniq from "lodash/uniq.js";

import MyScatterPlot from "./UI/ScatterPlot";
import Select from "./UI/Select";

const fetchDaten = async (datei, myMap, setState) => {
   const response = await fetch(datei);
   const data = await response.text();

   const result = data
      .split("\r\n")
      .map(el => el.split(";"))
      .map(myMap);

   setState(result);
};

function App() {
   const [stationen, setStationen] = useState([]);
   const [bezirke, setBezirke] = useState([]);
   const [temperaturen, setTemperaturen] = useState([]);

   const [station, setStation] = useState("10410");
   const nameDerStation = stationen.find(el => el.id === station)?.name;

   // console.log(stationen);

   // Annahmen zu den txt-Dateien:
   // 1. Excel: Die ID-Spalten sind als Text formatiert (=> führende Nullen bleiben erhalten).
   // 1. Speichern unter... CSV UTF-8
   // 2. Dateiendung umbenennen in .txt
   // 3. Überflüssige leere Zeilen am Ende sind entfernt.

   // Annahme zur Datei stationen.txt:
   // Die Stationen wurden in Excel vorsortiert nach dem Namen.

   // Annahmen zur Datei temperaturen.txt:
   // 1. Die Temperaturen wurden in Excel vorsortiert nach 1. ID und 2. Datum.
   // 2. Es gibt keine Lücken in den Daten.

   useEffect(() => {
      fetchDaten("/stationen.txt", el => ({ id: el[0], name: el[1] }), setStationen);
      fetchDaten("/bezirke.txt", el => ({ bezirk: el[0], id: el[1], prozent: Number(el[2]) }), setBezirke);
      fetchDaten("/temperaturen.txt", el => ({ id: el[0], jahr: Number(el[1]), datum: el[2], temperatur: Number(el[3]) }), setTemperaturen);
   }, []);

   const jahre = uniq(temperaturen.map(el => el.jahr));
   const minJahr = Math.min(...jahre);
   const maxJahr = Math.max(...jahre);

   // Für jedes Jahr ein Array mit den Temperaturen der Station
   const punktwolke = jahre.map(jahr => ({
      id: jahr,
      data: temperaturen.filter(el => el.id === station && el.jahr === jahr).map(el => ({ x: el.datum, y: el.temperatur }))
   }));

   // Maximum der Temperaturwerte
   // let maxY = Math.max(...punktwolke.map(jahr => Math.max(...jahr.data.map(tag => tag.y))));
   // let minY = Math.min(...punktwolke.map(jahr => Math.min(...jahr.data.map(tag => tag.y))));

   // maxY = Math.ceil(maxY / 5) * 5;
   // minY = Math.floor(minY / 5) * 5;

   return (
      <div className="mx-auto mt-10 max-w-5xl">
         <div className="mb-1 sm:mb-3 ml-[59px] sm:ml-[89px] ">
            <Select className="mb-3" options={stationen} value={station} onChange={event => setStation(event.target.value)} />
            <h1 className="font-semibold text-xs sm:text-2xl">Tagesmitteltemperaturen {nameDerStation}</h1>
            <h2 className="text-4xs sm:text-xs text-stone-400">
               01.01.{minJahr} bis 31.12.{maxJahr}
            </h2>
         </div>
         <div className="hidden sm:block w-full aspect-[16/11]">
            <MyScatterPlot data={punktwolke} />
         </div>
         <div className="sm:hidden w-full aspect-[16/11]">
            <MyScatterPlot data={punktwolke} smartphone />
         </div>
      </div>
   );
}

export default App;
