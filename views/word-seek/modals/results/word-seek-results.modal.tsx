import { Flex, HStack, ModalBody, Spinner, Stack, Text } from "@chakra-ui/react";
import { useWordSeekResultsQuery } from "api/engine.api";
import { Modal } from "components/modals";
import { Select } from "components/select";
import { Tab } from "components/tab";
import { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, Team } from "types";
import { ActionsTab } from "./actions.tab";
import { DataTab } from "./data.tab";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultPage?: string | null;
  jobGroupUuid: string | null;
}

enum TAB {
  data = "data",
  suggestions = "suggestions",
}

export const WordSeekResultsModal: FC<Props> = ({
  isOpen,
  onClose,
  jobGroupUuid,
  defaultPage = null,
}) => {
  const [selectedPage, setSelectedPage] = useState<string | null>(defaultPage);
  const activeTeam: Team = useSelector((state: RootState) => state.team.activeTeam);

  const [activeTab, setActiveTab] = useState<TAB>(TAB.data);

  const {
    data: wordSeekResults,
    refetch,
    isLoading,
    isFetching,
  } = useWordSeekResultsQuery(
    {
      teamUid: activeTeam?.uid,
      jobGroupUuid,
    },
    {
      skip: !activeTeam?.uid,
    },
  );

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    /**
     * Set the selected page to the first page in the list
     * when the results change
     */
    if (wordSeekResults && wordSeekResults?.length > 0) {
      setSelectedPage(wordSeekResults[0].page);
    }
  }, [wordSeekResults]);

  const pages = wordSeekResults?.map((res) => res.page);

  const tableData = useMemo(() => {
    const item = wordSeekResults?.find((i) => i.page === selectedPage);

    if (item) {
      return item.missingKeywords.map((i, index) => i);
    }

    return [];
  }, [wordSeekResults, selectedPage]);

  const exportData = useMemo((): string[][] => {
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
  }, [wordSeekResults]);

  const selectedResult = useMemo(() => {
    if (wordSeekResults) {
      return wordSeekResults.find((i) => i.page === selectedPage);
    }

    return null;
  }, [wordSeekResults, selectedPage]);

  const renderTab = () => {
    if (activeTab === TAB.data) {
      return <DataTab data={selectedResult} exportData={exportData} />;
    }

    if (selectedResult) {
      return <ActionsTab resultId={selectedResult?.id} />;
    }

    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <Stack spacing={6}>
        <HStack spacing={4}>
          <Text fontSize="xl" fontWeight="semibold">
            {activeTeam?.name}
          </Text>
          {pages && pages?.length > 0 && (
            <Flex w="60%">
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
                {...(selectedPage && {
                  defaultValue: {
                    label: selectedPage,
                    value: selectedPage,
                  },
                })}
              />
            </Flex>
          )}
        </HStack>

        <HStack justifyContent="space-between" alignItems="flex-end">
          <HStack>
            <HStack>
              <Tab
                label="Missing Query Data"
                onClick={() => setActiveTab(TAB.data)}
                isActive={activeTab === TAB.data}
              />
              <Tab
                label="Optimisation Suggestions"
                onClick={() => setActiveTab(TAB.suggestions)}
                isActive={activeTab === TAB.suggestions}
              />
            </HStack>
          </HStack>
        </HStack>
      </Stack>
      <ModalBody overflowY="hidden" pt={6}>
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
          renderTab()
        )}
      </ModalBody>
    </Modal>
  );
};
