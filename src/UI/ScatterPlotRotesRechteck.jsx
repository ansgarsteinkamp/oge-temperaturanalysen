import { ResponsiveLine } from "@nivo/line";
import { addDays, isBefore, format } from "date-fns";

const ScatterPlotRotesRechteck = ({ startTag, startMonat, endeTag, endeMonat, minY = -20, maxY = 35, smartphone = false }) => {
   const start = new Date(2000, startMonat - 1, startTag);
   const ende = addDays(new Date(2000, endeMonat - 1, endeTag), 1);

   const startString = format(start, "MM-dd");
   const endeString = format(ende, "MM-dd");

   return (
      <ResponsiveLine
         data={[
            {
               id: "Rotes Rechteck",
               data: !isBefore(ende, start)
                  ? [
                       { x: startString, y: maxY },
                       { x: endeMonat === 12 && endeTag === 31 ? "13-01" : endeString, y: maxY }
                    ]
                  : [
                       { x: "01-01", y: maxY },
                       { x: endeString, y: maxY },
                       { x: endeString, y: minY },
                       { x: startString, y: minY },
                       { x: startString, y: maxY },
                       { x: "13-01", y: maxY }
                    ]
            }
         ]}
         colors={["#F0DCDC"]}
         margin={{ top: 10, right: smartphone ? 20 : 50, bottom: 40, left: smartphone ? 50 : 90 }}
         lineWidth={0}
         enablePoints={false}
         enableArea={true}
         areaBaselineValue={minY}
         areaOpacity={startTag === 1 && startMonat === 1 && endeTag === 31 && endeMonat === 12 ? 0 : 1}
         xScale={{
            type: "time",
            format: "%m-%d",
            precision: "day",
            min: "01-01",
            max: "13-01"
         }}
         yScale={{ type: "linear", min: minY, max: maxY }}
         axisTop={null}
         axisRight={null}
         axisBottom={null}
         axisLeft={null}
         isInteractive={false}
         enableGridX={false}
         enableGridY={false}
         enableCrosshair={false}
      />
   );
};

export default ScatterPlotRotesRechteck;
