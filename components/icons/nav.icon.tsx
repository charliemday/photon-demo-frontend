import { Box, Stack, Text } from "@chakra-ui/react";
import { Label } from "components/text";
import { FC, ReactNode } from "react";

interface Props {
  label: string;
  icon: ReactNode;
}

export const NavIcon: FC<Props> = ({ label = "Performance Data", icon }) => (
  <Stack direction="row" align="center" spacing="10px">
    <Box>{icon}</Box>
    <Label textAlign="center">{label}</Label>
  </Stack>
);
