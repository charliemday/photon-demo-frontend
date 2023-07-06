import { Flex, HStack, TableContainer, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "components/button";
import { Body } from "components/text";
import { FC, useMemo, useRef } from "react";
import { CSVLink } from "react-csv";
import { BsDownload } from "react-icons/bs";
import { MissingKeyword, WordSeekItem } from "types";
import { WordSeekResultsTable } from "./word-seek-results.table";

interface Props {
  data?: WordSeekItem | null;
  exportData?: string[][];
  jobGroup?: number | null;
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

const POSITION_LIMIT = 50;

export const DataTab: FC<Props> = ({ data, exportData, jobGroup }) => {
  const csvData = useRef<any>([]);

  const tableData = useMemo(() => {
    if (data) {
      return data.missingKeywords.map((i) => i).filter((i) => i.position < POSITION_LIMIT);
    }

    return [];
  }, [data]);

  return (
    <TableContainer h="50vh" overflowY="auto">
      <Flex alignItems="center" justifyContent="space-between" pb={4}>
        <Text fontSize="sm" fontWeight="bold">{`🎉 ${tableData?.length} missing quer${
          tableData?.length != 1 ? "ies" : "y"
        } found for this page`}</Text>
        <CSVLink
          data={exportData || []}
          filename="word-seek-results.csv"
          ref={(r: any) => (csvData.current = r)}
        />
        <Button
          onClick={() => {
            csvData.current.link.click();
          }}
          size="sm"
        >
          <HStack>
            <BsDownload />
            <Body>CSV</Body>
          </HStack>
        </Button>
      </Flex>
      <WordSeekResultsTable
        data={tableData}
        columns={columns}
        resultId={data?.id}
        jobGroup={jobGroup}
      />
    </TableContainer>
  );
};
