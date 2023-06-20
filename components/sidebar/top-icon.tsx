import { Box, HStack } from "@chakra-ui/react";
import { Image } from "components/image";

import { WORD_SEEK } from "config";
import { FC } from "react";

const RATIO = 697 / 100;

const WordSeekLogo: FC<{ size: number }> = ({ size }) => (
  <Box position="relative" w={size} h={size / RATIO}>
    <Image src="/logos/word-seek-logo.png" layout="fill" alt={`${WORD_SEEK} logo`} />
  </Box>
);

export const TopIcon: FC = () => {
  return (
    <HStack p={2}>
      <WordSeekLogo size={100} />
    </HStack>
  );
};
