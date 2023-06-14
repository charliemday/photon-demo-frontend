import { Skeleton, Stack, Text } from "@chakra-ui/react";
import { TaskRowItem } from "hooks";
import { FC } from "react";
import { HeaderItem, TableHeader } from "./table.header";
import { TableRow } from "./table.row";

interface Props {
  headers?: HeaderItem[];
  rowItems?: TaskRowItem[];
  isLoading?: boolean;
  emptyText?: string;
}

export const Table: FC<Props> = ({
  headers = [],
  rowItems = [],
  isLoading,
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
    >
      {isLoading ? (
        <>{renderSkeleton()}</>
      ) : (
        <Stack justify="space-between">
          <TableHeader headers={headers} />
          {rowItems?.length ? (
            rowItems.map(({ rowData, rowClick }, key) => (
              <TableRow key={key} items={rowData} onClick={rowClick} />
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
