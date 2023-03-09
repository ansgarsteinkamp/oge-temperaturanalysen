import { parse, getYear, setYear, isAfter, isBefore } from "date-fns";

import zip from "lodash/zip.js";
import groupBy from "lodash/groupBy.js";
import map from "lodash/map.js";

// temperaturen: [ 0.2, -3.1, ... ]
// temperaturenVergleich: [ 0.2, -3.1, ... ]
// xAchse: [ "2003-01-01", "2003-01-02", ... ]

// => [ { id: "2003-01-01", data: [ {x: Temperatur, y: Temperatur} ] }, ...]

const temperaturenZuPunktwolkeVergleich = (temperaturen, temperaturenVergleich, xAchse, startJahr, startTag, startMonat, endeTag, endeMonat) => {
   const start = new Date(2000, startMonat - 1, startTag);
   const ende = new Date(2000, endeMonat - 1, endeTag);

   const punktwolke = zip(
      xAchse,
      xAchse.map(el => parse(el, "yyyy-MM-dd", new Date())),
      temperaturen,
      temperaturenVergleich
   )
      .filter(el => getYear(el[1]) >= startJahr)
      .map(el => ({ datum: el[0], dateObjekt2000: setYear(el[1], 2000), temperatur: el[2], temperaturVergleich: el[3] }))
      .filter(el =>
         !isBefore(ende, start)
            ? !isBefore(el.dateObjekt2000, start) && !isAfter(el.dateObjekt2000, ende)
            : !isAfter(el.dateObjekt2000, ende) || !isBefore(el.dateObjekt2000, start)
      )
      .map(el => ({ id: el.datum, data: [{ x: el.temperatur, y: el.temperaturVergleich }] }));

   return punktwolke;
};

export default temperaturenZuPunktwolkeVergleich;
