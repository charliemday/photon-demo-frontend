import { FC, useEffect, useState } from "react";
import { ModalStepWrapper } from "../modal-step-wrapper";

import { useSelector } from "react-redux";
import { RootState, Team } from "types";

import { Spinner, Stack } from "@chakra-ui/react";
import { KeywordItem, useKeywordInsightsOutputQuery } from "api/engine.api";
import StepWizard from "react-step-wizard";
import { HubItems } from "./hub-items";
import { KeywordItems } from "./keyword-items";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const KeywordInsightsResults: FC<Props> = (props) => {
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [selectedSpoke, setSelectedSpoke] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<KeywordItem[]>([]);

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const {
    data: output,
    refetch,
    isLoading,
    isFetching,
  } = useKeywordInsightsOutputQuery(activeTeam?.id, {
    skip: !activeTeam?.id,
  });

  useEffect(() => {
    if (props.isOpen) {
      /**
       * Whenever the modal is opened, we want to refetch the data to
       * get the latest Keyword Insights output.
       */
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  if (isLoading || isFetching)
    return (
      <ModalStepWrapper {...props}>
        <Stack alignItems="center" py={12}>
          <Spinner />
        </Stack>
      </ModalStepWrapper>
    );

  return (
    <ModalStepWrapper
      {...props}
      contentProps={{
        overflow: "hidden",
      }}
    >
      <StepWizard>
        <HubItems
          isOpen={props.isOpen}
          onClick={(hub, spoke, theme, keywordItems) => {
            setSelectedHub(hub);
            setSelectedSpoke(spoke);
            setSelectedTheme(theme);
            setSelectedKeywords(keywordItems);
          }}
        />
        <KeywordItems
          keywords={selectedKeywords}
          hub={selectedHub}
          theme={selectedTheme}
          spoke={selectedSpoke}
          onGenerateOutlineComplete={props.onClose}
        />
      </StepWizard>
    </ModalStepWrapper>
  );
};