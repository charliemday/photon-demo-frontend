import { Box, Stack, Text } from "@chakra-ui/react";
import { Label } from "components/text";
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

    <Label
      fontFamily="ClashGrotesk"
      fontWeight={isActive ? "semibold" : "medium"}
      textAlign="center"
      whiteSpace="nowrap"
    >
      {label}
    </Label>
  </Stack>
);
