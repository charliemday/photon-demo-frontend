import {
  Box,
  Flex,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useWordSeekJobsQuery, useWordSeekMutation, useWordSeekResultsQuery } from "api/engine.api";
import { useGetSearchConsolePagesQuery, useGetSearchConsoleSitesQuery } from "api/vendor.api";
import { Button } from "components/button";
import { Modal } from "components/modals";
import { Select } from "components/select";
import { MAX_FREE_RESULTS } from "config";
import { useFeatureFlag, useHasProductAccess } from "hooks";
import { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Features, RootState, Team } from "types";
import { cleanUrl, typeCheckError } from "utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShowResults: (page: string) => void;
  onUpgrade?: () => void;
}

export const WordSeekModal: FC<Props> = ({ isOpen, onClose, onUpgrade }) => {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [wordSeekRunType, setWordSeekRunType] = useState<"page" | "all">("page");

  const activeTeam: Team = useSelector((state: RootState) => state.team.activeTeam);

  const { data: wordSeekJobs, refetch: refetchJobs } = useWordSeekJobsQuery(
    { teamId: activeTeam?.id },
    {
      skip: !activeTeam?.id,
    },
  );

  const { refetch, isLoading: isLoadingResults } = useWordSeekResultsQuery(
    { teamUid: activeTeam?.uid },
    {
      skip: !activeTeam?.uid,
    },
  );

  const [showAwaitEmail, setShowAwaitEmail] = useState(false);

  const { hasAccess: hasProductAccess } = useHasProductAccess();
  const { hasAccess: hasFeatureAccess } = useFeatureFlag();

  const hasAccess = useMemo(() => {
    return hasProductAccess || hasFeatureAccess({ features: [Features.WORD_SEEK_PREMIUM] });
  }, [hasProductAccess, hasFeatureAccess]);

  const resetModal = () => {
    setShowAwaitEmail(false);
    setSelectedPage(null);
    setSelectedSite(null);
    refetchJobs();
  };

  useEffect(() => {
    refetch();

    if (!isOpen) {
      /**
       * Reset the selected page and site
       */
      resetModal();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const toast = useToast();

  const { data: sites, isLoading: isSitesLoading } = useGetSearchConsoleSitesQuery(
    {
      teamUid: activeTeam?.uid || "",
    },
    {
      skip: !activeTeam || !isOpen,
    },
  );

  const {
    data: pagesData,
    refetch: refetchPages,
    isLoading: isPagesLoading,
    isLoading: isPagesFetching,
    isError: isPagesError,
    error: pagesError,
  } = useGetSearchConsolePagesQuery(
    {
      domain: selectedSite || "",
      teamUid: activeTeam?.uid || "",
    },
    {
      skip: !selectedSite || !activeTeam,
    },
  );

  const [runWordSeek, { isLoading, isSuccess, isError, error }] = useWordSeekMutation();

  useEffect(() => {
    refetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSite]);

  useEffect(() => {
    /**
     * Handles success/failure states
     * for the runWordSeek mutation
     */
    if (!isLoading) {
      if (isSuccess) {
        toast({
          title: "Success",
          description: "WordSeek has started",
          status: "success",
        });
        setShowAwaitEmail(true);
      }

      if (isError) {
        toast({
          title: "Error",
          description: typeCheckError(error) || "Something went wrong",
          status: "error",
        });
      }
    }

    /**
     * Handles success/failure states
     * for the getWordSeekResults query
     */
    if (!isPagesLoading && isPagesError) {
      toast({
        title: "Error",
        description: typeCheckError(pagesError) || "Something went wrong",
        status: "error",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, isLoading, toast, isPagesError, pagesError, isPagesLoading]);

  const handleRunWordSeek = () => {
    setWordSeekRunType("page");
    if (!activeTeam?.id || !selectedSite || !selectedPage) return;
    const data = {
      site: selectedSite,
      pages: [selectedPage],
      teamId: activeTeam?.id,
    };
    runWordSeek(data);
  };

  const handleRunWordSeekAll = () => {
    if (!hasAccess) {
      // If the user doesn't have access we should direct them to the Upgrade modal
      if (onUpgrade) onUpgrade();
    } else {
      setWordSeekRunType("all");

      if (!activeTeam?.id || !selectedSite) return;
      const data = {
        site: selectedSite,
        pages: pagesData?.pages || [],
        teamId: activeTeam?.id,
      };
      runWordSeek(data);
    }
  };

  const isButtonDisabled = !selectedSite || !selectedPage;

  const siteOptionData = useMemo(
    () => sites?.map((site) => ({ value: site, label: site })) || [],
    [sites],
  );

  const pagesOptionData = useMemo(
    () =>
      pagesData?.pages.map((page) => ({
        value: page,
        label: page,
      })) || [],
    [pagesData],
  );

  useEffect(() => {
    /**
     * Initialise the selected site
     */
    if (siteOptionData.length) {
      const activeTeamSite = siteOptionData.find(
        (site) => cleanUrl(site.value) === cleanUrl(activeTeam?.url || ""),
      );

      if (activeTeamSite) {
        setSelectedSite(activeTeamSite.value);
      }
    }
  }, [siteOptionData, activeTeam]);

  useEffect(() => {
    /**
     * Initialise the selected page
     */
    if (pagesOptionData.length) {
      setSelectedPage(pagesOptionData[0]?.value || null);
    }
  }, [pagesOptionData]);

  if (showAwaitEmail) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalHeader>
          <HStack>
            <Text>WordSeek Running...</Text>
          </HStack>
        </ModalHeader>
        <ModalBody pt={6}>
          <Stack alignItems="center" textAlign="center" w="70%" m="auto" py={12} spacing={6}>
            <Text fontSize="3xl">⏳</Text>
            <Text fontSize="lg">
              WordSeek is running... we will email your results, but they will also appear in your
              dashboard
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack w="full">
            <Button flex={1} onClick={resetModal}>
              Run another
            </Button>

            <Button flex={1} onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <HStack>
          <Text>👀</Text>
          <Text>WordSeek</Text>
        </HStack>
      </ModalHeader>
      <ModalBody>
        <Box w="full">
          <Text fontWeight="medium" mb={3}>
            {`Select a site`}
          </Text>
          <Box mb={6}>
            <Select
              onChange={({ value }) => setSelectedSite(value)}
              placeholder="🔍 Select for a site..."
              options={siteOptionData.map((site) => ({
                label: site.label.replace("sc-domain:", "https://www."),
                value: site.value,
              }))}
              isLoading={isSitesLoading}
              noOptionsMessage={() => "No sites found"}
            />
          </Box>

          {selectedSite && (
            <Stack>
              <Text fontWeight="medium">Select a page on the site</Text>
              {isPagesLoading || isPagesFetching ? (
                <Flex justifyContent="center" w="full">
                  <Skeleton w="full" h={8} borderRadius="md" />
                </Flex>
              ) : pagesOptionData.length === 0 ? (
                <Box mb={6}>
                  <Text>
                    🤔 No pages found for this site on your Google Search Console. Check out our
                    FAQs for why this might be!
                  </Text>
                </Box>
              ) : (
                <>
                  <Text fontSize="xs" fontWeight="semibold">
                    {pagesData?.pages.length} page{pagesData?.pages.length === 1 ? "" : "s"} found
                  </Text>
                  <Select
                    options={pagesOptionData.map((page) => ({
                      value: page.value,
                      label: page.label,
                    }))}
                    onChange={({ value }) => {
                      setSelectedPage(value);
                    }}
                    placeholder="🔍 Search for a page..."
                    noOptionsMessage={() => "No pages found"}
                  />
                </>
              )}
            </Stack>
          )}
        </Box>
      </ModalBody>
      <ModalFooter position="relative">
        {isLoadingResults ? (
          <Skeleton height="20px" w="full" />
        ) : hasAccess || (wordSeekJobs && wordSeekJobs?.length < MAX_FREE_RESULTS) ? (
          <Button
            onClick={handleRunWordSeek}
            isDisabled={isButtonDisabled}
            isLoading={isLoading && wordSeekRunType === "page"}
          >
            Run for single page
          </Button>
        ) : (
          <Text position="absolute" textAlign="left" fontWeight="semibold" fontSize="sm" left={7}>
            Upgrade to run for more than {MAX_FREE_RESULTS} pages
          </Text>
        )}
        <Button
          onClick={handleRunWordSeekAll}
          isDisabled={!selectedPage}
          isLoading={isLoading && wordSeekRunType === "all"}
        >
          {hasAccess ? "Run for all pages" : "Upgrade to run for all pages"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
