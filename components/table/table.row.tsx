import { Flex, Text } from "@chakra-ui/react";
import { Assigned } from "components/assigned";
import { Tag } from "components/tag";
import { FC } from "react";

export enum RowItemTypes {
  text = "text",
  tag = "tag",
  avatar = "avatar",
}

export interface RowItem {
  text: string;
  type: RowItemTypes;
  flex?: number;
}
interface Props {
  items: RowItem[];
  onClick?: () => void;
}
export const TableRow: FC<Props> = ({ items, onClick }) => {
  const renderRowItem = (text: string, type: RowItemTypes) => {
    if (type === RowItemTypes.text) {
      return (
        <Text fontSize="xs" fontWeight="semibold" key={text}>
          {text}
        </Text>
      );
    }

    if (type === RowItemTypes.tag) {
      return <Tag key={text} fontSize="xs" text={text} />;
    }

    if (type === RowItemTypes.avatar) {
      return <Assigned key={text} name={text} />;
    }
  };

  return (
    <Flex
      direction="row"
      justify="space-between"
      _hover={{
        cursor: "pointer",
        bgColor: "gray.50",
      }}
      p={2}
      borderRadius="md"
      onClick={onClick && onClick}
    >
      {items.map(({ text, type, flex }, key) => {
        return (
          <Flex key={key} flex={flex || 1}>
            {renderRowItem(text, type)}
          </Flex>
        );
      })}
    </Flex>
  );
};
