import { Text, TextProps } from "@chakra-ui/react";
import { Font } from "types/fonts";

interface Props extends Omit<TextProps, "fontSize"> {
  fontFamily?: Font;
  fontWeight?: "medium" | "semibold";
}

export const Label = ({
  fontFamily = "Inter",
  fontWeight = "semibold",
  lineHeight = "1.5",
  children,
  ...rest
}: Props) => (
  <Text
    fontFamily={fontFamily}
    fontSize="sm"
    fontWeight={fontWeight}
    lineHeight={lineHeight}
    my="-1"
    {...rest}
  >
    {children}
  </Text>
);
