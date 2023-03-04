import zip from "lodash/zip.js";
import { parse, setYear, isAfter, isBefore } from "date-fns";
import countBy from "lodash/countBy.js";
import map from "lodash/map.js";
import sortBy from "lodash/sortBy.js";

const temperaturReferenz = [
   -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
   19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34
];

// temperaturen: [ 0.2, -3.1, ... ]
// xAchse: [ "2003-01-01", "2003-01-02", ... ]

// => [ { temperatur: -19.5, anzahl: 0 }, { temperatur: -18.5, anzahl: 0 }, ... { temperatur: 34.5, anzahl: 0 } ];

const zeitraumZuHistogramm = (temperaturen, xAchse, startTag, startMonat, endeTag, endeMonat) => {
   const start = new Date(2000, startMonat - 1, startTag);
   const ende = new Date(2000, endeMonat - 1, endeTag);

   const temperaturAusschnitt = zip(
      xAchse.map(el => setYear(parse(el, "yyyy-MM-dd", new Date()), 2000)),
      temperaturen
   )
      .filter(el => (isAfter(ende, start) ? !isBefore(el[0], start) && !isAfter(el[0], ende) : !isAfter(el[0], ende) || !isBefore(el[0], start)))
      .map(el => el[1]);

   let histogramm = countBy(temperaturAusschnitt, Math.floor);

   return temperaturReferenz.map(el => ({
      temperatur: el + 0.5,
      anzahl: histogramm[el] || 0
   }));
};

export default zeitraumZuHistogramm;
