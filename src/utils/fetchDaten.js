const fetchDaten = async (datei, konverter, setState) => {
   const response = await fetch(datei);
   const data = await response.text();

   const result = data
      .split("\r\n")
      .map(el => el.split(";"))
      .map(konverter);

   setState(result);
};

export default fetchDaten;
