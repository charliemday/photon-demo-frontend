import { Box, HStack, Stack, Tag, Text } from "@chakra-ui/react";
import React, { useState } from "react";

import { useKeywordInsightsResultsQuery } from "api/engine.api";

import { BsCheckCircle } from "react-icons/bs";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { StepWizardChildProps } from "react-step-wizard";
import { RootState, Team } from "types";

interface Props extends Partial<StepWizardChildProps> {
  parentId: number;
  keywords: string[];
  hub: string | null;
  spoke: string | null;
  theme: string | null;
}

export const KeywordItems: React.FC<Props> = (props) => {
  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const { data: results } = useKeywordInsightsResultsQuery(
    {
      parentId: props.parentId,
      teamId: activeTeam?.id,
    },
    {
      skip: !props.parentId || !activeTeam?.id,
    }
  );

  const { hub, spoke, theme } = props;

  return (
    <Stack spacing={6}>
      <Box cursor="pointer" onClick={props.previousStep}>
        <FaArrowLeft />
      </Box>
      <Stack spacing={6}>
        <HStack>
          <Tag colorScheme="green">{hub}</Tag>
          <FaArrowRight />
          <Tag colorScheme="blue">{spoke}</Tag>
          <FaArrowRight />
          <Tag colorScheme="orange">{theme}</Tag>
        </HStack>

        <Text>
          {props.keywords?.length} keyword
          {props.keywords?.length > 1 ? "s" : ""} found for {theme}
        </Text>

        <Stack>
          {props.keywords.map((keyword, index) => (
            <HStack key={index}>
              <Tag
                _hover={{
                  cursor: "pointer",
                  boxShadow: "0 0 0 2px #3182ce",
                }}
                onClick={() => {
                  if (selectedKeywords.includes(keyword)) {
                    setSelectedKeywords(
                      selectedKeywords.filter((k) => k !== keyword)
                    );
                  } else {
                    setSelectedKeywords([...selectedKeywords, keyword]);
                  }
                }}
              >
                {keyword}
              </Tag>
              {selectedKeywords.includes(keyword) && (
                <BsCheckCircle color="green" />
              )}
            </HStack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
