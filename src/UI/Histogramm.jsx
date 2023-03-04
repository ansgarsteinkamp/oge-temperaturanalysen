import { ResponsiveBar } from "@nivo/bar";

const Histogramm = ({ data, minY = -20, maxY = 35, smartphone = false }) => (
   <ResponsiveBar
      data={data}
      keys={["anzahl"]}
      indexBy="temperatur"
      margin={{ top: 10, right: smartphone ? 20 : 50, bottom: 40, left: smartphone ? 50 : 90 }}
      padding={0}
      indexScale={{ type: "band", round: false }}
      colors={{ scheme: "nivo" }}
      axisTop={null}
      axisRight={null}
      axisLeft={null}
      axisBottom={{
         tickSize: 5,
         tickPadding: 5,
         tickRotation: 0,
         legend: "Temperatur",
         legendPosition: "middle",
         legendOffset: 32
      }}
      enableGridY={false}
      enableLabel={false}
   />
);

export default Histogramm;
