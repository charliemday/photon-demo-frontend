import { Flex, Stack, Text } from "@chakra-ui/react";
import { Tag } from "components/tag";
import { Body } from "components/text";
import { FC } from "react";

interface Props {
  title?: string;
}

export const DataEmptyCard: FC<Props> = ({ title }) => (
  <Stack
    background="#F6F5FA"
    padding="12px"
    borderRadius="8px"
    justify="space-between"
    spacing="4px"
    w="full"
  >
    <Body>{title}</Body>

    <Text fontSize="2xl" fontWeight="bold" lineHeight="1">
      n/a
    </Text>

    <Flex>
      <Tag text="+0%" size="sm" />
    </Flex>
  </Stack>
);
