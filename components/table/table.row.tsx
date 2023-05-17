import { Stack, Text } from "@chakra-ui/react";
import { Assigned } from "components/assigned";
import { Tag } from "components/tag";
import { FC } from "react";

interface Props {
  text: string;
  type: string;
  assigned: string;
  month: string;
  status: string;
}

export const TableRow: FC<Props> = ({ text, type, assigned, month, status }) => (
  <Stack width="100%" direction="row" justify="space-between" align="flex-start" spacing="16px">
    <Text width="100%" fontFamily="Inter" lineHeight="1.43" fontWeight="semibold" fontSize="12px">
      {text}
    </Text>

    <Stack direction="row" justify="space-between" align="flex-start" spacing="16px" width="100%">
      <Tag text={type} />
    </Stack>

    <Stack direction="row" justify="space-between" align="flex-start" spacing="16px" width="100%">
      <Assigned name={assigned} />
    </Stack>

    <Stack direction="row" justify="space-between" align="flex-start" spacing="16px" width="100%">
      <Tag text={month} />
    </Stack>

    <Stack direction="row" justify="space-between" align="flex-start" spacing="16px" width="100%">
      <Tag text={status} />
    </Stack>
  </Stack>
);
