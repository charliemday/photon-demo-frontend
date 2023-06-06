import { Box, Divider, Flex, Heading, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { useCreateSeedKeywordMutation } from "api/strategies.api";
import {
  // useBulkCreateSeedKeywordsMutation,
  useGenerateBroadKeywordsMutation,
} from "api/team.api";
import { Button } from "components/button";
import { useActiveContentStrategy, useActiveTeam } from "hooks";
import React, { useEffect, useState } from "react";
import { calculateSemrushCost, typeCheckError } from "utils";
import { ModalStepWrapper } from "../modal-step-wrapper";
import DatabaseSection from "./database-section";
import InputSection from "./input-section";
import TargetKeywordsSection from "./target-keywords-section";
import { Body } from "components/text";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadSeedKeywords: React.FC<Props> = (props) => {
  const [maxBroadResults, setMaxBroadResults] = useState(100);
  const [targetKeywords, setTargetKeywords] = useState<string[]>([]);
  const [database, setDatabase] = useState<string>("uk");
  const toast = useToast();

  const activeTeam = useActiveTeam();
  const activeContentStrategy = useActiveContentStrategy();

  const [generateBroadKeywords, { isLoading, isSuccess, isError, error }] =
    useGenerateBroadKeywordsMutation();
  const [createSeedKeywords] = useCreateSeedKeywordMutation();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast({
        title: "Broad Keywords Success",
        description: "Broad keywords are being generated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      props.onClose();
    }

    if (!isLoading && isError) {
      toast({
        title: "Broad Keywords Error",
        description: typeCheckError(error) || "Broad keywords failed to generate.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, isLoading]);

  const handleSubmit = async () => {
    /**
     * On submitting we:
     * 1. Save the seed keywords to the database
     * 2. Generate the broad keywords from the seed keywords
     */
    if (!activeTeam) return;

    const response = await createSeedKeywords({
      contentStrategyId: activeContentStrategy?.id,
      body: {
        keywords: targetKeywords.map((keyword) => ({
          keyword,
        })),
      },
    });

    if ("error" in response) return;

    generateBroadKeywords({
      database,
      contentStrategyId: activeContentStrategy?.id,
      limit: maxBroadResults,
      keywords: targetKeywords,
    });
  };

  const isButtonDisabled = !targetKeywords.length || !maxBroadResults || isLoading;

  return (
    <ModalStepWrapper {...props} size="6xl">
      <Box>
        <Heading fontSize="lg">🌱 Generate Broad Keywords through SEMRush</Heading>
        <Box my={6} opacity={0.75} w="75%">
          <Body>
            This takes a list of keywords and runs them through the SEMRush Broad Keywords API.
          </Body>
        </Box>

        <Divider my={6} />
      </Box>

      <Stack spacing={12}>
        <HStack alignItems="flex-start">
          <Flex flex={1}>
            <DatabaseSection onChange={setDatabase} />
          </Flex>
          <Flex flex={1}>
            <TargetKeywordsSection onChangeKeywords={setTargetKeywords} />
          </Flex>
        </HStack>

        <HStack>
          <Flex flex={1}>
            <InputSection
              title={`Max Broad Keyword Results (Est. max cost: $${calculateSemrushCost({
                costPerLine: 20,
                noOfLines: maxBroadResults,
                noOfRequests: targetKeywords.length,
              })})`}
              onChange={(value) => setMaxBroadResults(value as number)}
              defaultValue={maxBroadResults}
              helperText={`This is the number of broad keyword match results to return for each of the keywords.`}
              label="Max Broad Results:"
            />
          </Flex>
          <Flex flex={1} />
        </HStack>
        <HStack justifyContent="flex-end">
          <Button
            size="lg"
            isLoading={isLoading}
            isDisabled={isButtonDisabled}
            onClick={handleSubmit}
          >{`Generate Broad Keywords 🚀`}</Button>
        </HStack>
      </Stack>
    </ModalStepWrapper>
  );
};
