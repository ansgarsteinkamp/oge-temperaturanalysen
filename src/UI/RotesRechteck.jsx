import { ResponsiveLine } from "@nivo/line";

const tag = {
   1: "01",
   2: "02",
   3: "03",
   4: "04",
   5: "05",
   6: "06",
   7: "07",
   8: "08",
   9: "09",
   10: "10",
   11: "11",
   12: "12",
   13: "13",
   14: "14",
   15: "15",
   16: "16",
   17: "17",
   18: "18",
   19: "19",
   20: "20",
   21: "21",
   22: "22",
   23: "23",
   24: "24",
   25: "25",
   26: "26",
   27: "27",
   28: "28",
   29: "29",
   30: "30",
   31: "31"
};

const monat = {
   1: "01",
   2: "02",
   3: "03",
   4: "04",
   5: "05",
   6: "06",
   7: "07",
   8: "08",
   9: "09",
   10: "10",
   11: "11",
   12: "12"
};

const RotesRechteck = ({ startTag, startMonat, endeTag, endeMonat, minY = -20, maxY = 35, smartphone = false }) => (
   <ResponsiveLine
      lineWidth={0}
      areaBaselineValue={minY}
      areaOpacity={0.3}
      enablePoints={false}
      margin={{ top: 10, right: smartphone ? 20 : 50, bottom: 40, left: smartphone ? 50 : 90 }}
      data={[
         {
            id: "Rotes Rechteck",
            data: [
               { x: `${monat[startMonat]}-${tag[startTag]}`, y: maxY },
               { x: endeMonat === 12 && endeTag === 31 ? "13-01" : `${monat[endeMonat]}-${tag[endeTag]}`, y: maxY }
            ]
         }
      ]}
      xScale={{
         type: "time",
         format: "%m-%d",
         precision: "day",
         min: "01-01",
         max: "13-02"
      }}
      yScale={{ type: "linear", min: minY, max: maxY, stacked: false, reverse: false }}
      enableArea={true}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={null}
      isInteractive={false}
      enableGridX={false}
      enableGridY={false}
   />
);

export default RotesRechteck;
