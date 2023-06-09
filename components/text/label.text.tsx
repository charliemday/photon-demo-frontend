import { Text, TextProps } from "@chakra-ui/react";
import { Font } from "types/fonts";

interface Props extends Omit<TextProps, "fontSize"> {
  fontFamily?: Font;
  fontWeight?: "medium" | "semibold";
  size?: "sm" | "md" | "lg";
}

export const Label = ({
  fontFamily = "Inter",
  fontWeight = "semibold",
  lineHeight = "1.5",
  size = "sm",
  children,
  ...rest
}: Props) => (
  <Text
    fontFamily={fontFamily}
    fontSize={size}
    fontWeight={fontWeight}
    lineHeight={lineHeight}
    my="-1"
    {...rest}
  >
    {children}
  </Text>
);
