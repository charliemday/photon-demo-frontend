import { Stack, Flex, Text, HStack, Box } from "@chakra-ui/react";
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
  width = "20%",
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
    <Box h={50} border="solid 1px gray" w={50} m="auto" mt={12} />
    <Stack py={6} position="relative" overflow="hidden" flex={1}>
      {items?.length > 0 &&
        items.map(({ label, onClick, icon }, key) => (
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
            {icon}
            <Text fontWeight="semibold">{label}</Text>
          </HStack>
        ))}
    </Stack>
    <Stack h="full" flex={1} justifyContent="flex-end" pb={12}>
      {footerItems.length > 0 &&
        footerItems.map(({ label, onClick, icon }, key) => (
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
          >
            {icon}
            <Text fontWeight="semibold">{label}</Text>
          </HStack>
        ))}
    </Stack>
  </Flex>
);
