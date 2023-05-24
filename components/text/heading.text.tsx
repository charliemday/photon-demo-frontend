import { Heading as ChakraHeading, TextProps } from "@chakra-ui/react";
import { Font } from "types/fonts";

interface Props extends Omit<TextProps, "fontSize"> {
  level?: "h1" | "h2" | "h3";
  fontFamily?: Font;
  fontWeight?: "regular" | "medium";
}

export const Heading = ({
  level = "h1",
  fontFamily = "ClashGrotesk",
  fontWeight = "medium",
  lineHeight = "1.125",
  children,
  ...rest
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
      {...rest}
    >
      {children}
    </ChakraHeading>
  );
};
