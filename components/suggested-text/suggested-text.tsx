import { Flex, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  heading: string;
  text: string;
}

export const SuggestedText: FC<Props> = ({ heading, text }) => (
  <Flex
    background="#F6F5FA"
    width="100%"
    maxWidth="100%"
    paddingX="20px"
    paddingY="12px"
    borderRadius="10px"
    justify="flex-start"
    align="flex-start"
    overflow="hidden"
  >
    <Stack justify="flex-start" align="flex-start" spacing="12px" alignSelf="stretch">
      <Text
        alignSelf="stretch"
        fontFamily="Clash Grotesk"
        lineHeight="1.43"
        fontWeight="medium"
        fontSize="14px"
        letterSpacing="0.31px"
      >
        {heading}
      </Text>

      <Text
        alignSelf="stretch"
        fontFamily="Inter"
        lineHeight="1.33"
        fontWeight="medium"
        fontSize="12px"
      >
        {text}
      </Text>
    </Stack>
  </Flex>
);
