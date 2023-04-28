import { FC, useEffect, useState } from "react";
import { ModalStepWrapper } from "../modal-step-wrapper";

import { useSelector } from "react-redux";
import { RootState, Team } from "types";

import { Spinner, Stack } from "@chakra-ui/react";
import {
  KeywordItem,
  useKeywordInsightsOutputQuery,
  useKeywordInsightsResultsQuery,
} from "api/engine.api";
import StepWizard from "react-step-wizard";
import { HubItems } from "./hub-items";
import { KeywordItems } from "./keyword-items";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const KeywordInsightsResults: FC<Props> = (props) => {
  const [parentId, setParentId] = useState<number | null>(null);

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
  } = useKeywordInsightsOutputQuery(activeTeam?.id, {
    skip: !activeTeam?.id,
  });

  useEffect(() => {
    if (output && output.length) {
      setParentId(output[0].id);
    }
  }, [output]);

  useEffect(() => {
    if (props.isOpen) {
      refetch();
    }
  }, [props.isOpen, refetch]);

  useKeywordInsightsResultsQuery(
    {
      // @ts-ignore
      parentId,
      teamId: activeTeam?.id,
    },
    {
      skip: parentId === null || !activeTeam?.id,
    }
  );

  if (!parentId || isLoading)
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
          parentId={parentId}
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
