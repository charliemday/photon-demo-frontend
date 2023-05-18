import { Stack, Text } from "@chakra-ui/react";
import { Tag } from "components/tag";
import { TERTIARY_COLOR } from "config";
import { FC } from "react";

interface Props {
  heading: string;
  label: string;
  text: string;
}

export const FaqText: FC<Props> = ({ heading, label, text }) => (
  <Stack
    background={TERTIARY_COLOR}
    padding="16px"
    borderRadius="8px"
    justify="space-between"
    spacing="12px"
  >
    <Stack direction="row" justify="space-between" align="center" spacing="4px">
      <Text maxWidth="170px" fontSize="sm" fontWeight="semibold">
        {heading}
      </Text>

      <Tag text={label} />
    </Stack>

    <Text fontSize="xs">{text}</Text>
  </Stack>
);
