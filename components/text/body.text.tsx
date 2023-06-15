import { Text, TextProps } from "@chakra-ui/react";
import { Font } from "types/fonts";

interface Props extends TextProps {
  fontFamily?: Font;
  fontWeight?: "medium" | "semibold" | "bold";
}

export const Body = ({
  fontFamily = "Inter",
  fontWeight = "medium",
  lineHeight = "1.25",
  fontSize = "xs",
  children,
  ...rest
}: Props) => (
  <Text
    fontFamily={fontFamily}
    fontSize={fontSize}
    fontWeight={fontWeight}
    lineHeight={lineHeight}
    my="-1"
    {...rest}
  >
    {children}
  </Text>
);
