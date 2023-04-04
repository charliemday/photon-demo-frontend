import {
  Box,
  Divider,
  Flex,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useWordSeekResultsQuery } from "api/engine.api";
import { Button } from "components/button";
import { Image } from "components/image";
import { Modal } from "components/modals";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { AiOutlineTeam } from "react-icons/ai";
import { BsDownload } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState, Team } from "types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultPage?: string | null;
}

export const WordSeekResultsModal: FC<Props> = ({
  isOpen,
  onClose,
  defaultPage = null,
}) => {
  const [selectedPage, setSelectedPage] = useState<string | null>(defaultPage);

  const csvData = useRef<any>([]);
  const toast = useToast();

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const { data: wordSeekResults, refetch } = useWordSeekResultsQuery(
    activeTeam?.uid,
    {
      skip: !activeTeam?.uid,
    }
  );

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (
      selectedPage === null &&
      wordSeekResults &&
      wordSeekResults?.length > 0
    ) {
      setSelectedPage(wordSeekResults[0].page);
    }
  }, [wordSeekResults, selectedPage]);

  const pages = wordSeekResults?.map((res) => res.page);

  const tableData = useMemo(() => {
    const item = wordSeekResults?.find((i) => i.page === selectedPage);

    if (item) {
      return item.missingKeywords.map((i, index) => i);
    }

    return [];
  }, [wordSeekResults, selectedPage]);

  const buildExportData = (): string[][] => {
    const results = [["Page", "Keyword", "Clicks", "Impressions"]];
    if (wordSeekResults?.length) {
      wordSeekResults.forEach((page) => {
        page.missingKeywords.forEach((keyword) => {
          results.push([
            page.page,
            keyword.keyword,
            keyword.clicks.toString(),
            keyword.impressions.toString(),
          ]);
        });
      });
    }

    return results;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalHeader>
        <HStack justifyContent="space-between" alignItems="flex-end">
          <HStack spacing={4}>
            <Box
              w={12}
              h={12}
              position="relative"
              borderRadius="md"
              overflow="hidden"
            >
              <Image
                src={activeTeam?.logo || ""}
                alt={activeTeam?.name}
                layout="fill"
                fallbackComponent={<AiOutlineTeam fontSize={32} />}
              />
            </Box>
            <Box>
              <Text>{activeTeam?.name}</Text>
              <Select
                size="sm"
                onChange={(e) => setSelectedPage(e.target.value)}
                p={0}
                cursor="pointer"
              >
                {pages?.map((page, index) => (
                  <option key={index} value={page}>
                    {page}
                  </option>
                ))}
              </Select>
            </Box>
          </HStack>
          <HStack>
            <CSVLink
              data={buildExportData()}
              filename="word-seek-results.csv"
              ref={(r: any) => (csvData.current = r)}
            />
            <Button
              onClick={() => {
                csvData.current.link.click();
              }}
              size="sm"
            >
              CSV{" "}
              <Box ml={2}>
                <BsDownload />
              </Box>
            </Button>
          </HStack>
        </HStack>
      </ModalHeader>
      <ModalBody>
        <Divider mb={6} />
        <TableContainer h="50vh" overflowY="auto">
          <Flex alignItems="center" justifyContent="space-between" pb={6}>
            <Text fontSize="sm" fontWeight="bold">{`${
              tableData.length
            } missing keyword${
              tableData.length > 1 ? "s" : ""
            } found for this page`}</Text>
          </Flex>
          <Table variant="striped" size="sm">
            <Thead>
              <Tr>
                <Th>Keyword</Th>
                <Th>Clicks</Th>
                <Th>Impressions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((i, index) => (
                <Tr key={index}>
                  <Td>{i.keyword}</Td>
                  <Td>{i.clicks}</Td>
                  <Td>{i.impressions}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};
