import { ResponsiveScatterPlotCanvas } from "@nivo/scatterplot";

const ScatterPlot = ({ data, minY = -20, maxY = 35, smartphone = false }) => (
   <ResponsiveScatterPlotCanvas
      nodeSize={smartphone ? 3 : 6}
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
         format: value => `${value} °C`,
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10
      }}
      isInteractive={false} // Macht hier keinen Sinn, da useMesh={false} nicht unterstützt wird.
      // useMesh={false} // Wird bei Canvas nicht unterstützt.
      // animate={false} // Wird bei Canvas nicht unterstützt.
   />
);

export default ScatterPlot;
