import { Stack, Text } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  heading: string;
  text: string;
}

export const SuggestedText: FC<Props> = ({ heading, text }) => (
  <Stack background="#F6F5FA" paddingX="20px" paddingY="12px" borderRadius="10px" spacing="12px">
    <Text fontSize="sm" fontWeight="medium">
      {heading}
    </Text>

    <Text fontSize="xs" fontWeight="medium">
      {text}
    </Text>
  </Stack>
);
