import { Flex, HStack, Progress, Text, useDisclosure } from "@chakra-ui/react";
import { Assigned } from "components/assigned";
import { Button } from "components/button";
import { Tag } from "components/tag";
import { Body } from "components/text";
import { GREEN } from "config";
import { FC } from "react";
import { TaskStatusEnum } from "types";
import { GscConnectModal } from "views/word-seek/modals";

export enum RowItemTypes {
  text = "text",
  tag = "tag",
  avatar = "avatar",
  progress = "progress",
  button = "button",
}

export type RowSize = "xs" | "sm" | "md" | "lg";
export interface RowDataItem {
  text: string | number;
  type: RowItemTypes;
  flex?: number;
  size?: RowSize;
}
interface Props {
  items: RowDataItem[];
  /**
   * What happens when the row is clicked or a specific row component is clicked?
   */
  onClick?: () => void;
  /**
   * Is the entire row clickable?
   */
  isClickable?: boolean;
}
export const TableRow: FC<Props> = ({ items, onClick, isClickable = true }) => {
  const { isOpen, onClose } = useDisclosure();

  const renderRowItem = (value: string | number, type: RowItemTypes, size: RowSize = "xs") => {
    if (type === RowItemTypes.text && typeof value === "string") {
      return (
        <Text fontSize={size} fontWeight="semibold" key={value}>
          {value}
        </Text>
      );
    }

    if (type === RowItemTypes.tag && typeof value === "string") {
      return (
        <Tag
          key={value}
          fontSize={size}
          text={value}
          bgColor={[TaskStatusEnum.done].includes(value as TaskStatusEnum) ? GREEN : undefined}
        />
      );
    }

    if (type === RowItemTypes.avatar && typeof value === "string") {
      return <Assigned key={value} name={value} size={size} />;
    }

    if (type === RowItemTypes.progress && typeof value === "number") {
      if (value === 100) {
        return <Tag key={value} fontSize={size} text={"✅ Complete"} bgColor={GREEN} />;
      }

      return (
        <HStack>
          <Flex>
            <Progress value={value} size="md" width={75} borderRadius="md" />
          </Flex>
          <Body>{value}%</Body>
        </HStack>
      );
    }

    if (type === RowItemTypes.button && typeof value === "string") {
      return (
        <Button onClick={onClick} size={size}>
          {value}
        </Button>
      );
    }
  };

  return (
    <>
      <HStack
        direction="row"
        justify="space-between"
        _hover={{
          cursor: isClickable && "pointer",
          bgColor: "gray.50",
        }}
        p={2}
        borderRadius="md"
        onClick={() => {
          if (isClickable) {
            onClick?.();
          }
        }}
      >
        {items.map(({ text, type, flex, size }, key) => {
          return (
            <Flex key={key} flex={flex || 1} alignItems="center">
              {renderRowItem(text, type, size)}
            </Flex>
          );
        })}
      </HStack>
      <GscConnectModal isOpen={isOpen} onClose={onClose} onComplete={onClose} />
    </>
  );
};
