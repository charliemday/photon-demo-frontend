import {
  Box,
  Flex,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useWordSeekMutation } from "api/engine.api";
import { useUserDetailsQuery } from "api/user.api";
import {
  useGetSearchConsolePagesQuery,
  useGetSearchConsoleSitesQuery,
} from "api/vendor.api";
import { Button } from "components/button";
import { Modal } from "components/modals";
import { useHasProductAccess } from "hooks";
import { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, Team } from "types";
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

  const [wordSeekRunType, setWordSeekRunType] = useState<"page" | "all">(
    "page"
  );

  const { data: userDetails } = useUserDetailsQuery(undefined);

  const [showAwaitEmail, setShowAwaitEmail] = useState(false);

  const { hasAccess } = useHasProductAccess();

  useEffect(() => {
    setShowAwaitEmail(false);
  }, [isOpen]);

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const toast = useToast();

  const { data: sites, isLoading: isSitesLoading } =
    useGetSearchConsoleSitesQuery(undefined);

  const {
    data: pagesData,
    refetch: refetchPages,
    isLoading: isPagesLoading,
    isError: isPagesError,
    error: pagesError,
  } = useGetSearchConsolePagesQuery(
    {
      domain: selectedSite || "",
    },
    {
      skip: !selectedSite,
    }
  );

  const [runWordSeek, { isLoading, isSuccess, isError, error }] =
    useWordSeekMutation();

  useEffect(() => {
    refetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSite]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast({
        title: "Success",
        description: "WordSeek has started",
        status: "success",
      });
      setShowAwaitEmail(true);
    }

    if (!isLoading && isError) {
      toast({
        title: "Error",
        description: typeCheckError(error) || "Something went wrong",
        status: "error",
      });
    }

    if (!isPagesLoading && isPagesError) {
      toast({
        title: "Error",
        description: typeCheckError(pagesError) || "Something went wrong",
        status: "error",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccess,
    isError,
    error,
    isLoading,
    toast,
    isPagesError,
    pagesError,
    isPagesLoading,
  ]);

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
    [sites]
  );

  const pagesOptionData = useMemo(
    () =>
      pagesData?.pages.map((page) => ({
        value: page,
        label: page,
      })) || [],
    [pagesData]
  );

  useEffect(() => {
    if (siteOptionData.length) {
      const activeTeamSite = siteOptionData.find(
        (site) => cleanUrl(site.value) === cleanUrl(activeTeam?.url || "")
      );

      if (activeTeamSite) {
        setSelectedSite(activeTeamSite.value);
      }
    }
  }, [siteOptionData, activeTeam]);

  useEffect(() => {
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
          <Stack
            alignItems="center"
            textAlign="center"
            w="70%"
            m="auto"
            py={12}
            spacing={6}
          >
            <Text fontSize="3xl">⏳</Text>
            <Text fontSize="lg">
              WordSeek is running... we will email your results, but they will
              also appear in your dashboard
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button w="full" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <HStack>
          <Text>👀</Text>
          <Text>WordSeek: Missing Keywords Report</Text>
        </HStack>
      </ModalHeader>
      <ModalBody>
        <Box w="full">
          <Text fontWeight="medium" mb={3}>
            {`Select a site`}
          </Text>
          <Box mb={6}>
            {isSitesLoading ? (
              <Flex justifyContent="center" w="full">
                <Skeleton w="full" h={8} borderRadius="md" />
              </Flex>
            ) : (
              <Select
                onChange={(e) => setSelectedSite(e.target.value)}
                placeholder="Select a site"
                {...(selectedSite && { value: selectedSite })}
              >
                {siteOptionData.map((site) => (
                  <option key={site.value} value={site.value}>
                    {site.label}
                  </option>
                ))}
              </Select>
            )}
          </Box>

          <Text fontWeight="medium" mb={3}>
            Select a page on the site
          </Text>

          {isPagesLoading ? (
            <Flex justifyContent="center" w="full">
              <Skeleton w="full" h={8} borderRadius="md" />
            </Flex>
          ) : (
            <Select
              placeholder="Select a page"
              onChange={(e) => setSelectedPage(e.target.value)}
              {...(selectedPage && { value: selectedPage })}
            >
              {pagesOptionData.map((page) => (
                <option key={page.value} value={page.value}>
                  {page.label}
                </option>
              ))}
            </Select>
          )}
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={handleRunWordSeek}
          isDisabled={isButtonDisabled}
          isLoading={isLoading && wordSeekRunType === "page"}
        >
          Run for single page
        </Button>
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
