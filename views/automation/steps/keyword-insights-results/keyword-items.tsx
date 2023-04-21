import { Box, HStack, Stack, Tag, Text } from "@chakra-ui/react";
import React, { useState } from "react";

import { KeywordItem } from "api/engine.api";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {
  parentId: number;
  keywords: KeywordItem[];
  hub: string | null;
  spoke: string | null;
  theme: string | null;
}

export const KeywordItems: React.FC<Props> = (props) => {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
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
          {props.keywords.map(({ keyword, search_volume }, index) => (
            <HStack key={index} justifyContent="space-between">
              <Tag
                _hover={{
                  cursor: "pointer",
                  boxShadow: "0 0 0 2px #3182ce",
                }}
                colorScheme={
                  selectedKeywords.includes(keyword) ? "green" : undefined
                }
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

              <Tag
                colorScheme={
                  selectedKeywords?.includes(keyword) ? "green" : "gray"
                }
              >
                Search Volume: {search_volume}
              </Tag>
            </HStack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
