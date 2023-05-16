import { Tag as ChakraTag, TagLabel } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
}

export const Tag: FC<Props> = ({ text }) => (
  <ChakraTag size="sm" height="20px">
    <TagLabel textAlign="center">{text}</TagLabel>
  </ChakraTag>
);
