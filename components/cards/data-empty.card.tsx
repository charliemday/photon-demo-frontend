import { Flex, Stack, Text } from "@chakra-ui/react";
import { Tag } from "components/tag";
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
    <Text fontSize="xs" fontWeight="semibold" lineHeight="1">
      {title}
    </Text>

    <Text fontSize="2xl" fontWeight="bold" lineHeight="1">
      n/a
    </Text>

    <Flex>
      <Tag text="+0%" size="sm" />
    </Flex>
  </Stack>
);
