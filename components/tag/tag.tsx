import { Tag as ChakraTag, TagLabel } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
  bgColor?: string;
  textColor?: string;
}

export const Tag: FC<Props> = ({ text, bgColor, textColor }) => (
  <ChakraTag bgColor={bgColor} textColor={textColor} size="sm" height="20px">
    <TagLabel textAlign="center">{text}</TagLabel>
  </ChakraTag>
);
