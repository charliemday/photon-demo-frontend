import { Tag as ChakraTag, TagLabel } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
  bgColor?: string;
  textColor?: string;
  size?: string;
}

export const Tag: FC<Props> = ({ text, bgColor, textColor, size = "md" }) => (
  <ChakraTag bgColor={bgColor} textColor={textColor} size={size}>
    <TagLabel textAlign="center" fontWeight="semibold">
      {text}
    </TagLabel>
  </ChakraTag>
);
