import { Flex, HStack, useDisclosure } from "@chakra-ui/react";
import { FC } from "react";
import { GscConnectModal } from "views/word-seek/modals";
import { RowDataItem, TableRowItem } from "./table.row-item";

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
        {items.map((row, key) => {
          return (
            <Flex key={key} flex={row.flex || 1} alignItems="center" overflow="hidden">
              <TableRowItem onClick={onClick} {...row} />
            </Flex>
          );
        })}
      </HStack>
      <GscConnectModal isOpen={isOpen} onClose={onClose} onComplete={onClose} />
    </>
  );
};
