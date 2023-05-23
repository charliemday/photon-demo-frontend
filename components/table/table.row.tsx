import { Flex, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { Assigned } from "components/assigned";
import { Tag } from "components/tag";
import { GREEN } from "config";
import { FC } from "react";
import { TaskStatusEnum, TaskTypeSlugEnum } from "types";
import { GscConnectModal } from "views/word-seek";

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
  rowType?: string;
}
export const TableRow: FC<Props> = ({ items, onClick, rowType }) => {
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

  const handleClick = () => {
    // TODO: Hacky way to open the GSC modal - need to create a universal useModal hook
    // that can access provider state and dispatch
    if (rowType && rowType === TaskTypeSlugEnum.onboarding) {
      onOpen();
    } else if (onClick) onClick();
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
        onClick={handleClick}
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
