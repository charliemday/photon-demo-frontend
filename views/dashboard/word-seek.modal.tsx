import {
  Box,
  Flex,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Skeleton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useWordSeekMutation, useWordSeekResultsQuery } from "api/engine.api";
import {
  useGetSearchConsolePagesQuery,
  useGetSearchConsoleSitesQuery,
} from "api/vendor.api";
import { Button } from "components/button";
import { Modal } from "components/modals";
import { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, Team } from "types";
import { typeCheckError } from "utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShowResults: (page: string) => void;
}

export const WordSeekModal: FC<Props> = ({
  isOpen,
  onClose,
  onShowResults,
}) => {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const { refetch: refetchResult } = useWordSeekResultsQuery(activeTeam?.uid, {
    skip: !activeTeam?.uid,
  });

  const toast = useToast();

  const { data: sites, isLoading: isSitesLoading } =
    useGetSearchConsoleSitesQuery(undefined);

  const {
    data: pagesData,
    refetch: refetchPages,
    isLoading: isPagesLoading,
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
        description: "WordSeek is running",
        status: "success",
      });
      refetchResult();
      onShowResults(selectedPage || "");
      onClose();
    }

    if (!isLoading && isError) {
      toast({
        title: "Error",
        description: typeCheckError(error) || "Something went wrong",
        status: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, isLoading, toast]);

  const handleRunWordSeek = () => {
    if (!activeTeam?.id || !selectedSite || !selectedPage) return;
    const data = {
      site: selectedSite,
      pages: [selectedPage],
      teamId: activeTeam?.id,
    };
    runWordSeek(data);
  };

  const isButtonDisabled = !selectedSite || !selectedPage;

  const siteOptionData = useMemo(
    () => sites?.map((site) => ({ value: site, label: site })) || [],
    [sites]
  );

  const pagesOptionData = useMemo(
    () =>
      pagesData?.pages?.map((page) => ({
        value: page,
        label: page,
      })) || [],
    [pagesData]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <HStack>
          <Text>👀</Text>
          <Text>Missing Keyword Report</Text>
        </HStack>
      </ModalHeader>
      <ModalBody>
        <Box w="full">
          <Text fontWeight="medium" mb={3}>
            Select a website
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
            Select a page on the website
          </Text>

          {isPagesLoading ? (
            <Flex justifyContent="center" w="full">
              <Skeleton w="full" h={8} borderRadius="md" />
            </Flex>
          ) : (
            <Select
              placeholder="Select a page"
              onChange={(e) => setSelectedPage(e.target.value)}
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
          isLoading={isLoading}
        >
          Run WordSeek
        </Button>
      </ModalFooter>
    </Modal>
  );
};
