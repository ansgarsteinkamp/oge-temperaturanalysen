import zip from "lodash/zip";
import sum from "lodash/sum";

// bezirk: [ { id, name, idStation, gewichtStation } , ... ]
// datenSpeicher: [ { id, name, istEinBezirk, temperaturen }, ... ]
const bezirkZuTemperaturen = (bezirk, datenSpeicher) => {
   const gewichteUndTemperaturen = bezirk.map(el => ({
      gewicht: el.gewichtStation,
      temperaturen: datenSpeicher.find(d => d.id === el.idStation).temperaturen
   }));

   const ausmultipliziert = gewichteUndTemperaturen.map(el => el.temperaturen.map(t => t * el.gewicht));

   return zip(...ausmultipliziert).map(el => sum(el));
};

export default bezirkZuTemperaturen;
