import { Flex, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  label: string;
  text: string;
  value: string;
  textColor?: string;
}

export const Statistic: FC<Props> = ({ label, text, value, textColor = "black" }) => (
  <Stack justify="flex-start" align="flex-start" width="126px" textColor={textColor}>
    <Stack justify="center" align="flex-start" spacing="0px" alignSelf="stretch">
      <Stack direction="row" justify="center" align="center" spacing="4px" height="20px">
        <Text fontFamily="Inter" lineHeight="2.4" fontWeight="semibold" fontSize="10px">
          {label}
        </Text>
      </Stack>

      <Text fontFamily="Inter" lineHeight="1" fontWeight="semibold" fontSize="24px">
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
      overflow="hidden"
      opacity="0.7"
    >
      <Text
        fontFamily="Inter"
        lineHeight="2.4"
        fontWeight="medium"
        fontSize="10px"
        textAlign="center"
      >
        {value}
      </Text>
    </Flex>
  </Stack>
);
