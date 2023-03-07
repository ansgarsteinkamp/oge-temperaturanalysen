import { parse, getYear, setYear, isAfter, isBefore } from "date-fns";

import zip from "lodash/zip.js";
import sortBy from "lodash/sortBy.js";

import temperaturenReferenz from "./temperaturenReferenz.js";

// temperaturen: [ 0.2, -3.1, ... ]
// xAchse: [ "2003-01-01", "2003-01-02", ... ]

// => [ { x: -20, y: 0 }, { x: -19, y: 0 }, ... { x: 35, y: 1 } ];

const temperaturenZuVerteilungsfunktion = (temperaturen, xAchse, startJahr, startTag, startMonat, endeTag, endeMonat) => {
   const start = new Date(2000, startMonat - 1, startTag);
   const ende = new Date(2000, endeMonat - 1, endeTag);

   const temperaturenSortiert = sortBy(
      zip(
         xAchse.map(el => parse(el, "yyyy-MM-dd", new Date())),
         temperaturen
      )
         .filter(el => getYear(el[0]) >= startJahr)
         .map(el => ({ datum: setYear(el[0], 2000), temperatur: el[1] }))
         .filter(el => (isAfter(ende, start) ? !isBefore(el.datum, start) && !isAfter(el.datum, ende) : !isAfter(el.datum, ende) || !isBefore(el.datum, start)))
         .map(el => el.temperatur)
   );

   const gesamtZahl = temperaturenSortiert.length;

   return temperaturenReferenz.map(el => ({
      x: el,
      y: gesamtZahl === 0 ? 0 : temperaturenSortiert.filter(t => t < el).length / gesamtZahl
   }));
};

export default temperaturenZuVerteilungsfunktion;
