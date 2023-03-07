import { ResponsiveLine } from "@nivo/line";

const VergleichScatterPlotRotesRechteck_Y = ({ untereGrenze, obereGrenze, minY = -20, maxY = 35, smartphone = false, durchsichtig }) => (
   <ResponsiveLine
      data={[
         {
            id: "Rotes Rechteck",
            data: [
               { x: minY, y: Math.min(obereGrenze, maxY) },
               { x: maxY, y: Math.min(obereGrenze, maxY) }
            ]
         }
      ]}
      colors={["#C47373"]}
      margin={{ top: 10, right: smartphone ? 20 : 50, bottom: smartphone ? 38 : 56, left: smartphone ? 52 : 90 }}
      lineWidth={0}
      enablePoints={false}
      enableArea={true}
      areaBaselineValue={Math.max(untereGrenze, minY)}
      areaOpacity={durchsichtig ? 0 : 0.2}
      curve="monotoneX"
      xScale={{ type: "linear", min: minY, max: maxY }}
      yScale={{ type: "linear", min: minY, max: maxY }}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={null}
      enableGridX={false}
      enableGridY={false}
      enableCrosshair={false}
   />
);

export default VergleichScatterPlotRotesRechteck_Y;
