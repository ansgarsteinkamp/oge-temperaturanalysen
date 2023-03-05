import { ResponsiveLine } from "@nivo/line";

const Temperaturintervall = ({ data, minY = -20, maxY = 35, smartphone = false, durchsichtig }) => (
   <ResponsiveLine
      data={data}
      colors={["#F0DCDC"]}
      margin={{ top: 10, right: smartphone ? 20 : 50, bottom: smartphone ? 38 : 56, left: smartphone ? 50 : 90 }}
      lineWidth={0}
      enablePoints={false}
      enableArea={true}
      areaBaselineValue={0}
      areaOpacity={durchsichtig ? 0 : 1}
      curve="monotoneX"
      xScale={{
         type: "linear",
         min: minY,
         max: maxY
      }}
      yScale={{ type: "linear", min: 0, max: 1 }}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={null}
      enableGridX={false}
      enableGridY={false}
      enableCrosshair={false}
   />
);

export default Temperaturintervall;
