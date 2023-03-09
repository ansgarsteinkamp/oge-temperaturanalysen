import { ResponsiveScatterPlotCanvas } from "@nivo/scatterplot";

import { parseJSON, intlFormat } from "date-fns";

const ScatterPlot = ({ data, minY = -20, maxY = 35, temperaturArt, smartphone = false }) => (
   <ResponsiveScatterPlotCanvas
      nodeSize={smartphone ? 2.5 : 4.5}
      theme={{
         textColor: "#57534e",
         fontSize: smartphone ? 10 : 14,
         axis: {
            legend: {
               text: { fontSize: smartphone ? 10 : 14 }
            }
         }
      }}
      // width={1500}
      // height={900}
      margin={{ top: 10, right: smartphone ? 20 : 50, bottom: 40, left: smartphone ? 50 : 90 }}
      data={data}
      colors={["#57534e"]}
      xScale={{
         type: "time",
         format: "%m-%d",
         precision: "day",
         max: "13-01"
      }}
      yScale={{ type: "linear", min: minY, max: maxY }}
      axisBottom={{
         format: "%b",
         tickValues: "every 1 months",
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10
      }}
      axisLeft={{
         orient: "left",
         format: value => `${value}°C`,
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10
      }}
      isInteractive={true}
      yFormat=" >-.2~f"
      tooltip={el => (
         <div
            className="text-white bg-DANGER-800 py-2 px-4 rounded"
            style={{
               fontSize: "90%"
            }}
         >
            <p>
               {intlFormat(parseJSON(el.node.xValue), { month: "long", day: "2-digit" }, { locale: "de-DE" })} {el.node.serieId}
            </p>
            <p>
               {temperaturArt}: {el.node.formattedY.replace(".", ",")} °C
            </p>
         </div>
      )}
      // useMesh={false} // Wird bei Canvas nicht unterstützt.
      // animate={false} // Wird bei Canvas nicht unterstützt.
   />
);

export default ScatterPlot;
