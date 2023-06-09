import { Flex, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { Assigned } from "components/assigned";
import { Tag } from "components/tag";
import { GREEN } from "config";
import { FC } from "react";
import { TaskStatusEnum } from "types";
import { GscConnectModal } from "views/word-seek/modals";

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
  const { isOpen, onClose, onOpen } = useDisclosure();

  const renderRowItem = (text: string, type: RowItemTypes) => {
    if (type === RowItemTypes.text) {
      return (
        <Text fontSize="xs" fontWeight="semibold" key={text}>
          {text}
        </Text>
      );
    }

    if (type === RowItemTypes.tag) {
      return (
        <Tag
          key={text}
          fontSize="xs"
          text={text}
          bgColor={[TaskStatusEnum.done].includes(text as TaskStatusEnum) ? GREEN : undefined}
        />
      );
    }

    if (type === RowItemTypes.avatar) {
      return <Assigned key={text} name={text} />;
    }
  };

  return (
    <>
      <HStack
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
            <Flex key={key} flex={flex || 1} alignItems="center">
              {renderRowItem(text, type)}
            </Flex>
          );
        })}
      </HStack>
      <GscConnectModal isOpen={isOpen} onClose={onClose} onComplete={onClose} />
    </>
  );
};
