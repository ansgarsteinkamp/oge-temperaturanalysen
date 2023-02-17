import { ResponsiveScatterPlot } from "@nivo/scatterplot";

const myData = [
   {
      id: "group A",
      data: [
         {
            x: 12,
            y: 60
         },
         {
            x: 74,
            y: 61
         },
         {
            x: 82,
            y: 95
         },
         {
            x: 21,
            y: 111
         },
         {
            x: 64,
            y: 84
         },
         {
            x: 46,
            y: 9
         },
         {
            x: 70,
            y: 88
         },
         {
            x: 43,
            y: 11
         },
         {
            x: 5,
            y: 58
         },
         {
            x: 59,
            y: 50
         },
         {
            x: 84,
            y: 86
         },
         {
            x: 37,
            y: 33
         },
         {
            x: 10,
            y: 21
         },
         {
            x: 73,
            y: 102
         },
         {
            x: 99,
            y: 76
         },
         {
            x: 72,
            y: 43
         },
         {
            x: 4,
            y: 116
         },
         {
            x: 49,
            y: 13
         },
         {
            x: 80,
            y: 16
         },
         {
            x: 43,
            y: 5
         },
         {
            x: 69,
            y: 50
         },
         {
            x: 11,
            y: 85
         },
         {
            x: 69,
            y: 11
         },
         {
            x: 21,
            y: 12
         },
         {
            x: 50,
            y: 48
         },
         {
            x: 20,
            y: 83
         },
         {
            x: 55,
            y: 70
         },
         {
            x: 93,
            y: 99
         },
         {
            x: 92,
            y: 88
         },
         {
            x: 64,
            y: 75
         },
         {
            x: 56,
            y: 20
         },
         {
            x: 75,
            y: 59
         },
         {
            x: 48,
            y: 23
         },
         {
            x: 21,
            y: 102
         },
         {
            x: 84,
            y: 49
         },
         {
            x: 65,
            y: 102
         },
         {
            x: 26,
            y: 78
         },
         {
            x: 2,
            y: 110
         },
         {
            x: 95,
            y: 65
         },
         {
            x: 21,
            y: 56
         },
         {
            x: 23,
            y: 58
         },
         {
            x: 2,
            y: 50
         },
         {
            x: 99,
            y: 110
         },
         {
            x: 27,
            y: 24
         },
         {
            x: 90,
            y: 35
         },
         {
            x: 30,
            y: 56
         },
         {
            x: 38,
            y: 87
         },
         {
            x: 73,
            y: 50
         },
         {
            x: 0,
            y: 40
         },
         {
            x: 73,
            y: 116
         }
      ]
   },
   {
      id: "group B",
      data: [
         {
            x: 89,
            y: 69
         },
         {
            x: 63,
            y: 98
         },
         {
            x: 2,
            y: 43
         },
         {
            x: 99,
            y: 104
         },
         {
            x: 57,
            y: 87
         },
         {
            x: 60,
            y: 85
         },
         {
            x: 52,
            y: 67
         },
         {
            x: 10,
            y: 30
         },
         {
            x: 42,
            y: 25
         },
         {
            x: 17,
            y: 41
         },
         {
            x: 89,
            y: 0
         },
         {
            x: 42,
            y: 19
         },
         {
            x: 76,
            y: 98
         },
         {
            x: 32,
            y: 56
         },
         {
            x: 20,
            y: 35
         },
         {
            x: 63,
            y: 50
         },
         {
            x: 28,
            y: 89
         },
         {
            x: 53,
            y: 108
         },
         {
            x: 3,
            y: 10
         },
         {
            x: 92,
            y: 19
         },
         {
            x: 75,
            y: 49
         },
         {
            x: 37,
            y: 62
         },
         {
            x: 19,
            y: 19
         },
         {
            x: 43,
            y: 65
         },
         {
            x: 72,
            y: 14
         },
         {
            x: 72,
            y: 4
         },
         {
            x: 4,
            y: 107
         },
         {
            x: 2,
            y: 92
         },
         {
            x: 4,
            y: 67
         },
         {
            x: 68,
            y: 10
         },
         {
            x: 88,
            y: 91
         },
         {
            x: 52,
            y: 71
         },
         {
            x: 19,
            y: 106
         },
         {
            x: 49,
            y: 108
         },
         {
            x: 74,
            y: 10
         },
         {
            x: 48,
            y: 111
         },
         {
            x: 90,
            y: 7
         },
         {
            x: 43,
            y: 104
         },
         {
            x: 63,
            y: 10
         },
         {
            x: 63,
            y: 59
         },
         {
            x: 82,
            y: 68
         },
         {
            x: 20,
            y: 100
         },
         {
            x: 37,
            y: 72
         },
         {
            x: 12,
            y: 109
         },
         {
            x: 75,
            y: 6
         },
         {
            x: 42,
            y: 12
         },
         {
            x: 97,
            y: 64
         },
         {
            x: 72,
            y: 96
         },
         {
            x: 5,
            y: 68
         },
         {
            x: 7,
            y: 104
         }
      ]
   },
   {
      id: "group C",
      data: [
         {
            x: 32,
            y: 47
         },
         {
            x: 19,
            y: 20
         },
         {
            x: 79,
            y: 71
         },
         {
            x: 6,
            y: 90
         },
         {
            x: 75,
            y: 35
         },
         {
            x: 53,
            y: 86
         },
         {
            x: 85,
            y: 27
         },
         {
            x: 5,
            y: 54
         },
         {
            x: 13,
            y: 90
         },
         {
            x: 62,
            y: 80
         },
         {
            x: 26,
            y: 108
         },
         {
            x: 7,
            y: 77
         },
         {
            x: 76,
            y: 60
         },
         {
            x: 75,
            y: 119
         },
         {
            x: 42,
            y: 42
         },
         {
            x: 22,
            y: 1
         },
         {
            x: 52,
            y: 56
         },
         {
            x: 87,
            y: 92
         },
         {
            x: 71,
            y: 118
         },
         {
            x: 22,
            y: 63
         },
         {
            x: 90,
            y: 22
         },
         {
            x: 0,
            y: 98
         },
         {
            x: 35,
            y: 4
         },
         {
            x: 14,
            y: 109
         },
         {
            x: 36,
            y: 109
         },
         {
            x: 96,
            y: 91
         },
         {
            x: 38,
            y: 62
         },
         {
            x: 70,
            y: 58
         },
         {
            x: 20,
            y: 75
         },
         {
            x: 63,
            y: 103
         },
         {
            x: 26,
            y: 40
         },
         {
            x: 43,
            y: 28
         },
         {
            x: 57,
            y: 74
         },
         {
            x: 17,
            y: 62
         },
         {
            x: 63,
            y: 113
         },
         {
            x: 66,
            y: 87
         },
         {
            x: 74,
            y: 25
         },
         {
            x: 57,
            y: 27
         },
         {
            x: 51,
            y: 50
         },
         {
            x: 9,
            y: 103
         },
         {
            x: 27,
            y: 3
         },
         {
            x: 33,
            y: 2
         },
         {
            x: 29,
            y: 5
         },
         {
            x: 6,
            y: 34
         },
         {
            x: 74,
            y: 61
         },
         {
            x: 11,
            y: 54
         },
         {
            x: 81,
            y: 5
         },
         {
            x: 4,
            y: 78
         },
         {
            x: 91,
            y: 1
         },
         {
            x: 82,
            y: 25
         }
      ]
   },
   {
      id: "group D",
      data: [
         {
            x: 96,
            y: 74
         },
         {
            x: 49,
            y: 111
         },
         {
            x: 13,
            y: 76
         },
         {
            x: 6,
            y: 30
         },
         {
            x: 38,
            y: 109
         },
         {
            x: 31,
            y: 58
         },
         {
            x: 90,
            y: 86
         },
         {
            x: 61,
            y: 52
         },
         {
            x: 37,
            y: 20
         },
         {
            x: 24,
            y: 39
         },
         {
            x: 81,
            y: 83
         },
         {
            x: 79,
            y: 115
         },
         {
            x: 72,
            y: 8
         },
         {
            x: 26,
            y: 29
         },
         {
            x: 97,
            y: 113
         },
         {
            x: 87,
            y: 5
         },
         {
            x: 15,
            y: 47
         },
         {
            x: 26,
            y: 112
         },
         {
            x: 100,
            y: 99
         },
         {
            x: 84,
            y: 0
         },
         {
            x: 62,
            y: 30
         },
         {
            x: 26,
            y: 26
         },
         {
            x: 44,
            y: 85
         },
         {
            x: 13,
            y: 22
         },
         {
            x: 36,
            y: 120
         },
         {
            x: 88,
            y: 44
         },
         {
            x: 61,
            y: 17
         },
         {
            x: 63,
            y: 33
         },
         {
            x: 37,
            y: 38
         },
         {
            x: 93,
            y: 96
         },
         {
            x: 46,
            y: 114
         },
         {
            x: 51,
            y: 105
         },
         {
            x: 32,
            y: 69
         },
         {
            x: 70,
            y: 102
         },
         {
            x: 3,
            y: 106
         },
         {
            x: 21,
            y: 115
         },
         {
            x: 81,
            y: 6
         },
         {
            x: 92,
            y: 80
         },
         {
            x: 52,
            y: 38
         },
         {
            x: 93,
            y: 94
         },
         {
            x: 29,
            y: 96
         },
         {
            x: 53,
            y: 76
         },
         {
            x: 59,
            y: 16
         },
         {
            x: 37,
            y: 46
         },
         {
            x: 27,
            y: 56
         },
         {
            x: 49,
            y: 99
         },
         {
            x: 7,
            y: 73
         },
         {
            x: 4,
            y: 39
         },
         {
            x: 58,
            y: 120
         },
         {
            x: 42,
            y: 108
         }
      ]
   },
   {
      id: "group E",
      data: [
         {
            x: 33,
            y: 11
         },
         {
            x: 44,
            y: 23
         },
         {
            x: 88,
            y: 72
         },
         {
            x: 72,
            y: 0
         },
         {
            x: 92,
            y: 93
         },
         {
            x: 95,
            y: 76
         },
         {
            x: 95,
            y: 57
         },
         {
            x: 77,
            y: 116
         },
         {
            x: 84,
            y: 45
         },
         {
            x: 55,
            y: 73
         },
         {
            x: 80,
            y: 89
         },
         {
            x: 61,
            y: 22
         },
         {
            x: 0,
            y: 52
         },
         {
            x: 35,
            y: 8
         },
         {
            x: 50,
            y: 42
         },
         {
            x: 18,
            y: 112
         },
         {
            x: 6,
            y: 11
         },
         {
            x: 65,
            y: 74
         },
         {
            x: 8,
            y: 102
         },
         {
            x: 91,
            y: 78
         },
         {
            x: 45,
            y: 80
         },
         {
            x: 36,
            y: 110
         },
         {
            x: 90,
            y: 1
         },
         {
            x: 94,
            y: 100
         },
         {
            x: 62,
            y: 32
         },
         {
            x: 97,
            y: 80
         },
         {
            x: 14,
            y: 49
         },
         {
            x: 31,
            y: 120
         },
         {
            x: 26,
            y: 15
         },
         {
            x: 66,
            y: 11
         },
         {
            x: 81,
            y: 88
         },
         {
            x: 54,
            y: 96
         },
         {
            x: 48,
            y: 115
         },
         {
            x: 43,
            y: 51
         },
         {
            x: 27,
            y: 50
         },
         {
            x: 2,
            y: 10
         },
         {
            x: 16,
            y: 54
         },
         {
            x: 84,
            y: 15
         },
         {
            x: 82,
            y: 77
         },
         {
            x: 61,
            y: 98
         },
         {
            x: 15,
            y: 2
         },
         {
            x: 88,
            y: 64
         },
         {
            x: 84,
            y: 37
         },
         {
            x: 84,
            y: 112
         },
         {
            x: 48,
            y: 41
         },
         {
            x: 65,
            y: 26
         },
         {
            x: 100,
            y: 72
         },
         {
            x: 13,
            y: 10
         },
         {
            x: 1,
            y: 110
         },
         {
            x: 85,
            y: 119
         }
      ]
   }
];

const ScatterPlot = ({ data = myData }) => (
   <ResponsiveScatterPlot
      data={data}
      margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
      xScale={{ type: "linear", min: 0, max: "auto" }}
      xFormat=">-.2f"
      yScale={{ type: "linear", min: 0, max: "auto" }}
      yFormat=">-.2f"
      blendMode="multiply"
      axisTop={null}
      axisRight={null}
      axisBottom={{
         orient: "bottom",
         tickSize: 5,
         tickPadding: 5,
         tickRotation: 0,
         legend: "weight",
         legendPosition: "middle",
         legendOffset: 46
      }}
      axisLeft={{
         orient: "left",
         tickSize: 5,
         tickPadding: 5,
         tickRotation: 0,
         legend: "size",
         legendPosition: "middle",
         legendOffset: -60
      }}
      legends={[
         {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 130,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 12,
            itemsSpacing: 5,
            itemDirection: "left-to-right",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
               {
                  on: "hover",
                  style: {
                     itemOpacity: 1
                  }
               }
            ]
         }
      ]}
   />
);

export default ScatterPlot;
