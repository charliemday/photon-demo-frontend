import { Box, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { BiRefresh } from "react-icons/bi";
import { MoonLoader } from "react-spinners";
import { HeaderItem, TableHeader } from "./table.header";
import { TableRow } from "./table.row";
import { RowDataItem } from "./table.row-item";

export interface RowItem {
  rowData: RowDataItem[];
  rowClick?: () => void;
  rowType?: string;
  rowClickable?: boolean;
}
interface Props {
  headers?: HeaderItem[];
  rowItems?: RowItem[];
  isLoading?: boolean;
  emptyText?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Table: FC<Props> = ({
  isLoading,
  onRefresh,
  isRefreshing,

  headers = [],
  rowItems = [],

  emptyText = "No data to display",
}) => {
  const renderSkeleton = () => (
    <Stack spacing={6}>
      <Skeleton height="40px" w="full" borderRadius="md" />
      <Stack>
        {Array.from({ length: 5 }).map((_, key) => (
          <Skeleton key={key} height="30px" w="full" borderRadius="md" />
        ))}
      </Stack>
    </Stack>
  );

  return (
    <Stack
      background="white"
      width="100%"
      p="20px"
      borderRadius="8px"
      borderColor="#ECECEC"
      borderWidth="1px"
      justify="space-between"
      spacing="20px"
      position="relative"
      opacity={isRefreshing ? 0.5 : 1}
    >
      {onRefresh && (
        <HStack
          opacity={0.75}
          _hover={{ opacity: 1 }}
          position="absolute"
          top={3}
          right={3}
          cursor="pointer"
          onClick={onRefresh}
          title="Refresh"
        >
          <Box>{isRefreshing ? <MoonLoader size={16} /> : <BiRefresh size={20} />}</Box>
        </HStack>
      )}
      {isLoading ? (
        <>{renderSkeleton()}</>
      ) : (
        <Stack justify="space-between">
          <TableHeader headers={headers} />
          {rowItems?.length ? (
            rowItems.map(({ rowData, rowClick, rowClickable }, key) => (
              <TableRow key={key} items={rowData} onClick={rowClick} isClickable={rowClickable} />
            ))
          ) : (
            <Text textAlign="center" py={12} fontWeight="semibold">
              {emptyText}
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
};
