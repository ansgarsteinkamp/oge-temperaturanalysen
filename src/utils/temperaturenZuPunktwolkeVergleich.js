import { parse, getYear, setYear, isAfter, isBefore } from "date-fns";

import zip from "lodash/zip.js";
import groupBy from "lodash/groupBy.js";

// temperaturen: [ 0.2, -3.1, ... ]
// temperaturenVergleich: [ 0.2, -3.1, ... ]
// xAchse: [ "2003-01-01", "2003-01-02", ... ]

// => [ { id: "Temperaturenvergleich", data: [ {x: Temperatur, y: Temperatur}, ... ] }, ...]

const temperaturenZuPunktwolkeVergleich = (temperaturen, temperaturenVergleich, xAchse, startJahr, startTag, startMonat, endeTag, endeMonat) => {
   const start = new Date(2000, startMonat - 1, startTag);
   const ende = new Date(2000, endeMonat - 1, endeTag);

   const punktwolke = zip(
      xAchse.map(el => parse(el, "yyyy-MM-dd", new Date())),
      temperaturen,
      temperaturenVergleich
   )
      .filter(el => getYear(el[0]) >= startJahr)
      .map(el => ({ datum: setYear(el[0], 2000), temperatur: el[1], temperaturVergleich: el[2] }))
      .filter(el => (!isBefore(ende, start) ? !isBefore(el.datum, start) && !isAfter(el.datum, ende) : !isAfter(el.datum, ende) || !isBefore(el.datum, start)))
      .map(el => ({ x: el.temperatur, y: el.temperaturVergleich }));

   return [{ id: "Temperaturenvergleich", data: punktwolke }];
};

export default temperaturenZuPunktwolkeVergleich;
