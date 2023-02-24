import zip from "lodash/zip.js";
import groupBy from "lodash/groupBy.js";

// temperaturen: Temperaturen-Array
// xAchse: [ "2003-01-01", ... ]

// => [ { id: 2003, data: [ {x: "01-01", y: temperatur}] }, ...]

const temperaturenZuPunktwolke = (temperaturen, xAchse, startJahr) => {
   const punktwolke = groupBy(
      zip(
         xAchse.map(el => ({ jahr: Number(el.slice(0, 4)), monatTag: el.slice(5, 10) })),
         temperaturen
      ).filter(el => el[0].jahr >= startJahr),
      el => el[0].jahr
   );

   const jahre = Object.keys(punktwolke).map(el => Number(el));

   return jahre.map(jahr => ({
      id: jahr,
      data: punktwolke[jahr].map(el => ({ x: el[0].monatTag, y: el[1] }))
   }));
};

export default temperaturenZuPunktwolke;
