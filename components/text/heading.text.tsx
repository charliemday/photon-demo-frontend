import { Heading as ChakraHeading, TextProps } from "@chakra-ui/react";
import { Font } from "types/fonts";

interface Props extends Omit<TextProps, "size"> {
  level?: "h1" | "h2" | "h3";
  fontFamily?: Font;
  fontWeight?: "regular" | "medium";
}

export const Heading = ({
  level = "h2",
  fontFamily = "ClashGrotesk",
  fontSize = "xl",
  fontWeight = "medium",
  lineHeight = "1.125",
  children,
  ...rest
}: Props) => (
  <ChakraHeading
    as={level}
    fontFamily={fontFamily}
    fontSize={fontSize}
    fontWeight={fontWeight}
    lineHeight={lineHeight}
    my="-1"
    {...rest}
  >
    {children}
  </ChakraHeading>
);
