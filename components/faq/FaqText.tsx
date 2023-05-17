import { Flex, Stack, Text } from "@chakra-ui/react";
import { Tag } from "components/tag";
import { FC } from "react";

interface Props {
  heading: string;
  label: string;
  text: string;
}

export const FaqText: FC<Props> = ({ heading, label, text }) => (
  <Flex
    background="#BD95E7"
    width="100%"
    maxWidth="100%"
    padding="16px"
    borderRadius="8px"
    justify="space-between"
    align="flex-start"
    overflow="hidden"
  >
    <Stack justify="flex-start" align="flex-start" spacing="12px" alignSelf="stretch">
      <Stack
        direction="row"
        alignSelf="stretch"
        justify="space-between"
        align="center"
        spacing="4px"
      >
        <Text
          width="170px"
          fontFamily="Inter"
          lineHeight="1.71"
          fontWeight="semibold"
          fontSize="14px"
          color="black"
        >
          {heading}
        </Text>

        <Tag text={label} />
      </Stack>

      <Text
        alignSelf="stretch"
        fontFamily="Inter"
        lineHeight="1.67"
        fontWeight="regular"
        fontSize="12px"
        color="black"
      >
        {text}
      </Text>
    </Stack>
  </Flex>
);
