import { Flex, HStack, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface ItemInterface {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  icon?: React.ReactNode;
}

interface Props {
  width?: string | number;
  items?: ItemInterface[];
  footerItems?: ItemInterface[];
}

export const Sidebar: React.FC<Props> = ({
  width = "50%",
  items = [],
  footerItems = [],
}) => (
  <Flex
    flexDir="column"
    width={width}
    h="full"
    position="fixed"
    bgColor="#FAF7F3"
  >
    <Text p={6} fontWeight="semibold">
      baser
    </Text>
    <Stack py={6} position="relative" overflow="hidden" flex={1}>
      {items?.length > 0 &&
        items.map(({ label, onClick, icon, isActive }, key) => (
          <HStack
            cursor="pointer"
            _hover={{
              backgroundColor: "gray.200",
            }}
            key={key}
            px={6}
            py={2}
            onClick={onClick}
          >
            <Flex
              border={isActive ? "solid 1px black" : "none"}
              p={1}
              borderRadius="md"
              w={8}
              h={8}
              alignItems="center"
              justifyContent="center"
              bgColor={isActive ? "purple.500" : "gray.200"}
              boxShadow="xl"
            >
              {icon}
            </Flex>
            <Text fontWeight={isActive ? "semibold" : "normal"}>{label}</Text>
          </HStack>
        ))}
    </Stack>
    <Stack h="full" flex={1} justifyContent="flex-end" pb={12}>
      {footerItems.length > 0 &&
        footerItems.map(({ label, onClick, icon, isActive }, key) => (
          <HStack
            px={6}
            py={2}
            bottom={10}
            cursor="pointer"
            _hover={{
              backgroundColor: "gray.200",
            }}
            w="full"
            key={key}
            onClick={onClick}
          >
            <Flex
              border={isActive ? "solid 1px black" : "none"}
              p={1}
              borderRadius="md"
              w={8}
              h={8}
              alignItems="center"
              justifyContent="center"
              bgColor={isActive ? "purple.500" : "gray.200"}
              boxShadow="xl"
            >
              {icon}
            </Flex>
            <Text fontWeight={isActive ? "semibold" : "normal"}>{label}</Text>
          </HStack>
        ))}
    </Stack>
  </Flex>
);
