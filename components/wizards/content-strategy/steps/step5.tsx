import {
  Checkbox,
  Divider,
  HStack,
  Stack,
  Tag,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  useCreateSeedKeywordMutation,
  useDeleteSeedKeywordMutation,
  useGenerateContentStrategyMutation,
  useListSeedKeywordsQuery,
} from "api/strategies.api";
import { Button } from "components/button";
import { GridInputForm } from "forms/grid-input";
import { FC, useEffect, useMemo, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { SeedKeywordSource } from "types";
import { typeCheckError } from "utils";

interface Props extends Partial<StepWizardChildProps> {
  contentStrategyId?: number | null;
}

export const Step5: FC<Props> = ({
  nextStep,
  currentStep = 0,
  totalSteps,
  previousStep,
  contentStrategyId,
  isActive,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();
  const [targetKeywords, setTargetKeywords] = useState<string[]>([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState<{
    [key: number]: { keyword: string; searchVolume: number };
  }>({
    0: {
      keyword: "",
      searchVolume: 0,
    },
  });

  const [
    generatContentStrategy,
    {
      isLoading: isGeneratingContentStrategy,
      isSuccess: isGeneratedContentStrategy,
      isError: isGenerateContentStrategyError,
      error: generateContentStrategyError,
    },
  ] = useGenerateContentStrategyMutation();

  const [
    createSeedKeywords,
    {
      isLoading: isCreatingSeedKeywords,
      isSuccess: isCreatedSeedKeywords,
      isError: isCreateSeedKeywordsError,
      error: createSeedKeywordsError,
    },
  ] = useCreateSeedKeywordMutation();

  const [deleteKeyword] = useDeleteSeedKeywordMutation();

  const { data: seedKeywords, refetch } = useListSeedKeywordsQuery(
    {
      contentStrategyId: contentStrategyId || 0,
    },
    {
      skip: !contentStrategyId,
    }
  );

  const competitorKeywords = useMemo(() => {
    return seedKeywords?.filter(
      (keyword) => keyword.source === SeedKeywordSource.COMPETITOR
    );
  }, [seedKeywords]);

  useEffect(() => {
    /**
     * Refetch seed keywords when content strategy id changes
     */
    if (contentStrategyId && isActive) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentStrategyId, isActive]);

  useEffect(() => {
    /**
     * Handling the creation of the seed keywords
     */
    if (!isCreatingSeedKeywords && isCreatedSeedKeywords && contentStrategyId) {
      // Generate the content strategy
      generatContentStrategy({
        contentStrategyId,
      });
    }

    if (!isCreatingSeedKeywords && isCreateSeedKeywordsError) {
      toast({
        title:
          typeCheckError(createSeedKeywordsError) || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsGenerating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isCreatingSeedKeywords,
    isCreatedSeedKeywords,
    isCreateSeedKeywordsError,
    createSeedKeywordsError,
  ]);

  useEffect(() => {
    /**
     * Handling the generation of the content strategy outcome
     */
    if (!isGeneratingContentStrategy && isGeneratedContentStrategy) {
      nextStep && nextStep();
      setIsGenerating(false);
    }

    if (!isGeneratingContentStrategy && isGenerateContentStrategyError) {
      toast({
        title:
          typeCheckError(generateContentStrategyError) ||
          "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsGenerating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isGeneratedContentStrategy,
    isGenerateContentStrategyError,
    generateContentStrategyError,
    generateContentStrategyError,
  ]);

  const handleGenerateStrategy = async () => {
    /**
     * We make 3 requests controlled by the useEffect
     * 1. Create "User" seed keywords
     * 2. Remove any "Competitor" seed keywords that are not selected
     * 3. Run the stategy
     */

    // Global loading state
    setIsGenerating(true);

    // Find the competitor keywords that do not exist in the suggested keywords
    const competitorKeywordsToRemove = competitorKeywords
      ?.filter(
        ({ keyword }) =>
          !Object.values(suggestedKeywords).find((k) => k.keyword === keyword)
      )
      .map(({ id }) => id);

    // Remove the competitor keywords that do not exist in the suggested keywords
    competitorKeywordsToRemove?.forEach(async (id) => {
      await deleteKeyword({
        contentStrategyId: contentStrategyId || 0,
        seedKeywordId: id,
      });
    });

    // Create the user seed keywords
    createSeedKeywords({
      contentStrategyId: contentStrategyId || 0,
      body: {
        keywords: targetKeywords.map((keyword) => ({
          keyword,
          source: SeedKeywordSource.USER,
        })),
      },
    });
  };

  return (
    <Stack spacing={12}>
      <Stack>
        <Text fontSize="xl" fontWeight="bold">
          Review Keywords
        </Text>
        <Text fontSize="sm" fontWeight="light" color="gray.500">
          Step {currentStep} of {totalSteps}
        </Text>
      </Stack>

      <Stack spacing={6}>
        <Text fontSize="lg" fontWeight="bold">
          Select Seed Keywords
        </Text>
        <Text>
          These keywords are the result of your competitor analysis and form the
          seeds of your content strategy. You can add your own keywords and
          remove any you do not want to target.
        </Text>

        <Stack spacing={6}>
          <Text fontSize="lg" fontWeight="semibold">
            Your Target Keywords
          </Text>
          <Stack spacing={4}>
            <GridInputForm onChange={setTargetKeywords} />
          </Stack>
        </Stack>
        <Divider />
        <Stack spacing={6}>
          <Text fontSize="lg" fontWeight="semibold">
            Suggested Competitor Keywords
          </Text>
          <Stack spacing={4}>
            {competitorKeywords?.map(({ keyword, searchVolume }, i) => {
              return (
                <HStack key={i} justifyContent="space-between">
                  <Checkbox
                    isChecked={suggestedKeywords[i] ? true : false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSuggestedKeywords({
                          ...suggestedKeywords,
                          [i]: { keyword, searchVolume },
                        });
                      } else {
                        const newSuggestedKeywords = { ...suggestedKeywords };
                        delete newSuggestedKeywords[i];
                        setSuggestedKeywords(newSuggestedKeywords);
                      }
                    }}
                  >
                    <Text fontWeight="semibold">{keyword}</Text>
                  </Checkbox>
                  {searchVolume && (
                    <HStack>
                      <Text>Volume</Text>
                      <Tag>{searchVolume}</Tag>
                    </HStack>
                  )}
                </HStack>
              );
            })}
          </Stack>
        </Stack>
      </Stack>

      <HStack>
        <Button onClick={previousStep}>Previous Step</Button>
        <Button onClick={handleGenerateStrategy} isLoading={isGenerating}>
          Generate Strategy
        </Button>
      </HStack>
    </Stack>
  );
};
