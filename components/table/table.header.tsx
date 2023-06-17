import { Flex, Stack } from "@chakra-ui/react";
import { Label } from "components/text";
import { FC } from "react";
import { IconType } from "react-icons";

export interface HeaderItem {
  text: string;
  flex?: number;
  /**
   * Optional onClick handler for the header
   * for example, to sort the table
   */
  onClick?: () => void;
  /**
   * Optional icon to display next to the header
   * e.g. an arrow to indicate sorting
   */
  icon?: IconType | null;
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
