import { ButtonProps, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { Body } from "components/text";
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
    <Stack align="center">
      <Text fontSize="xl" fontWeight="medium" textAlign="center">
        {icon}
      </Text>

      <Text fontSize="xl" fontWeight="medium">
        {heading}
      </Text>

      <Body maxWidth="302px" textAlign="center">
        {text}
      </Body>
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
