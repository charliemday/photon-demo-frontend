import { Flex, Stack, Text } from "@chakra-ui/react";
import { Label } from "components/text";
import { FC } from "react";

export interface HeaderItem {
  text: string;
  flex?: number;
}

interface Props {
  headers: HeaderItem[];
}

export const TableHeader: FC<Props> = ({ headers }) => (
  <Stack direction="row" justify="space-between" width="100%" p={2}>
    {headers.map(({ text, flex }, key) => (
      <Flex key={key} flex={flex || 1}>
        <Label fontWeight="semibold">{text}</Label>
      </Flex>
    ))}
  </Stack>
);
