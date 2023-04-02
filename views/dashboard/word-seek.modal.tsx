import {
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Stack,
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
import { FC, useEffect, useState } from "react";
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

  const { data: sites } = useGetSearchConsoleSitesQuery(undefined);

  const { data: pagesData, refetch: refetchPages } =
    useGetSearchConsolePagesQuery(
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <HStack>
          <Text>👀</Text>
          <Text>Missing Keyword Report</Text>
        </HStack>
      </ModalHeader>
      <ModalBody>
        <Stack>
          <Text fontWeight="medium">Select a website</Text>
          <Select
            placeholder="Select option"
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            {sites?.map((site, idx) => (
              <option value={site} key={idx}>
                {site}
              </option>
            ))}
          </Select>

          <Text fontWeight="medium">Select a page on the website</Text>
          <Select
            placeholder="Select option"
            onChange={(e) => setSelectedPage(e.target.value)}
          >
            {pagesData?.pages?.map((page, idx) => (
              <option value={page} key={idx}>
                {page}
              </option>
            ))}
          </Select>
        </Stack>
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
