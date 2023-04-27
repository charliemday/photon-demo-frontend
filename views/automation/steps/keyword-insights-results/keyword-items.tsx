import {
  Box,
  HStack,
  Stack,
  Tag,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useGenerateBlogOutlinesMutation } from "api/blog.api";
import { KeywordItem } from "api/engine.api";
import { RootState } from "types";

import { Button } from "components/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { StepWizardChildProps } from "react-step-wizard";
import { typeCheckError } from "utils";

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

  const activeTeam = useSelector((state: RootState) => state.team.activeTeam);

  const { onCopy, hasCopied } = useClipboard(selectedKeywords.join("\n"));
  const toast = useToast();

  const [
    generateOutline,
    {
      isLoading: isGenerating,
      isSuccess: isGenerated,
      isError: isGenerateError,
      error: generateError,
    },
  ] = useGenerateBlogOutlinesMutation();

  const handleGenerateOutline = () => {
    if (selectedKeywords.length && activeTeam) {
      generateOutline({
        team: activeTeam?.id,
        keywords: selectedKeywords,
      });
    }
  };

  useEffect(() => {
    if (!isGenerating && isGenerated) {
      toast({
        title: "Blog Outline Generated",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    }

    if (!isGenerating && isGenerateError) {
      console.log(generateError);

      toast({
        title: typeCheckError(generateError) || "Unable to generate outline",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  }, [isGenerating, isGenerated, isGenerateError, generateError, toast]);

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: "Keywords Copied",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    }
  }, [hasCopied, toast]);

  useEffect(() => {
    setSelectedKeywords([]);
  }, [props]);

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
      <HStack justifyContent="flex-end" pt={6}>
        <Button onClick={onCopy} isDisabled={!selectedKeywords.length}>
          {hasCopied ? "Copied!" : "Copy Keywords"}
        </Button>
        <Button
          isDisabled={!selectedKeywords.length}
          onClick={handleGenerateOutline}
          isLoading={isGenerating}
        >
          🤖 Generate Outline
        </Button>
      </HStack>
    </Stack>
  );
};
