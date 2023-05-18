import { Stack, Text } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  headers: string[];
}

export const TableHeader: FC<Props> = ({ headers }) => (
  <Stack direction="row" justify="space-between" spacing="16px" width="100%">
    {headers.map((header) => (
      <Text fontSize="sm" fontWeight="semibold" key={header}>
        {header}
      </Text>
    ))}
  </Stack>
);
