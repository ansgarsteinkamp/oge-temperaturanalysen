import { ResponsiveScatterPlotCanvas } from "@nivo/scatterplot";

const VergleichScatterPlot = ({ data, minY = -20, maxY = 35, smartphone = false, nameX, nameY }) => (
   <ResponsiveScatterPlotCanvas
      nodeSize={smartphone ? 3 : 6}
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
         legend: nameX,
         legendOffset: smartphone ? 30 : 45,
         legendPosition: "middle"
      }}
      axisLeft={{
         orient: "left",
         format: value => `${value}°C`,
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10,
         legend: nameY,
         legendOffset: smartphone ? -40 : -63,
         legendPosition: "middle"
      }}
      isInteractive={false} // Macht hier keinen Sinn, da useMesh={false} nicht unterstützt wird.
      // useMesh={false} // Wird bei Canvas nicht unterstützt.
      // animate={false} // Wird bei Canvas nicht unterstützt.
   />
);

export default VergleichScatterPlot;
