import { ResponsiveLine } from "@nivo/line";
import { FC } from "react";

interface Props {}

const data = [
  {
    id: "japan",
    color: "hsl(208, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 261,
      },
      {
        x: "helicopter",
        y: 75,
      },
      {
        x: "boat",
        y: 222,
      },
      {
        x: "train",
        y: 121,
      },
      {
        x: "subway",
        y: 86,
      },
      {
        x: "bus",
        y: 72,
      },
      {
        x: "car",
        y: 163,
      },
      {
        x: "moto",
        y: 258,
      },
      {
        x: "bicycle",
        y: 232,
      },
      {
        x: "horse",
        y: 296,
      },
      {
        x: "skateboard",
        y: 85,
      },
      {
        x: "others",
        y: 280,
      },
    ],
  },
  {
    id: "france",
    color: "hsl(129, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 268,
      },
      {
        x: "helicopter",
        y: 194,
      },
      {
        x: "boat",
        y: 111,
      },
      {
        x: "train",
        y: 298,
      },
      {
        x: "subway",
        y: 296,
      },
      {
        x: "bus",
        y: 159,
      },
      {
        x: "car",
        y: 239,
      },
      {
        x: "moto",
        y: 52,
      },
      {
        x: "bicycle",
        y: 208,
      },
      {
        x: "horse",
        y: 117,
      },
      {
        x: "skateboard",
        y: 51,
      },
      {
        x: "others",
        y: 10,
      },
    ],
  },
  {
    id: "us",
    color: "hsl(335, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 113,
      },
      {
        x: "helicopter",
        y: 226,
      },
      {
        x: "boat",
        y: 60,
      },
      {
        x: "train",
        y: 198,
      },
      {
        x: "subway",
        y: 167,
      },
      {
        x: "bus",
        y: 192,
      },
      {
        x: "car",
        y: 103,
      },
      {
        x: "moto",
        y: 177,
      },
      {
        x: "bicycle",
        y: 42,
      },
      {
        x: "horse",
        y: 51,
      },
      {
        x: "skateboard",
        y: 224,
      },
      {
        x: "others",
        y: 126,
      },
    ],
  },
  {
    id: "germany",
    color: "hsl(2, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 269,
      },
      {
        x: "helicopter",
        y: 10,
      },
      {
        x: "boat",
        y: 96,
      },
      {
        x: "train",
        y: 222,
      },
      {
        x: "subway",
        y: 227,
      },
      {
        x: "bus",
        y: 273,
      },
      {
        x: "car",
        y: 107,
      },
      {
        x: "moto",
        y: 230,
      },
      {
        x: "bicycle",
        y: 216,
      },
      {
        x: "horse",
        y: 6,
      },
      {
        x: "skateboard",
        y: 146,
      },
      {
        x: "others",
        y: 250,
      },
    ],
  },
  {
    id: "norway",
    color: "hsl(234, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 284,
      },
      {
        x: "helicopter",
        y: 194,
      },
      {
        x: "boat",
        y: 211,
      },
      {
        x: "train",
        y: 158,
      },
      {
        x: "subway",
        y: 86,
      },
      {
        x: "bus",
        y: 36,
      },
      {
        x: "car",
        y: 271,
      },
      {
        x: "moto",
        y: 23,
      },
      {
        x: "bicycle",
        y: 2,
      },
      {
        x: "horse",
        y: 82,
      },
      {
        x: "skateboard",
        y: 148,
      },
      {
        x: "others",
        y: 226,
      },
    ],
  },
];

export const DemoLineGraph: FC<Props> = () => (
  <ResponsiveLine
    data={data}
    curve="basis"
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: false,
      reverse: false,
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 0,
      tickPadding: 10,
      tickRotation: 0,
      legendOffset: 50,
      legendPosition: "middle",
    }}
    axisLeft={{
      tickSize: 0,
      tickPadding: 10,
      tickRotation: 0,
      legendOffset: -50,
      legendPosition: "middle",
    }}
    pointSize={0}
    pointColor={{ theme: "background" }}
    pointBorderWidth={0}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);
