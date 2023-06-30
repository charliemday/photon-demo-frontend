import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  chakra,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ManualKeywordCheck } from "components/manual-keyword-check";
import { FC, useState } from "react";
import { MissingKeyword } from "types";

export interface Props {
  data: MissingKeyword[];
  columns: ColumnDef<MissingKeyword, any>[];
  resultId?: number;
  jobGroup?: number | null;
}

export const WordSeekResultsTable: FC<Props> = ({ data, columns, resultId, jobGroup }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Box border="solid 1px #ECECEC" borderRadius="lg" p={2}>
      <TableContainer overflowX="unset" overflowY="unset" pr={4}>
        <Table cellSpacing={24} size="sm">
          <Thead pos="sticky" top={0} zIndex="docked" bgColor="white">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const meta: any = header.column.columnDef.meta;
                  return (
                    <Th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      isNumeric={meta?.isNumeric}
                      py={3}
                      border="none"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      <chakra.span pl="4" cursor="pointer">
                        {header.column.getIsSorted() === "desc" ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )}
                      </chakra.span>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell, i) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const meta: any = cell.column.columnDef.meta;
                  const { original } = cell.row;
                  const isMisspelled = original?.misspelled;
                  const keyword = original?.keyword;

                  return (
                    <Td key={cell.id} isNumeric={meta?.isNumeric} border="none">
                      <HStack justifyContent={i === 0 ? "flex-start" : "center"}>
                        <Box>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Box>
                        {i === 0 && isMisspelled ? (
                          <ManualKeywordCheck
                            jobGroup={jobGroup}
                            resultId={resultId}
                            keyword={keyword}
                          />
                        ) : null}
                      </HStack>
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
