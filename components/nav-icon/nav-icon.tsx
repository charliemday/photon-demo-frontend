import { Box, Stack, Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface Props {
  label: string;
  icon: ReactNode;
}

export const NavIcon: FC<Props> = ({ label = "Performance Data", icon }) => (
  <Stack direction="row" justify="flex-start" align="center" spacing="10px">
    <Box>{icon}</Box>

    <Text
      fontFamily="Clash Grotesk"
      lineHeight="1.5"
      fontWeight="medium"
      fontSize="14px"
      textAlign="center"
    >
      {label}
    </Text>
  </Stack>
);
