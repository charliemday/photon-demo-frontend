import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";

interface Props {}

const data = [
  {
    id: "japan",
    color: "#7F5BD5",
    data: [
      {
        x: "plane",
        y: 158,
      },
      {
        x: "helicopter",
        y: 160,
      },
      {
        x: "boat",
        y: 298,
      },
      {
        x: "train",
        y: 210,
      },
      {
        x: "subway",
        y: 86,
      },
      {
        x: "bus",
        y: 214,
      },
      {
        x: "car",
        y: 174,
      },
      {
        x: "moto",
        y: 110,
      },
      {
        x: "bicycle",
        y: 146,
      },
      {
        x: "horse",
        y: 190,
      },
      {
        x: "skateboard",
        y: 266,
      },
      {
        x: "others",
        y: 289,
      },
    ],
  }
];

export const LineChart: React.FC<Props> = () => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    curve="natural"
    enablePoints={false}
    enableGridX={false}
    enableGridY={false}
    enableCrosshair={false}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    useMesh={true}
    colors={() => '#7F5BD5'}
    enableArea={true}
    defs={[
      linearGradientDef("gradientA", [
        { offset: 0, color: "purple" },
        { offset: 100, color: "blue", opacity: 0 },
      ]),
    ]}
    fill={[
      { match: { id: 'japan' }, id: 'gradientA' },
    ]}
  />
);
