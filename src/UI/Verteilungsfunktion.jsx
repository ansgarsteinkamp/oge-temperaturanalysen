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
      yFormat={value =>
         `${Number(value * 100).toLocaleString("de-DE", {
            maximumSignificantDigits: 3
         })} %`
      }
      tooltip={x => (
         <div
            className="text-white bg-DANGER-800 py-2 px-4 rounded"
            style={{
               fontSize: "90%"
            }}
         >
            <p>Temperaturen unter {x.point.data.xFormatted} °C treten mit einer</p>
            <p>Wahrscheinlichkeit von &#8776; {x.point.data.yFormatted} auf.</p>
         </div>
      )}
   />
);

export default Verteilungsfunktion;
