import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  label: string;
  text: string;
  value: string;
  textColor?: string;
}

export const Statistic: FC<Props> = ({ label, text, value, textColor = "black" }) => (
  <Box width="126px" textColor={textColor}>
    <Stack justify="center" spacing="0px">
      <Stack direction="row" justify="center" align="center" spacing="4px" height="20px">
        <Text fontSize="10px" fontWeight="semibold">
          {label}
        </Text>
      </Stack>

      <Text fontSize="2xl" fontWeight="semibold">
        {text}
      </Text>
    </Stack>

    <Flex
      background="white"
      height="16px"
      paddingX="2px"
      borderRadius="4px"
      direction="row"
      justify="center"
      align="center"
      opacity="0.7"
    >
      <Text fontSize="10px" fontWeight="medium" textAlign="center">
        {value}
      </Text>
    </Flex>
  </Box>
);
