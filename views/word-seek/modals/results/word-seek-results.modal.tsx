import { Box, Flex, HStack, ModalBody, Progress, Stack, Text, useToast } from "@chakra-ui/react";
import {
  useGenerateInsertQueriesMutation,
  useWordSeekJobsQuery,
  useWordSeekResultsQuery,
} from "api/engine.api";
import { Modal } from "components/modals";
import { Select } from "components/select";
import { Tab } from "components/tab";
import { Tag } from "components/tag";
import { Body } from "components/text";
import { BRAND_COLOR, GREEN } from "config";
import { useActiveTeam } from "hooks";
import { FC, useEffect, useMemo, useState } from "react";
import { GoLinkExternal } from "react-icons/go";
import { PropagateLoader } from "react-spinners";
import { WordSeekJob } from "types";
import { ActionsTab } from "./actions.tab";
import { DataTab } from "./data.tab";
import { InsertionQueryTab } from "./insert-query.tab";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  jobGroup: number | null;
}

enum TAB {
  data = "data",
  suggestions = "suggestions",
}

export const WordSeekResultsModal: FC<Props> = ({ isOpen, onClose, jobGroup }) => {
  const toast = useToast();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [wordSeekJob, setWordSeekJob] = useState<WordSeekJob | null>(null);
  const [activeTab, setActiveTab] = useState<TAB>(TAB.data);
  const activeTeam = useActiveTeam();
  const [generateInsertQueries, { isLoading: isGeneratingInsertQueries }] =
    useGenerateInsertQueriesMutation();
  const [insertQueryId, setInsertQueryId] = useState<number | null>(null);

  const { data: wordSeekJobs, isLoading: isLoadingWordSeekJobs } = useWordSeekJobsQuery(
    {
      teamId: activeTeam?.id,
    },
    {
      skip: !activeTeam?.id || !isOpen,
    },
  );

  useEffect(() => {
    if (!isLoadingWordSeekJobs && wordSeekJobs) {
      const job = wordSeekJobs.find((job) => job.jobGroup === jobGroup);
      if (job) setWordSeekJob(job);
    }
  }, [isLoadingWordSeekJobs, wordSeekJobs, jobGroup]);

  useEffect(() => {
    /**
     * If the modal is closed, reset the state
     */
    if (!isOpen) {
      setSelectedPage(null);
      setInsertQueryId(null);
      setActiveTab(TAB.data);
    }
  }, [isOpen]);

  const {
    data: wordSeekResults,
    refetch,
    isLoading,
  } = useWordSeekResultsQuery(
    {
      teamId: activeTeam?.id,
      jobGroup,
    },
    {
      skip: !activeTeam?.uid || !isOpen || !jobGroup,
    },
  );

  const withMissingKeywords = useMemo(
    () => wordSeekResults?.filter((i) => i.missingKeywords.length > 0),
    [wordSeekResults],
  );

  const suggestedPages = useMemo(() => {
    if (!withMissingKeywords || withMissingKeywords?.length < 2) return null;

    const randonIndex1 = Math.floor(Math.random() * withMissingKeywords?.length);
    const randonIndex2 = Math.floor(Math.random() * withMissingKeywords?.length);

    return [withMissingKeywords?.[randonIndex1], withMissingKeywords?.[randonIndex2]];
  }, [withMissingKeywords]);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    setSelectedPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobGroup]);

  const pages = useMemo(() => {
    if (wordSeekResults) {
      return [...wordSeekResults]
        ?.sort((a, b) => b.missingKeywords.length - a.missingKeywords.length)
        .map((res) => res.page);
    }

    return [];
  }, [wordSeekResults]);

  const tableData = useMemo(() => {
    const item = wordSeekResults?.find((i) => i.page === selectedPage);

    if (item) {
      return item.missingKeywords.map((i) => i);
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

  const handleInsertionClick = async (query: string) => {
    /**
     * Generates the insert queries for the selected result
     */
    if (!selectedResult?.id) return;

    const response = await generateInsertQueries({
      resultId: selectedResult?.id,
      query,
    });

    if ("data" in response && response.data) {
      setInsertQueryId(response.data.id);
    } else {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
      });
    }
  };

  const renderTab = () => {
    if (activeTab === TAB.data) {
      return <DataTab data={selectedResult} exportData={exportData} jobGroup={jobGroup} />;
    }

    if (selectedResult) {
      return <ActionsTab resultId={selectedResult?.id} onInsertClick={handleInsertionClick} />;
    }

    return null;
  };

  const jobPercentage = useMemo(() => {
    if (wordSeekJob) {
      return Math.round(wordSeekJob.progress * 100);
    }

    return 0;
  }, [wordSeekJob]);

  const isLatestJob = useMemo(() => {
    if (wordSeekJobs && wordSeekJob) {
      const latestJob = wordSeekJobs.reduce((prev, current) =>
        prev.jobCreated > current.jobCreated ? prev : current,
      );
      return latestJob.jobGroup === wordSeekJob.jobGroup;
    }
  }, [wordSeekJobs, wordSeekJob]);

  const renderSubheader = () => {
    if (jobPercentage < 100) {
      return (
        <>
          <Flex>
            <Progress value={jobPercentage} width={75} borderRadius="md" />
          </Flex>
          <Body ml={2} fontWeight="bold">
            {jobPercentage}%
          </Body>
        </>
      );
    }

    if (isLatestJob) {
      return <Tag text={"Latest Job"} bgColor={GREEN} />;
    }

    return <Tag text={"✅ Complete"} bgColor={GREEN} />;
  };

  const renderStep1 = () => (
    <>
      {!isLoading && selectedPage && tableData?.length ? (
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
      ) : null}
      <ModalBody overflowY="hidden" pt={6}>
        {isLoading ? (
          <Stack alignItems="center" justifyContent="center" h="40vh" spacing={6}>
            <Body fontSize="sm">👷‍♂️ Fetching results...</Body>
            <PropagateLoader color={BRAND_COLOR} />
          </Stack>
        ) : !selectedPage ? (
          <Flex alignItems="center" justifyContent="center" h="50vh">
            <Stack m="auto" w="full" textAlign="center" alignItems="center">
              <Body fontSize="sm">👆 Select a page to see the results...</Body>
              {suggestedPages && (
                <Body fontSize="sm">
                  or start with{" "}
                  <Body
                    as="a"
                    onClick={() => {
                      if (suggestedPages) {
                        setSelectedPage(suggestedPages[1].page);
                      }
                    }}
                    cursor="pointer"
                    color="blue.500"
                    _hover={{
                      textDecoration: "underline",
                    }}
                    fontSize="sm"
                  >
                    this one
                  </Body>
                </Body>
              )}
            </Stack>
          </Flex>
        ) : tableData?.length === 0 ? (
          <Flex alignItems="center" justifyContent="center" h="50vh">
            <Stack m="auto" w="full" textAlign="center" alignItems="center">
              <Body fontSize="md">🎉</Body>
              <Body fontSize="md" w="50%">
                {`No missing keywords found for this page. This means this page is already optimized for the keywords you are targeting.`}
              </Body>
              {suggestedPages && (
                <Text fontSize="lg" w="50%">
                  Try{" "}
                  <Text
                    as="a"
                    onClick={() => {
                      if (suggestedPages) {
                        setSelectedPage(suggestedPages[0].page);
                      }
                    }}
                    cursor="pointer"
                    color="blue.500"
                    _hover={{
                      textDecoration: "underline",
                    }}
                  >
                    this page
                  </Text>{" "}
                  or{" "}
                  <Text
                    as="a"
                    onClick={() => {
                      if (suggestedPages) {
                        setSelectedPage(suggestedPages[1].page);
                      }
                    }}
                    cursor="pointer"
                    color="blue.500"
                    _hover={{
                      textDecoration: "underline",
                    }}
                  >
                    another page
                  </Text>
                  .
                </Text>
              )}
            </Stack>
          </Flex>
        ) : (
          renderTab()
        )}
      </ModalBody>
    </>
  );

  const renderStep2 = () => (
    <InsertionQueryTab
      insertQueryId={insertQueryId}
      onBack={() => {
        setInsertQueryId(null);
      }}
      isLoading={isGeneratingInsertQueries}
      url={selectedPage || ""}
    />
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      contentProps={{
        maxW: "90vw",
      }}
    >
      <Stack spacing={6} mb={6}>
        <HStack spacing={12}>
          <Stack>
            <Text fontSize="xl" fontWeight="semibold">
              {activeTeam?.name}
            </Text>
            <Flex alignItems="center">{renderSubheader()}</Flex>
          </Stack>
          {pages && pages?.length > 0 && (
            <Flex w="60%">
              <HStack w="full">
                <Select
                  options={
                    pages
                      ? pages.map((page) => ({
                          label: page,
                          value: page,
                        }))
                      : []
                  }
                  onChange={({ value }) => {
                    setSelectedPage(value);
                    setActiveTab(TAB.data);
                  }}
                  isLoading={isLoading}
                  placeholder="🔍 Search for a page..."
                  {...(selectedPage && {
                    defaultValue: {
                      label: selectedPage,
                      value: selectedPage,
                    },
                  })}
                />
                {selectedPage && (
                  <Box
                    onClick={() => {
                      if (selectedPage) {
                        window.open(selectedPage, "_blank");
                      }
                    }}
                    cursor="pointer"
                    opacity={0.5}
                    _hover={{
                      opacity: 1,
                    }}
                  >
                    <GoLinkExternal fontSize={32} />
                  </Box>
                )}
              </HStack>
            </Flex>
          )}
        </HStack>

        {insertQueryId ? renderStep2() : renderStep1()}
      </Stack>
    </Modal>
  );
};
