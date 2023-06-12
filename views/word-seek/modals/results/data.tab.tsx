import { Flex, TableContainer, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { FC, useMemo } from "react";
import { MissingKeyword, WordSeekItem } from "types";
import { WordSeekResultsTable } from "./word-seek-results.table";

interface Props {
  selectedPage: string | null;
  data?: WordSeekItem[];
}

const columnHelper = createColumnHelper<MissingKeyword>();

const columns = [
  columnHelper.accessor("keyword", {
    cell: (info) => info.getValue(),
    header: "Keyword",
  }),
  columnHelper.accessor("clicks", {
    cell: (info) => info.getValue(),
    header: "Clicks",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("impressions", {
    cell: (info) => info.getValue(),
    header: "Impressions",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("position", {
    cell: (info) => info.getValue(),
    header: "Average Position",
    meta: {
      isNumeric: true,
    },
  }),
];

export const DataTab: FC<Props> = ({ selectedPage, data }) => {
  const tableData = useMemo(() => {
    const item = data?.find((i) => i.page === selectedPage);

    if (item) {
      return item.missingKeywords.map((i) => i);
    }

    return [];
  }, [data, selectedPage]);

  const pages = data?.map((res) => res.page);

  return (
    <TableContainer h="50vh" overflowY="auto">
      <Flex alignItems="center" justifyContent="space-between" pb={6}>
        <Text fontSize="sm" fontWeight="bold">{`🎉 ${tableData?.length} missing quer${
          tableData?.length != 1 ? "ies" : "y"
        } found for this page`}</Text>
        <Text fontWeight="semibold" fontSize="sm">
          Word Seek has run on {pages?.length} page{pages?.length === 1 ? "" : "s"}
        </Text>
      </Flex>
      <WordSeekResultsTable data={tableData} columns={columns} />
    </TableContainer>
  );
};
