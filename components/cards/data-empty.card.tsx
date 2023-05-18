import { Stack, Text } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  heading: string;
}

export const DataEmptyCard: FC<Props> = ({ heading }) => (
  <Stack
    background="#F6F5FA"
    width="150px"
    paddingX="12px"
    paddingY="9px"
    borderRadius="8px"
    spacing="10px"
  >
    <Stack justify="center" spacing="0px">
      <Stack direction="row" justify="center" align="center" spacing="4px" height="20px">
        <Text fontSize="10px" fontWeight="semibold">
          {heading}
        </Text>
      </Stack>

      <Text fontSize="2xl" fontWeight="semibold">
        n/a
      </Text>
    </Stack>

    <Stack
      background="#FFFFFF"
      paddingX="2px"
      borderRadius="4px"
      direction="row"
      justify="center"
      align="center"
      spacing="10px"
      opacity="0.7"
    >
      <Text fontSize="10px" fontWeight="medium" textAlign="center">
        +0%
      </Text>
    </Stack>
  </Stack>
);
