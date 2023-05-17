import { Stack, Text } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  headers: string[];
}

export const TableHeader: FC<Props> = ({ headers }) => (
  <Stack direction="row" justify="space-between" align="flex-start" spacing="16px" width="100%">
    {headers.map((header) => (
      <Text
        width="100%"
        fontFamily="Inter"
        lineHeight="1.43"
        fontWeight="semibold"
        fontSize="14px"
        key={header}
      >
        {header}
      </Text>
    ))}
  </Stack>
);
