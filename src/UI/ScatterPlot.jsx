import { ResponsiveScatterPlotCanvas } from "@nivo/scatterplot";

const MyScatterPlot = ({ data, minY = "auto", maxY = "auto", smartphone = false }) => (
   <ResponsiveScatterPlotCanvas
      nodeSize={smartphone ? 3 : 6}
      theme={{
         textColor: "#57534e",
         fontSize: smartphone ? 9 : 16,
         axis: {
            legend: {
               text: { fontSize: smartphone ? 9 : 16 }
            }
         }
      }}
      // width={1500}
      // height={900}
      margin={{ top: 10, right: smartphone ? 20 : 40, bottom: 40, left: smartphone ? 60 : 120 }}
      data={data}
      colors={["#57534e"]}
      xScale={{
         type: "time",
         format: "%m-%d",
         precision: "day",
         max: "13-02"
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
         legend: "Tagesmitteltemperatur",
         legendPosition: "middle",
         legendOffset: smartphone ? -42 : -70,
         format: value => `${value} °C`,
         tickSize: 0,
         tickPadding: smartphone ? 7 : 10
      }}
      isInteractive={false} // Macht hier keinen Sinn, da useMesh={false} nicht unterstützt wird.
      // useMesh={false} // Wird bei Canvas nicht unterstützt.
      // animate={false} // Wird bei Canvas nicht unterstützt.
   />
);

export default MyScatterPlot;
