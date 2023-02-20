import { ResponsiveScatterPlotCanvas } from "@nivo/scatterplot";

// const myData = [
//    {
//       id: "2019",
//       data: [
//          { x: "01-01", y: 7 },
//          { x: "01-02", y: 5 },
//          { x: "01-03", y: 11 },
//          { x: "01-04", y: 9 },
//          { x: "01-05", y: 12 },
//          { x: "01-06", y: 16 },
//          { x: "01-07", y: 13 },
//          { x: "01-08", y: 13 }
//       ]
//    },
//    {
//       id: "2020",
//       data: [
//          { x: "01-04", y: 14 },
//          { x: "01-05", y: 14 },
//          { x: "01-06", y: 15 },
//          { x: "01-07", y: 11 },
//          { x: "01-08", y: 10 },
//          { x: "01-09", y: 12 },
//          { x: "01-10", y: 9 },
//          { x: "01-11", y: 7 }
//       ]
//    }
// ];

const MyScatterPlot = ({ data }) => (
   <ResponsiveScatterPlotCanvas
      theme={{
         fontSize: 14,
         axis: {
            legend: {
               text: { fontSize: 12, fontWeight: "bold" }
            }
         }
      }}
      // width={1500}
      // height={900}
      margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
      data={data}
      colors={["#57534e"]}
      xScale={{
         type: "time",
         format: "%m-%d",
         precision: "day"
      }}
      xFormat="time:%d. %B"
      yScale={{ type: "linear", min: "auto", max: "auto" }}
      axisBottom={{
         format: "%b",
         tickValues: "every 1 months"
      }}
      useMesh={false}
      // animate={false}
      // isInteractive={false}
   />
);

export default MyScatterPlot;
