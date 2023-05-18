import { Tag as ChakraTag, TagLabel } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
  bgColor?: string;
  textColor?: string;
}

export const Tag: FC<Props> = ({ text, bgColor, textColor }) => (
  <ChakraTag bgColor={bgColor} textColor={textColor}>
    <TagLabel textAlign="center" fontWeight="semibold">
      {text}
    </TagLabel>
  </ChakraTag>
);
