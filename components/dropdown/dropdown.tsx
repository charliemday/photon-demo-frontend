import { Box, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { FiChevronDown } from "react-icons/fi";

interface Props {
  label: string;
  maxWidth?: number;
}

export const Dropdown: FC<Props> = ({ label, maxWidth }) => (
  <Box
    background="#F6F5FA"
    maxWidth={maxWidth}
    paddingX="12px"
    paddingY="6px"
    borderRadius="6px"
    borderColor="#E7E7E7"
    borderWidth="1px"
  >
    <Stack direction="row" justify="space-between" align="center" spacing="15px">
      <Text fontSize="sm" fontWeight="medium">
        {label}
      </Text>

      <FiChevronDown />
    </Stack>
  </Box>
);
