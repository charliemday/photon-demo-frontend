import { Box, Stack, Text } from "@chakra-ui/react";
import { Body } from "components/text";
import { FC } from "react";

interface Props {
  label: string;
}

export const ModalField: FC<Props> = ({ label }) => (
  <Box
    background="#F6F5FA"
    paddingX="12px"
    paddingY="6px"
    borderRadius="6px"
    borderColor="#E7E7E7"
    borderWidth="1px"
  >
    <Stack direction="row" justify="space-between" align="center" spacing="15px">
      <Body>{label}</Body>
    </Stack>
  </Box>
);
