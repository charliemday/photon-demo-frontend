import {
  Box,
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
import { Modal } from "components/modals";
import { FC, useEffect, useMemo, useState } from "react";
import { AiOutlineCopy } from "react-icons/ai";
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

  const copyPageToClipboard = () => {
    if (selectedPage) {
      navigator.clipboard.writeText(selectedPage);
      toast({
        title: "Copied to clipboard",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const pages = wordSeekResults?.map((res) => res.page);

  const tableData = useMemo(() => {
    const item = wordSeekResults?.find((i) => i.page === selectedPage);

    if (item) {
      return item.missingKeywords.map((i, index) => i);
    }

    return [];
  }, [wordSeekResults, selectedPage]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalHeader>
        <HStack>
          <Text>🏁</Text>
          <Text>Your Word Seek Results</Text>
        </HStack>
      </ModalHeader>
      <ModalBody>
        <TableContainer h="50vh" overflowY="auto">
          <Flex alignItems="center" justifyContent="space-between" pb={6}>
            <Text fontSize="sm" fontWeight="bold">{`${
              tableData.length
            } missing keyword${
              tableData.length > 1 ? "s" : ""
            } found for this page`}</Text>
            <HStack>
              <Select
                size="sm"
                onChange={(e) => setSelectedPage(e.target.value)}
              >
                {pages?.map((page, index) => (
                  <option key={index} value={page}>
                    {page}
                  </option>
                ))}
              </Select>
              <Box
                cursor="pointer"
                opacity={selectedPage ? 0.75 : 0}
                _hover={{
                  opacity: selectedPage ? 1 : 0,
                  color: "blue.500",
                }}
                title="Copy to clipboard"
                onClick={copyPageToClipboard}
              >
                <AiOutlineCopy fontSize={18} />
              </Box>
            </HStack>
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
