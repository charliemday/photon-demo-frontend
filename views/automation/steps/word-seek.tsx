import { Flex, Heading, Stack, Text, useToast } from "@chakra-ui/react";
import { useCompareSearchConsoleReportMutation } from "api/vendor.api";
import { Button } from "components/button";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Team } from "types";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";
import { Body } from "components/text";

interface Props {
  isDisabled?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const WordSeek: React.FC<Props> = ({ isDisabled, isOpen, onClose }) => {
  const activeTeam: Team = useSelector((state: RootState) => state.team.activeTeam);

  const [wordseekType, setWordseekType] = React.useState<"team" | "all">("team");

  const toast = useToast();

  const [
    compareReport,
    { isLoading: isComparing, isSuccess: hasComparedSuccessfully, error, isError },
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

  const handleRunWorkSeekTeamOnly = () => {
    setWordseekType("team");
    compareReport({
      teamIds: [activeTeam.id],
    });
  };

  const handleRunWordSeekAll = () => {
    setWordseekType("all");
    compareReport({});
  };

  return (
    <ModalStepWrapper isOpen={isOpen} onClose={onClose}>
      <Stack spacing={6} pointerEvents={isDisabled ? "none" : "auto"}>
        <Heading fontSize="lg">5. Run WordSeek</Heading>
        <Body opacity={0.5}>
          {isDisabled
            ? `You need to connect to Google Search Console to use this automation`
            : `Compare the Search Console Results to see if they exist on specific pages, the engine will extract the latest pages that have not been checked. The output will be saved on the drive.`}
        </Body>
        <Flex justifyContent="space-between">
          <Button
            size="sm"
            onClick={handleRunWorkSeekTeamOnly}
            isLoading={isComparing && wordseekType === "team"}
          >
            Run WordSeek for {activeTeam?.name} only
          </Button>
          <Button
            size="sm"
            onClick={handleRunWordSeekAll}
            isLoading={isComparing && wordseekType === "all"}
          >
            Run WordSeek for all teams
          </Button>
        </Flex>
      </Stack>
    </ModalStepWrapper>
  );
};
