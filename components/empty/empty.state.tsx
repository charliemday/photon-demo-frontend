import { ButtonProps, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { SECONDARY_COLOR } from "config/brand";
import { FC } from "react";

interface Props {
  icon: string;
  heading: string;
  text: string;
  button: Pick<ButtonProps, "onClick"> & { text: string };
}

export const EmptyState: FC<Props> = ({ icon, heading, text, button }) => (
  <Stack justify="center" align="center" spacing="30px">
    <Stack justify="flex-start" align="center">
      <Text
        fontFamily="Clash Grotesk"
        lineHeight="1.55"
        fontWeight="medium"
        fontSize="20px"
        letterSpacing="0.31px"
        textAlign="center"
      >
        {icon}
      </Text>

      <Text
        fontFamily="Clash Grotesk"
        lineHeight="1.55"
        fontWeight="medium"
        fontSize="20px"
        letterSpacing="0.31px"
        flex="1"
      >
        {heading}
      </Text>

      <Text
        maxWidth="302px"
        fontFamily="Inter"
        lineHeight="1.67"
        fontWeight="medium"
        fontSize="12px"
        color="#252525"
        textAlign="center"
      >
        {text}
      </Text>
    </Stack>

    <Button
      bgColor={SECONDARY_COLOR}
      textColor="white"
      borderColor="black"
      borderWidth="1px"
      onClick={button.onClick}
    >
      {button.text}
    </Button>
  </Stack>
);
