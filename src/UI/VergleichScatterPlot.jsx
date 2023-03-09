import { ResponsiveScatterPlotCanvas } from "@nivo/scatterplot";

import { parse, intlFormat } from "date-fns";

const VergleichScatterPlot = ({ data, minY = -20, maxY = 35, smartphone = false, temperaturArt, nameX, nameY }) => (
   <ResponsiveScatterPlotCanvas
      nodeSize={smartphone ? 2.5 : 4.5}
      theme={{
         textColor: "#57534e",
         fontSize: smartphone ? 10 : 14,
         axis: {
            legend: {
               text: { fontSize: smartphone ? 10 : 14, fontWeight: 600 }
            }
         }
      }}
      margin={{ top: 10, right: smartphone ? 20 : 50, bottom: smartphone ? 38 : 56, left: smartphone ? 52 : 90 }}
      data={data}
      colors={["#57534e"]}
      xScale={{ type: "linear", min: minY, max: maxY }}
      yScale={{ type: "linear", min: minY, max: maxY }}
      axisBottom={{
         format: value => `${value}°C`,
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10,
         legend: temperaturArt + " " + nameX,
         legendOffset: smartphone ? 30 : 45,
         legendPosition: "middle"
      }}
      axisLeft={{
         orient: "left",
         format: value => `${value}°C`,
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10,
         legend: temperaturArt + " " + nameY,
         legendOffset: smartphone ? -40 : -63,
         legendPosition: "middle"
      }}
      isInteractive={true}
      xFormat=" >-.2~f"
      yFormat=" >-.2~f"
      tooltip={el => (
         <div
            className="text-white bg-DANGER-800 py-2 px-4 rounded"
            style={{
               fontSize: "90%"
            }}
         >
            <p>
               {intlFormat(parse(el.node.serieId, "yyyy-MM-dd", new Date()), { year: "numeric", month: "long", day: "2-digit" }, { locale: "de-DE" })} {}
            </p>
            <p>
               {nameX}: {el.node.formattedX.replace(".", ",")} °C
            </p>
            <p>
               {nameY}: {el.node.formattedY.replace(".", ",")} °C
            </p>
         </div>
      )}
      // useMesh={false} // Wird bei Canvas nicht unterstützt.
      // animate={false} // Wird bei Canvas nicht unterstützt.
   />
);

export default VergleichScatterPlot;
