import clsx from "clsx";

import { ResponsivePie } from "@nivo/pie";

const MyPie = ({ data, smartphone = false }) => (
   <ResponsivePie
      theme={{
         textColor: "#57534e",
         fontSize: smartphone ? 10 : 14
      }}
      margin={{ top: smartphone ? 26 : 36, right: 100, bottom: smartphone ? 26 : 36, left: 100 }}
      data={data}
      padAngle={0.4}
      cornerRadius={smartphone ? 3 : 5}
      colors={["#78716c", "#D39696"]}
      innerRadius={0.6}
      arcLinkLabel={d =>
         `${(Number(d.value) * 100).toLocaleString("de-DE", {
            maximumSignificantDigits: Number(d.value) * 100 < 99 ? 3 : Number(d.value) * 100 < 99.9 ? 4 : 5
         })} %`
      }
      enableArcLabels={false}
      arcLinkLabelsThickness={smartphone ? 1.5 : 2}
      arcLinkLabelsTextColor={{ from: "color", modifiers: [] }}
      arcLinkLabelsColor={{ from: "color", modifiers: [] }}
      activeOuterRadiusOffset={smartphone ? 3 : 6}
      arcLinkLabelsDiagonalLength={smartphone ? 16 : 24}
      arcLinkLabelsStraightLength={smartphone ? 12 : 20}
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
               % der Temperaturen liegen{" "}
               {el.datum.data.id === "außerhalb"
                  ? "außerhalb des Intervalls."
                  : el.datum.data.id === "innerhalb"
                  ? "im Intervall."
                  : el.datum.data.id === "außerhalb Schnittmenge"
                  ? "nicht in beiden Intervallen."
                  : el.datum.data.id === "innerhalb Schnittmenge"
                  ? "in beiden Intervallen."
                  : el.datum.data.id === "außerhalb bedingt"
                  ? "dann außerhalb des Intervalls."
                  : el.datum.data.id === "innerhalb bedingt"
                  ? "dann im Intervall."
                  : ""}
            </p>
         </div>
      )}
   />
);

export default MyPie;
