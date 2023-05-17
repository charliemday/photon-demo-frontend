import { Flex, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { FiChevronDown } from "react-icons/fi";

interface Props {
  label: string;
}

export const Dropdown: FC<Props> = ({ label }) => (
  <Flex
    background="#F6F5FA"
    width="120px"
    paddingX="12px"
    paddingY="6px"
    borderRadius="6px"
    borderColor="#E7E7E7"
    borderWidth="1px"
    justify="flex-start"
    align="flex-start"
    overflow="hidden"
  >
    <Stack
      height="20px"
      alignSelf="stretch"
      direction="row"
      justify="space-between"
      align="center"
      spacing="15px"
    >
      <Text fontFamily="Clash Grotesk" lineHeight="1.5" fontWeight="medium" fontSize="14px">
        {label}
      </Text>

      <FiChevronDown />
    </Stack>
  </Flex>
);
