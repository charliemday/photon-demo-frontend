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
  <Stack direction="row" justify="space-between" spacing="16px">
    <Text fontSize="xs" fontWeight="semibold">
      {text}
    </Text>

    <Tag text={type} />
    <Assigned name={assigned} />
    <Tag text={month} />
    <Tag text={status} />
  </Stack>
);
