import React, { useEffect } from "react";
import { Stack, Heading, Text, Flex, useToast } from "@chakra-ui/react";
import { Button } from "components/button";
import { useCompareSearchConsoleReportMutation } from "api/vendor.api";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Team } from "types";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isDisabled?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchConsoleCompare: React.FC<Props> = ({
  isDisabled,
  isOpen,
  onClose,
}) => {
  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const toast = useToast();

  const [
    compareReport,
    {
      isLoading: isComparing,
      isSuccess: hasComparedSuccessfully,
      error,
      isError,
    },
  ] = useCompareSearchConsoleReportMutation();

  useEffect(() => {
    if (!isComparing && hasComparedSuccessfully) {
      toast({
        title: "Success",
        description:
          "The Compare Report job has been run, you will be notified via Slack when it's done.",
        status: "success",
        isClosable: true,
      });
    }

    if (!isComparing && isError && error) {
      toast({
        title: "Error",
        description: typeCheckError(error) || "Something went wrong.",
        status: "error",
        isClosable: true,
      });
    }
  }, [isComparing, hasComparedSuccessfully, toast, error, isError]);

  const handleGetReport = () => {
    compareReport({
      teamIds: [activeTeam.id],
    });
  };

  return (
    <ModalStepWrapper isOpen={isOpen} onClose={onClose}>
      <Stack spacing={6} pointerEvents={isDisabled ? "none" : "auto"}>
        <Heading fontSize="lg">
          5. Compare Console Report for {activeTeam?.name}
        </Heading>
        <Text fontSize="xs" opacity={0.5}>
          {isDisabled
            ? `You need to connect to Google Search Console to use this automation`
            : `Compare the Search Console Results to see if they exist on specific pages, the engine will extract the latest pages that have not been checked. The output will be saved on the drive.`}
        </Text>
        <Flex justifyContent="flex-end">
          <Button size="sm" onClick={handleGetReport} isLoading={isComparing}>
            Run Compare Report
          </Button>
        </Flex>
      </Stack>
    </ModalStepWrapper>
  );
};
