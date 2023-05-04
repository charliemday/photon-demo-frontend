import {
  Grid,
  GridItem,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  useCreateSeedKeywordMutation,
  useListSeedKeywordsQuery,
} from "api/strategies.api";
import { Button } from "components/button";
import { FC, useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { typeCheckError } from "utils";

interface Props extends Partial<StepWizardChildProps> {
  contentStrategyId: number | null;
}

export const Step3: FC<Props> = ({
  nextStep,
  currentStep = 0,
  totalSteps,
  previousStep,
  contentStrategyId,
}) => {
  const [targetKeywords, setTargetKeywords] = useState<{
    [key: number]: string;
  }>({
    0: "",
  });

  const toast = useToast();

  const { data: seedKeywords, isLoading: isFetchingSeedKeywords } =
    useListSeedKeywordsQuery(
      {
        contentStrategyId: contentStrategyId || 0,
      },
      {
        skip: !contentStrategyId,
      }
    );

  useEffect(() => {
    if (seedKeywords) {
      setTargetKeywords(
        seedKeywords.reduce((acc: any, seedKeyword, index) => {
          acc[index] = seedKeyword.keyword;
          return acc;
        }, {})
      );
    }
  }, [seedKeywords, isFetchingSeedKeywords]);

  const [
    createSeedKeywords,
    {
      isLoading: isCreatingSeedKeywords,
      error: createSeedKeywordsError,
      isSuccess: isSeedKeywordsCreated,
      isError: isSeedKeywordsCreateError,
    },
  ] = useCreateSeedKeywordMutation();

  const handleCreateTargetKeywords = () => {
    // Filter out empty target keywords
    const filteredTargetKeywords = Object.values(targetKeywords).filter(
      (targetKeyword) => targetKeyword !== ""
    );

    console.log(filteredTargetKeywords, contentStrategyId);

    if (filteredTargetKeywords.length && contentStrategyId) {
      createSeedKeywords({
        contentStrategyId,
        body: {
          keywords: filteredTargetKeywords,
        },
      });
    }
  };

  useEffect(() => {
    if (!isCreatingSeedKeywords && isSeedKeywordsCreated) {
      nextStep && nextStep();
    }

    if (!isCreatingSeedKeywords && isSeedKeywordsCreateError) {
      toast({
        title:
          typeCheckError(createSeedKeywordsError) || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [
    isCreatingSeedKeywords,
    isSeedKeywordsCreated,
    isSeedKeywordsCreateError,
    createSeedKeywordsError,
    nextStep,
    toast,
  ]);

  return (
    <Stack spacing={12}>
      <Stack>
        <Text fontSize="xl" fontWeight="bold">
          Extra Competitors
        </Text>
        <Text fontSize="sm" fontWeight="light" color="gray.500">
          Step {currentStep} of {totalSteps}
        </Text>
      </Stack>

      <Stack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          Add Target Keywords
        </Text>
        <Text>
          We use these keywords to check for more competitors and classify
          results using AI, to make sure that your strategy is hyper-focused on
          your theme.
        </Text>

        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <GridItem key={index}>
              <Input
                placeholder="Target Keyword"
                onChange={(e) => {
                  setTargetKeywords({
                    ...targetKeywords,
                    [index]: e.target.value,
                  });
                }}
              />
            </GridItem>
          ))}
        </Grid>
      </Stack>

      <HStack>
        <Button onClick={previousStep}>Previous Step</Button>
        <Button
          onClick={handleCreateTargetKeywords}
          isLoading={isCreatingSeedKeywords}
        >
          Check for more competitors
        </Button>
      </HStack>
    </Stack>
  );
};
