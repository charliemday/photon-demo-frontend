import { Text, TextProps } from "@chakra-ui/react";
import { Font } from "types/fonts";

interface Props {
  fontFamily?: Font;
  fontWeight?: TextProps["fontWeight"];
  lineHeight?: TextProps["lineHeight"];
  children: TextProps["children"];
}

export const Label = ({
  fontFamily = "Inter",
  fontWeight = "medium",
  lineHeight = "1.5",
  children,
}: Props) => (
  <Text
    fontFamily={fontFamily}
    fontSize="sm"
    fontWeight={fontWeight}
    lineHeight={lineHeight}
    my="-1"
  >
    {children}
  </Text>
);
