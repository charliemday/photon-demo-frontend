import { Tag as ChakraTag, TagLabel, ThemingProps, TypographyProps } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: TypographyProps["fontSize"];
  size?: ThemingProps["size"];
}

export const Tag: FC<Props> = ({ text, bgColor, textColor, fontSize, size = "md" }) => (
  <ChakraTag bgColor={bgColor} textColor={textColor} size={size}>
    <TagLabel fontSize={fontSize} textAlign="center" fontWeight="semibold">
      {text}
    </TagLabel>
  </ChakraTag>
);
