import { useState, useEffect } from "react";

import { dropRight } from "lodash";

function App() {
   const [stationen, setStationen] = useState([]);
   const [temperaturen, setTemperaturen] = useState([]);
   const [bezirke, setBezirke] = useState([]);

   const [station, setStation] = useState("10410");

   // Annahmen zu den txt-Dateien:
   // 1. Excel: Die ID-Spalten sind als Text formatiert, um führende Nullen zu erhalten.
   // 1. Speichern unter: CSV UTF-8
   // 2. Dateiendung umbenennen in .txt
   // 3. Überflüssige leere Zeilen am Ende sind entfernt.

   // Annahmen zur Datei temperaturen.txt:
   // 1. Die Temperaturen wurden in Excel vorsortiert nach 1. ID und 2. Datum.
   // 2. Es gibt keine Lücken in den Daten.

   useEffect(() => {
      const fetchTemperaturen = async () => {
         const response = await fetch("/temperaturen.txt");
         const data = await response.text();

         const temperaturen = data
            .split("\r\n")
            .map(el => el.split(";"))
            .map(el => ({
               id: el[0],
               datum: el[1],
               temperatur: Number(el[2])
            }));

         setTemperaturen(temperaturen);
      };

      fetchTemperaturen();
   }, []);

   useEffect(() => {
      const fetchStationen = async () => {
         const response = await fetch("/stationen.txt");
         const data = await response.text();

         const stationen = data
            .split("\r\n")
            .map(el => el.split(";"))
            .map(el => ({
               id: el[0],
               name: el[1]
            }));

         setStationen(stationen);
      };

      fetchStationen();
   }, []);

   useEffect(() => {
      const fetchBezirke = async () => {
         const response = await fetch("/bezirke.txt");
         const data = await response.text();

         const bezirke = data
            .split("\r\n")
            .map(el => el.split(";"))
            .map(el => ({
               bezirk: el[0],
               id: el[1],
               prozent: Number(el[2])
            }));

         setBezirke(bezirke);
      };

      fetchBezirke();
   }, []);

   const datenSilo = stationen.map(station => ({
      id: station.name,
      data: temperaturen.filter(t => t.id === station.id).map(t => ({ x: t.datum, y: t.temperatur }))
   }));

   //  console.log(stationen);
   //  console.log(bezirke);
   //  console.log(temperaturen);

   //  console.log(datenSilo[0]);

   return <div>Hello World!</div>;
}

export default App;
