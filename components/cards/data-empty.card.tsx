import { Flex, Stack, Text } from "@chakra-ui/react";
import { Tag } from "components/tag";
import { Body, Heading } from "components/text";
import { FC } from "react";

interface Props {
  title?: string;
}

export const DataEmptyCard: FC<Props> = ({ title }) => (
  <Flex
    direction="column"
    background="#F6F5FA"
    padding="12px"
    borderRadius="8px"
    justify="space-between"
    gap="2"
    w="full"
  >
    <Body>{title}</Body>
    <Heading fontSize="2xl">n/a</Heading>

    <Flex>
      <Tag text="+0%" size="sm" />
    </Flex>
  </Flex>
);
