import { Box, Divider, Flex, Heading, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { useGenerateKIInputMutation } from "api/engine.api";
// import { useBulkCreateSeedKeywordsMutation } from "api/team.api";
import { useCreateSeedKeywordMutation } from "api/strategies.api";
import { Button } from "components/button";
import { useActiveContentStrategy, useActiveTeam } from "hooks";
import React, { useEffect, useState } from "react";
import { SeedKeywordSource } from "types";
import { calculateSemrushCost, typeCheckError } from "utils";
import { ModalStepWrapper } from "../modal-step-wrapper";
import DatabaseSection from "./database-section";
import InputSection from "./input-section";
import SliderInputSection from "./slider-input-section";
import TargetKeywordsSection from "./target-keywords-section";
import { Body } from "components/text";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateKIInput: React.FC<Props> = (props) => {
  const [maxBroadResults, setMaxBroadResults] = useState<number>(100);
  const [targetKeywords, setTargetKeywords] = useState<string[]>([]);
  const [database, setDatabase] = useState<string>("uk");
  const [topPercent, setTopPercent] = useState(0.3);

  const toast = useToast();

  const activeTeam = useActiveTeam();
  const activeContentStrategy = useActiveContentStrategy();

  const [generateBroadKeywords, { isLoading, isSuccess, isError, error }] =
    useGenerateKIInputMutation();
  const [
    bulkCreateSeedKeywords,
    { isLoading: bulkCreateIsLoading, isError: bulkCreateIsError, error: bulkCreateError },
  ] = useCreateSeedKeywordMutation();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast({
        title: "Success",
        description: "Step 1 and 2 are being run sequentially.",
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

  useEffect(() => {
    if (!bulkCreateIsLoading && bulkCreateIsError) {
      toast({
        title: "Seed Keywords Error",
        description: typeCheckError(bulkCreateError) || "Could not save Seed Keywords.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkCreateIsError, bulkCreateError, bulkCreateIsLoading]);

  const handleSubmit = async () => {
    if (!activeTeam) return;

    const response = await bulkCreateSeedKeywords({
      contentStrategyId: activeContentStrategy?.id,
      body: {
        keywords: targetKeywords.map((keyword) => ({
          keyword,
          source: SeedKeywordSource.USER,
        })),
      },
    });

    if ("error" in response) return;

    generateBroadKeywords({
      database,
      contentStrategyId: activeContentStrategy?.id,
      limit: maxBroadResults,
      topPercentage: topPercent,
      keywords: targetKeywords,
    });
  };

  const isButtonDisabled = !targetKeywords.length || !maxBroadResults || isLoading;

  return (
    <ModalStepWrapper {...props} size="6xl">
      <Box>
        <Heading fontSize="lg">(🌱 + 🔍) Run both Step 1 and 2</Heading>
        <Box my={6} opacity={0.75} w="75%">
          <Body>
            This takes a list of keywords and runs them through the SEMRush Broad Keywords API. This
            will return a list of broad keywords which we can pass through the PAA. All results will
            be saved in the Drive as normal.
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
          <Flex flex={1}>
            <SliderInputSection onChange={(value) => setTopPercent(value as number)} />
          </Flex>
        </HStack>
        <HStack justifyContent="flex-end">
          <Button
            size="lg"
            isLoading={isLoading}
            isDisabled={isButtonDisabled}
            onClick={handleSubmit}
          >{`Run 🚀`}</Button>
        </HStack>
      </Stack>
    </ModalStepWrapper>
  );
};
