import { Text, TextProps } from "@chakra-ui/react";
import { Font } from "types/fonts";

interface Props extends Omit<TextProps, "fontSize"> {
  fontFamily?: Font;
  fontWeight?: "medium" | "semibold";
}

export const Body = ({
  fontFamily = "Inter",
  fontWeight = "medium",
  lineHeight = "1.25",
  children,
  ...rest
}: Props) => (
  <Text
    fontFamily={fontFamily}
    fontSize="xs"
    fontWeight={fontWeight}
    lineHeight={lineHeight}
    my="-1"
    {...rest}
  >
    {children}
  </Text>
);
