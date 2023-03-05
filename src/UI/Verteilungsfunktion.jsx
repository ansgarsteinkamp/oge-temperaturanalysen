import { ResponsiveLine } from "@nivo/line";

const Verteilungsfunktion = ({ data, minY = -20, maxY = 35, smartphone = false, temperaturArt }) => (
   <ResponsiveLine
      data={data}
      theme={{
         textColor: "#57534e",
         fontSize: smartphone ? 10 : 14,
         axis: {
            legend: {
               text: { fontSize: smartphone ? 10 : 14, fontWeight: 600 }
            }
         }
      }}
      margin={{ top: 10, right: smartphone ? 20 : 50, bottom: smartphone ? 38 : 56, left: smartphone ? 50 : 90 }}
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
         legendOffset: smartphone ? 30 : 45,
         legendPosition: "middle"
      }}
      axisLeft={{
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10,
         format: value => `${value * 100}%`
      }}
      lineWidth={smartphone ? 1.5 : 2}
      pointSize={smartphone ? 3.5 : 7}
      colors={["#57534e"]}
      pointColor={{ from: "color", modifiers: [] }}
      useMesh={true}
      animate={true}
      enablePointLabel={false}
      pointLabelYOffset={0} // Nivo-Bug: Zwingend erforderlich, auch wenn enablePointLabel={false} ist.
      tooltip={x => (
         <div
            style={{
               color: "white",
               background: "#C47373",
               padding: "8px 16px",
               borderRadius: "3px",
               fontSize: "90%",
               transition: "opacity 10s ease-out"
            }}
         >
            {/* <strong>
               {node.id} ({node.serieId})
            </strong>
            <br /> */}
            {JSON.stringify(x.point.data.xFormatted)}
            {JSON.stringify(x.point.data.yFormatted)}
         </div>
      )}
   />
);

export default Verteilungsfunktion;
