import { useState, useEffect } from "react";

import ScatterPlot from "./UI/ScatterPlot";

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
   // 1. Speichern unter: CSV UTF-8
   // 2. Dateiendung umbenennen in .txt
   // 3. Überflüssige leere Zeilen am Ende sind entfernt.

   // Annahmen zur Datei temperaturen.txt:
   // 1. Die Temperaturen wurden in Excel vorsortiert nach 1. ID und 2. Datum.
   // 2. Es gibt keine Lücken in den Daten.

   useEffect(() => {
      fetchDaten("/stationen.txt", el => ({ id: el[0], name: el[1] }), setStationen);
      fetchDaten("/bezirke.txt", el => ({ bezirk: el[0], id: el[1], prozent: Number(el[2]) }), setBezirke);
      fetchDaten("/temperaturen.txt", el => ({ id: el[0], datum: el[1], temperatur: Number(el[2]) }), setTemperaturen);
   }, []);

   const datenSilo = {
      id: nameDerStation,
      data: temperaturen.filter(el => el.id === station).map(el => ({ x: el.datum, y: el.temperatur }))
   };

   console.log(datenSilo);

   //  console.log(stationen);
   //  console.log(bezirke);
   //  console.log(temperaturen);

   //  console.log(datenSilo[0]);

   return (
      <div className="mt-10 mx-auto max-w-5xl h-[48rem]">
         <ScatterPlot />
      </div>
   );
}

export default App;
