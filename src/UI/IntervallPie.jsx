import clsx from "clsx";

import { ResponsivePie } from "@nivo/pie";

const IntervallPie = ({ data, smartphone = false }) => (
   <ResponsivePie
      margin={{ top: 50, right: 100, bottom: 50, left: 100 }}
      data={data}
      padAngle={0.4}
      cornerRadius={5}
      colors={["#78716c", "#D39696"]}
      innerRadius={0.6}
      arcLinkLabel={d =>
         `${(Number(d.value) * 100).toLocaleString("de-DE", {
            maximumSignificantDigits: Number(d.value) * 100 < 99 ? 3 : Number(d.value) * 100 < 99.9 ? 4 : 5
         })} %`
      }
      enableArcLabels={false}
      arcLinkLabelsThickness={2}
      arcLinkLabelsTextColor={{ from: "color", modifiers: [] }}
      arcLinkLabelsColor={{ from: "color", modifiers: [] }}
      activeOuterRadiusOffset={4}
      tooltip={el => (
         <div
            className={clsx("text-white py-2 px-4 rounded", el.datum.data.id === "außerhalb" ? "bg-stone-600" : "bg-DANGER-800")}
            style={{
               fontSize: "90%"
            }}
         >
            <p>
               {(Number(el.datum.data.value) * 100).toLocaleString("de-DE", {
                  maximumSignificantDigits: Number(el.datum.data.value) * 100 < 99 ? 3 : Number(el.datum.data.value) * 100 < 99.9 ? 4 : 5
               })}{" "}
               % der Temperaturen liegen {el.datum.data.id === "außerhalb" ? "außerhalb des Temperaturintervalls" : "im Temperaturintervall"}.
            </p>
         </div>
      )}
   />
);

export default IntervallPie;
