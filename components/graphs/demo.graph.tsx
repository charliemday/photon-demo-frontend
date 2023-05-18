import { ResponsiveStream } from "@nivo/stream";
import { FC } from "react";

interface Props {}

const data = [
  {
    Raoul: 119,
    Josiane: 68,
    Marcel: 199,
    René: 93,
    Paul: 103,
    Jacques: 77,
  },
  {
    Raoul: 104,
    Josiane: 79,
    Marcel: 55,
    René: 164,
    Paul: 35,
    Jacques: 144,
  },
  {
    Raoul: 122,
    Josiane: 13,
    Marcel: 45,
    René: 179,
    Paul: 92,
    Jacques: 51,
  },
  {
    Raoul: 197,
    Josiane: 178,
    Marcel: 200,
    René: 101,
    Paul: 93,
    Jacques: 115,
  },
  {
    Raoul: 59,
    Josiane: 188,
    Marcel: 63,
    René: 84,
    Paul: 171,
    Jacques: 102,
  },
  {
    Raoul: 36,
    Josiane: 179,
    Marcel: 82,
    René: 142,
    Paul: 31,
    Jacques: 78,
  },
  {
    Raoul: 157,
    Josiane: 167,
    Marcel: 167,
    René: 43,
    Paul: 150,
    Jacques: 191,
  },
  {
    Raoul: 187,
    Josiane: 100,
    Marcel: 157,
    René: 130,
    Paul: 199,
    Jacques: 101,
  },
  {
    Raoul: 43,
    Josiane: 163,
    Marcel: 135,
    René: 73,
    Paul: 29,
    Jacques: 26,
  },
];

export const DemoGraph: FC<Props> = () => (
  <ResponsiveStream
    data={data}
    keys={["Raoul", "Josiane", "Marcel", "René", "Paul", "Jacques"]}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      // @ts-ignore
      orient: "bottom",
      tickSize: 0,
      tickPadding: 10,
      tickRotation: 0,
      legend: "",
      translateY: 50,
      legendOffset: 100,
    }}
    axisLeft={{
      // @ts-ignore
      orient: "left",
      tickSize: 0,
      tickPadding: 10,
      tickRotation: 0,
      legend: "",
      legendOffset: -100,
    }}
    enableGridX={false}
    enableGridY={false}
    offsetType="none"
    colors={{ scheme: "nivo" }}
    fillOpacity={1}
    curve="basis"
    background="white"
    defs={[
      {
        id: "fill",
        background: "custom",
        color: "#FFFFFF",
        size: 4,
        padding: 2,
        stagger: true,
      },
      {
        id: "fill",
        background: "inherit",
        color: "#e4c912",
        size: 6,
        padding: 2,
        stagger: true,
      },
    ]}
    fill={[
      {
        match: {
          id: "Paul",
        },
        id: "fill",
      },
      {
        match: {
          id: "Marcel",
        },
        id: "fill",
      },
    ]}
    dotSize={8}
    dotColor={{ from: "color" }}
    dotBorderWidth={2}
    dotBorderColor={{
      from: "color",
      modifiers: [["darker", 0.7]],
    }}
    legends={[
      {
        anchor: "bottom",
        direction: "row",
        translateX: 0,
        translateY: 50,
        itemWidth: 80,
        itemHeight: 20,
        itemTextColor: "#7D7D7D",
        symbolSize: 12,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#7D7D7D",
            },
          },
        ],
      },
    ]}
  />
);
