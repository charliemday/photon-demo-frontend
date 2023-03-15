import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  useBulkCreateSeedKeywordsMutation,
  useGenerateBroadKeywordsMutation,
} from "api/team.api";
import { Button } from "components/button";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, Team } from "types";
import { calculateSemrushCost, typeCheckError } from "utils";
import { ModalStepWrapper } from "../modal-step-wrapper";
import DatabaseSection from "./database-section";
import InputSection from "./input-section";
import TargetKeywordsSection from "./target-keywords-section";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadSeedKeywords: React.FC<Props> = (props) => {
  const [maxBroadResults, setMaxBroadResults] = useState(100);
  const [targetKeywords, setTargetKeywords] = useState<string[]>([]);
  const [database, setDatabase] = useState<string>("uk");
  const toast = useToast();

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const [generateBroadKeywords, { isLoading, isSuccess, isError, error }] =
    useGenerateBroadKeywordsMutation();
  const [
    bulkCreateSeedKeywords,
    {
      isLoading: bulkCreateIsLoading,
      isError: bulkCreateIsError,
      error: bulkCreateError,
    },
  ] = useBulkCreateSeedKeywordsMutation();

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
        description:
          typeCheckError(error) || "Broad keywords failed to generate.",
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
        description:
          typeCheckError(bulkCreateError) || "Could not save Seed Keywords.",
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
      teamUid: activeTeam.uid,
      keywords: targetKeywords,
    });

    if ("error" in response) return;

    generateBroadKeywords({
      database,
      teamId: activeTeam.id,
      limit: maxBroadResults,
      keywords: targetKeywords,
    });
  };

  const isButtonDisabled =
    !targetKeywords.length || !maxBroadResults || isLoading;

  return (
    <ModalStepWrapper {...props} size="6xl">
      <Box>
        <Heading fontSize="lg">
          🌱 Generate Broad Keywords through SEMRush
        </Heading>
        <Text fontSize="xs" my={6} opacity={0.75} w="75%">
          {`This takes a list of keywords and runs them through the SEMRush Broad Keywords API.`}
        </Text>

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
              title={`Max Broad Keyword Results (Est. max cost: $${calculateSemrushCost(
                {
                  costPerLine: 20,
                  noOfLines: maxBroadResults,
                  noOfRequests: targetKeywords.length,
                }
              )})`}
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
