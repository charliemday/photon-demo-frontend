import {
  Box,
  Divider,
  Flex,
  HStack,
  ModalBody,
  ModalFooter,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useWordSeekResultsQuery } from "api/engine.api";
import { Button } from "components/button";
import { Image } from "components/image";
import { Modal } from "components/modals";
import { Select } from "components/select";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { AiOutlineTeam } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { BsDownload } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState, Team } from "types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultPage?: string | null;
}

export const WordSeekResultsModal: FC<Props> = ({ isOpen, onClose, defaultPage = null }) => {
  const [selectedPage, setSelectedPage] = useState<string | null>(defaultPage);

  const csvData = useRef<any>([]);
  const activeTeam: Team = useSelector((state: RootState) => state.team.activeTeam);

  const {
    data: wordSeekResults,
    refetch,
    isLoading,
    isFetching,
  } = useWordSeekResultsQuery(activeTeam?.uid, {
    skip: !activeTeam?.uid,
  });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (selectedPage === null && wordSeekResults && wordSeekResults?.length > 0) {
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
      <Stack p={4}>
        <HStack justifyContent="space-between" alignItems="flex-end">
          <HStack spacing={4} w="75%">
            <Box w={12} h={12} position="relative" borderRadius="md" overflow="hidden">
              <Image
                src={activeTeam?.logo || ""}
                alt={activeTeam?.name}
                layout="fill"
                fallbackComponent={<AiOutlineTeam fontSize={32} />}
              />
            </Box>
            <Stack w="full" flex={1}>
              <Text fontSize="xl" fontWeight="semibold">
                {activeTeam?.name}
              </Text>
              {pages && pages?.length > 0 && (
                <Select
                  options={
                    pages
                      ? pages.map((page) => ({
                          label: page,
                          value: page,
                        }))
                      : []
                  }
                  onChange={({ value }) => setSelectedPage(value)}
                  placeholder="🔍 Search for a page..."
                />
              )}
            </Stack>
          </HStack>
          <HStack spacing={2}>
            <Button isLoading={isFetching} onClick={refetch}>
              <Text mr={2}>Refresh</Text>
              <BiRefresh fontSize={18} />
            </Button>
            <CSVLink
              data={buildExportData()}
              filename="word-seek-results.csv"
              ref={(r: any) => (csvData.current = r)}
            />
            <Button
              onClick={() => {
                csvData.current.link.click();
              }}
            >
              CSV{" "}
              <Box ml={2}>
                <BsDownload />
              </Box>
            </Button>
          </HStack>
        </HStack>
      </Stack>
      <ModalBody>
        <Divider mb={6} />
        {isLoading ? (
          <Flex alignItems="center" justifyContent="center" h="40vh">
            <Spinner size="lg" />
          </Flex>
        ) : tableData?.length === 0 ? (
          <Flex alignItems="center" justifyContent="center" h="50vh">
            <Stack m="auto" w="full" textAlign="center" alignItems="center">
              <Text fontSize="xl">🎉</Text>
              <Text fontSize="lg" w="50%">
                {`No missing keywords found for this page. This means this page is already optimized for the keywords you are targeting.`}
              </Text>
            </Stack>
          </Flex>
        ) : (
          <TableContainer h="50vh" overflowY="auto">
            <Flex alignItems="center" justifyContent="space-between" pb={6}>
              <Text fontSize="sm" fontWeight="bold">{`${tableData?.length} missing keyword${
                tableData?.length > 1 ? "s" : ""
              } found for this page`}</Text>
              <Text fontWeight="semibold" fontSize="sm">
                Word Seek has run on {pages?.length} page{pages?.length === 1 ? "" : "s"}
              </Text>
            </Flex>
            <Table variant="striped" size="sm">
              <Thead>
                <Tr>
                  <Th>Keyword</Th>
                  <Th>Clicks</Th>
                  <Th>Impressions</Th>
                  <Th>Average Position</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableData?.map((i, index) => (
                  <Tr key={index}>
                    <Td>{i.keyword}</Td>
                    <Td>{i.clicks}</Td>
                    <Td>{i.impressions}</Td>
                    <Td>{i.position}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};
