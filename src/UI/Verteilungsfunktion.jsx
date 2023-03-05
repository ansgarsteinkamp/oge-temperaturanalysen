import { ResponsiveLine } from "@nivo/line";

const Verteilungsfunktion = ({ data, minY = -20, maxY = 35, smartphone = false, temperaturArt }) => (
   <ResponsiveLine
      data={data}
      theme={{
         textColor: "#57534e",
         fontSize: smartphone ? 9 : 16,
         axis: {
            legend: {
               text: { fontSize: smartphone ? 9 : 16 }
            }
         }
      }}
      margin={{ top: 10, right: smartphone ? 20 : 50, bottom: smartphone ? 40 : 62, left: smartphone ? 50 : 90 }}
      curve="monotoneX"
      xScale={{
         type: "linear",
         min: minY,
         max: maxY
      }}
      yScale={{ type: "linear", min: 0, max: 1 }}
      axisBottom={{
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10,
         format: value => `${value} °C`,
         legend: temperaturArt,
         legendOffset: smartphone ? 32 : 50,
         legendPosition: "middle"
      }}
      axisLeft={{
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10,
         format: value => `${value * 100}%`
      }}
      lineWidth={smartphone ? 2 : 3}
      pointSize={smartphone ? 4 : 8}
      colors={["#D39696"]}
      pointColor={{ from: "color", modifiers: [] }}
      useMesh={true}
      animate={true}
      enablePointLabel={false}
      pointLabelYOffset={0} // Nivo-Bug: Zwingend erforderlich, auch wenn enablePointLabel={false} ist.
   />
);

export default Verteilungsfunktion;
