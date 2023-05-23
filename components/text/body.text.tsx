import { Text, TextProps } from "@chakra-ui/react";
import { Font } from "types/fonts";

interface Props {
  fontFamily?: Font;
  fontWeight?: TextProps["fontWeight"];
  lineHeight?: TextProps["lineHeight"];
  children: TextProps["children"];
}

export const Body = ({
  fontFamily = "Inter",
  fontWeight = "medium",
  lineHeight = "1.25",
  children,
}: Props) => (
  <Text
    fontFamily={fontFamily}
    fontSize="xs"
    fontWeight={fontWeight}
    lineHeight={lineHeight}
    my="-1"
  >
    {children}
  </Text>
);
