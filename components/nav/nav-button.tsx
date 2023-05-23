import { Box, Stack, Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface Props {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

export const NavButton: FC<Props> = ({ label = "Performance Data", icon, onClick, isActive }) => (
  <Stack
    direction="row"
    justify="flex-start"
    align="center"
    spacing="10px"
    cursor="pointer"
    onClick={onClick}
  >
    <Box>{icon}</Box>

    <Text
      lineHeight="1.5"
      fontWeight={isActive ? "bold" : "medium"}
      fontSize="14px"
      color="#000000"
      textAlign="center"
      whiteSpace="nowrap"
    >
      {label}
    </Text>
  </Stack>
);
