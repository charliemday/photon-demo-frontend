import { Heading as ChakraHeading, TextProps } from "@chakra-ui/react";
import { Font } from "types/fonts";

interface Props {
  level?: "h1" | "h2" | "h3";
  fontFamily?: Font;
  fontWeight?: TextProps["fontWeight"];
  lineHeight?: TextProps["lineHeight"];
  children: TextProps["children"];
}

export const Heading = ({
  level = "h1",
  fontFamily = "ClashGrotesk",
  fontWeight = "medium",
  lineHeight = "1.125",
  children,
}: Props) => {
  let _fontSize = "";

  switch (level) {
    case "h1":
      _fontSize = "2xl";
      break;

    case "h2":
      _fontSize = "xl";
      break;

    case "h3":
      _fontSize = "";
      break;
  }

  return (
    <ChakraHeading
      as={level}
      fontFamily={fontFamily}
      fontSize={_fontSize}
      fontWeight={fontWeight}
      lineHeight={lineHeight}
      my="-1"
    >
      {children}
    </ChakraHeading>
  );
};
