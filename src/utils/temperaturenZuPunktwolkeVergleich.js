import { parse, getYear, setYear, isAfter, isBefore } from "date-fns";

import zip from "lodash/zip.js";
import groupBy from "lodash/groupBy.js";
import map from "lodash/map.js";

// temperaturen: [ 0.2, -3.1, ... ]
// temperaturenVergleich: [ 0.2, -3.1, ... ]
// xAchse: [ "2003-01-01", "2003-01-02", ... ]

// => [ { id: 2003, data: [ {x: Temperatur, y: Temperatur}, ... ] }, ...]

const temperaturenZuPunktwolkeVergleich = (temperaturen, temperaturenVergleich, xAchse, startJahr, startTag, startMonat, endeTag, endeMonat) => {
   const start = new Date(2000, startMonat - 1, startTag);
   const ende = new Date(2000, endeMonat - 1, endeTag);

   const punktwolke = zip(
      xAchse.map(el => parse(el, "yyyy-MM-dd", new Date())),
      temperaturen,
      temperaturenVergleich
   )
      .filter(el => getYear(el[0]) >= startJahr)
      .map(el => ({ datum: el[0], datum2000: setYear(el[0], 2000), temperatur: el[1], temperaturVergleich: el[2] }))
      .filter(el =>
         !isBefore(ende, start)
            ? !isBefore(el.datum2000, start) && !isAfter(el.datum2000, ende)
            : !isAfter(el.datum2000, ende) || !isBefore(el.datum2000, start)
      )
      .map(el => ({ jahr: getYear(el.datum), x: el.temperatur, y: el.temperaturVergleich }));

   return map(
      groupBy(punktwolke, el => el.jahr),
      (xyzWerte, jahr) => ({ id: jahr, data: xyzWerte.map(xyz => ({ x: xyz.x, y: xyz.y })) })
   );
};

export default temperaturenZuPunktwolkeVergleich;
