import { parse, getYear, setYear, isAfter, isBefore } from "date-fns";
import zip from "lodash/zip.js";
import sortBy from "lodash/sortBy.js";

const temperaturReferenz = [
   -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
   19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
];

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

   const verteilungsfunktion = temperaturReferenz.map(el => ({
      x: el,
      y: gesamtZahl === 0 ? 0 : temperaturenSortiert.filter(t => t < el).length / gesamtZahl
   }));

   return [{ id: "Verteilungsfunktion", data: verteilungsfunktion }];
};

export default temperaturenZuVerteilungsfunktion;
