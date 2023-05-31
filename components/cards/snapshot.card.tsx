import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { Body } from "components/text";
import React from "react";

interface Props {
  title: string;
  subtitle: string;
  listItems?: {
    prefix: string;
    suffix: string;
  }[];
  isSelected?: boolean;
  onClick?: () => void;
}

const CARD_HEIGHT = 150;
const CARD_WIDTH = 275;

export const SnapshotCard: React.FC<Props> = ({
  title,
  subtitle,
  listItems,
  isSelected,
  onClick,
}) => (
  <Flex
    border="solid 1px lightgray"
    borderRadius="lg"
    py={3}
    px={6}
    alignItems="flex-start"
    cursor="pointer"
    _hover={{
      boxShadow: "md",
    }}
    h={CARD_HEIGHT}
    w="100%"
    onClick={onClick}
    bgColor={isSelected ? "purple.500" : "white"}
  >
    <Stack>
      <Text fontSize="md" textColor={isSelected ? "white" : "gray.500"}>
        {subtitle}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" textColor={isSelected ? "white" : "black"}>
        {title}
      </Text>
      {listItems?.map((item, index) => (
        <HStack key={index}>
          <Body fontWeight="semibold" textColor={isSelected ? "white" : "gray.500"}>
            {item.prefix}
          </Body>

          <Body textColor={isSelected ? "white" : "gray.500"}>{item.suffix}</Body>
        </HStack>
      ))}
    </Stack>
  </Flex>
);
