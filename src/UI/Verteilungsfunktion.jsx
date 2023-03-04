import { ResponsiveLine } from "@nivo/line";

const Verteilungsfunktion = ({ data, minY = -20, maxY = 35, smartphone = false }) => (
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
      colors={["#C47373"]}
      margin={{ top: 10, right: smartphone ? 20 : 50, bottom: 40, left: smartphone ? 50 : 90 }}
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
         format: value => `${value} °C`
      }}
      axisLeft={{
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10,
         format: value => `${value * 100}%`
      }}
      lineWidth={2}
      pointSize={6}
      pointBorderWidth={1}
      pointBorderColor={{
         from: "color",
         modifiers: [["darker", 0.3]]
      }}
      useMesh={true}
      animate={true}
      enablePointLabel={false}
      pointLabelYOffset={0} // Nivo-Bug: Zwingend erforderlich, auch wenn enablePointLabel={false} ist.
   />
);

export default Verteilungsfunktion;
