import { Flex, HStack, ModalBody, Progress, Spinner, Stack, Text } from "@chakra-ui/react";
import { useWordSeekJobsQuery, useWordSeekResultsQuery } from "api/engine.api";
import { Modal } from "components/modals";
import { Select } from "components/select";
import { Tab } from "components/tab";
import { Tag } from "components/tag";
import { Body } from "components/text";
import { GREEN } from "config";
import { useActiveTeam } from "hooks";
import { FC, useEffect, useMemo, useState } from "react";
import { WordSeekJob } from "types";
import { ActionsTab } from "./actions.tab";
import { DataTab } from "./data.tab";

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
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [wordSeekJob, setWordSeekJob] = useState<WordSeekJob | null>(null);
  const [activeTab, setActiveTab] = useState<TAB>(TAB.data);
  const activeTeam = useActiveTeam();

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

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    setSelectedPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobGroup]);

  const pages = wordSeekResults?.map((res) => res.page);

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

  const renderTab = () => {
    if (activeTab === TAB.data) {
      return <DataTab data={selectedResult} exportData={exportData} jobGroup={jobGroup} />;
    }

    if (selectedResult) {
      return <ActionsTab resultId={selectedResult?.id} />;
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <Stack spacing={6}>
        <HStack spacing={4}>
          <Stack>
            <Text fontSize="xl" fontWeight="semibold">
              {activeTeam?.name}
            </Text>
            <Flex alignItems="center">{renderSubheader()}</Flex>
          </Stack>
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
                onChange={({ value }) => {
                  setSelectedPage(value);
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
            </Flex>
          )}
        </HStack>

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
      </Stack>
      <ModalBody overflowY="hidden" pt={6}>
        {isLoading ? (
          <Flex alignItems="center" justifyContent="center" h="40vh">
            <Spinner size="lg" />
          </Flex>
        ) : !selectedPage ? (
          <Flex alignItems="center" justifyContent="center" h="50vh">
            <Stack m="auto" w="full" textAlign="center" alignItems="center">
              <Text fontSize="xl">👆</Text>
              <Body fontSize="lg" w="50%">{`Select a page to see the results...`}</Body>
            </Stack>
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
