import { useState, useEffect } from "react";

import uniq from "lodash/uniq.js";

import MyScatterPlot from "./UI/ScatterPlot";

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

   // Annahmen zu den txt-Dateien:
   // 1. Excel: Die ID-Spalten sind als Text formatiert, um führende Nullen zu erhalten.
   // 1. Speichern unter... CSV UTF-8
   // 2. Dateiendung umbenennen in .txt
   // 3. Überflüssige leere Zeilen am Ende sind entfernt.

   // Annahmen zur Datei temperaturen.txt:
   // 1. Die Temperaturen wurden in Excel vorsortiert nach 1. ID und 2. Datum.
   // 2. Es gibt keine Lücken in den Daten.

   useEffect(() => {
      fetchDaten("/stationen.txt", el => ({ id: el[0], name: el[1] }), setStationen);
      fetchDaten("/bezirke.txt", el => ({ bezirk: el[0], id: el[1], prozent: Number(el[2]) }), setBezirke);
      fetchDaten("/temperaturen.txt", el => ({ id: el[0], jahr: Number(el[1]), datum: el[2], temperatur: Number(el[3]) }), setTemperaturen);
   }, []);

   const jahre = uniq(temperaturen.map(el => el.jahr));

   // Für jedes Jahr ein Array mit den Temperaturen der Station
   const datenSilo = jahre.map(jahr => ({
      id: jahr,
      data: temperaturen.filter(el => el.id === station && el.jahr === jahr).map(el => ({ x: el.datum, y: el.temperatur }))
   }));
   // .filter(el => el.id > 2012);

   // const datenSilo = temperaturen.filter(el => el.id === station).map(el => ({ x: el.datum, y: el.temperatur }));

   // Gruppiert nach dem Jahr
   // let datenSilo = groupBy(temperaturen, el => el.jahr);

   // Array der Struktur [{ id: "2019", data: [{ x: "01-01", y: 7 }, { x: "01-02", y: 5 }, ...] }, ...]

   // console.log(datenSilo);

   //  console.log(stationen);
   //  console.log(bezirke);
   // console.log(datenSilo[0]);

   //  console.log(datenSilo[0]);

   return (
      <div className="mx-auto mt-10 max-w-7xl aspect-video">
         <MyScatterPlot data={datenSilo} />
      </div>
   );
}

export default App;
