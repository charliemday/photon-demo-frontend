import { Box, HStack, Text, useToast } from "@chakra-ui/react";
import { Button } from "components/button";
import React, { useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

import { Input, Stack } from "@chakra-ui/react";
import {
  useCreateCompetitorsMutation,
  useGenerateCompetitorsKeywordsMutation,
  useListCompetitorsQuery,
  useListGeographiesQuery,
  useUpdateContentStrategyMutation,
} from "api/strategies.api";
import { SemrushDatabaseMenu } from "components/menus";
import { CompetitorInterface } from "forms/competitors";
import { typeCheckError } from "utils";

interface Props extends Partial<StepWizardChildProps> {
  contentStrategyId: number | null;
}

export const Step2: React.FC<Props> = ({
  nextStep,
  previousStep,
  currentStep = 0,
  totalSteps,
  contentStrategyId,
}) => {
  const [geography, setGeography] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [competitors, setCompetitors] = useState<{
    [key: number]: CompetitorInterface;
  }>({
    0: {
      name: "",
      url: "",
    },
  });
  const toast = useToast();

  const { data: geographies, isLoading: isGeographiesLoading } =
    useListGeographiesQuery();

  const { data: contentStrategyCompetitors } = useListCompetitorsQuery(
    {
      contentStrategyId: contentStrategyId || 0,
    },
    {
      skip: !contentStrategyId,
    }
  );

  const [
    generateCompetitorsKeywords,
    {
      isLoading: isGeneratingCompetitorsKeywords,
      error: generateCompetitorsKeywordsError,
      isSuccess: isCompetitorsKeywordsGenerated,
      isError: isCompetitorsKeywordsGenerateError,
    },
  ] = useGenerateCompetitorsKeywordsMutation();

  useEffect(() => {
    if (!isGeneratingCompetitorsKeywords && isCompetitorsKeywordsGenerated) {
      setIsLoading(false);
      nextStep && nextStep();
    }

    if (
      !isGeneratingCompetitorsKeywords &&
      isCompetitorsKeywordsGenerateError
    ) {
      setIsLoading(false);
      toast({
        title:
          typeCheckError(generateCompetitorsKeywordsError) ||
          "Error Generating Competitors Keywords",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [
    isGeneratingCompetitorsKeywords,
    isCompetitorsKeywordsGenerated,
    isCompetitorsKeywordsGenerateError,
    generateCompetitorsKeywordsError,
    nextStep,
    toast,
  ]);

  useEffect(() => {
    if (contentStrategyCompetitors?.length) {
      setCompetitors(
        contentStrategyCompetitors.reduce((acc: any, competitor, index) => {
          acc[index] = competitor;
          return acc;
        }, {})
      );
    }
  }, [contentStrategyCompetitors]);

  const [
    createCompetitors,
    {
      isLoading: isCreatingCompetitors,
      error: createCompetitorsError,
      isSuccess: isCompetitorsCreated,
      isError: isCompetitorsCreateError,
    },
  ] = useCreateCompetitorsMutation();

  const [
    updateContentStrategy,
    {
      isLoading: isUpdatingContentStrategy,
      error: updateContentStrategyError,
      isSuccess: isContentStrategyUpdated,
      isError: isContentStrategyUpdateError,
    },
  ] = useUpdateContentStrategyMutation();

  const handleCreateCompetitors = () => {
    /**
     * We make 3 requests here controlled by the useEffect
     * 1. Create the competitors
     * 2. Update the content strategy with the geography
     * 3. Generate the keywords for the competitors
     *
     * And finally we move to the next step
     */

    setIsLoading(true);

    // Filter out any competitors that don't have a name
    const filteredCompetitors = Object.values(competitors).filter(
      (competitor) => competitor.name !== ""
    );

    if (filteredCompetitors.length && contentStrategyId) {
      // Create the competitors
      createCompetitors({
        body: filteredCompetitors,
        contentStrategyId,
      });
    }
  };

  useEffect(() => {
    /**
     * Handle any success that occur when creating competitors
     */
    if (!isCreatingCompetitors && isCompetitorsCreated) {
      if (geography) {
        const targetGeography = geographies?.find(
          (geo) => geo.name.toLowerCase() === geography.toLowerCase()
        )?.id;

        if (targetGeography) {
          updateContentStrategy({
            body: {
              // Get the id of the geography
              geography: targetGeography,
            },
            id: contentStrategyId as number,
          });
        }
      }
    }

    /**
     * Handle any errors that occur when creating competitors
     */
    if (!isCreatingCompetitors && isCompetitorsCreateError) {
      setIsLoading(false);
      toast({
        title:
          typeCheckError(createCompetitorsError) ||
          "Error Creating Competitors",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isCompetitorsCreated,
    isCompetitorsCreateError,
    createCompetitorsError,
    isCreatingCompetitors,
    toast,
    nextStep,
  ]);

  useEffect(() => {
    /**
     * If the geographies have loaded, set the first one as the default
     */
    if (!isGeographiesLoading) {
      setGeography(geographies?.[0]?.name || null);
    }
  }, [isGeographiesLoading, geographies]);

  useEffect(() => {
    /**
     * If the content strategy has been updated, go to the next step
     */
    if (!isUpdatingContentStrategy && isContentStrategyUpdated) {
      generateCompetitorsKeywords({
        contentStrategyId: contentStrategyId as number,
      });
    }

    if (!isUpdatingContentStrategy && isContentStrategyUpdateError) {
      toast({
        title: typeCheckError(updateContentStrategyError) || "Error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [
    isUpdatingContentStrategy,
    isContentStrategyUpdated,
    toast,
    updateContentStrategyError,
    isContentStrategyUpdateError,
    contentStrategyId,
    generateCompetitorsKeywords,
  ]);

  return (
    <Stack spacing={12}>
      <Stack>
        <Text fontSize="xl" fontWeight="bold">
          Competitor Analysis
        </Text>
        <Text fontSize="sm" fontWeight="light" color="gray.500">
          Step {currentStep} of {totalSteps}
        </Text>
      </Stack>

      <Stack spacing={6}>
        <Text fontSize="lg" fontWeight="bold">
          Competitors
        </Text>
        <Text>Enter the URLs of your competitors in this space.</Text>
        <Stack>
          {Array.from({ length: 6 }).map((_, index) => (
            <HStack key={index}>
              <Input
                placeholder="Competitor Name"
                onChange={(e) => {
                  setCompetitors({
                    ...competitors,
                    [index]: {
                      ...competitors[index],
                      name: e.target.value,
                    },
                  });
                }}
              />
              <Input
                placeholder="Competitor URL"
                onChange={(e) => {
                  setCompetitors({
                    ...competitors,
                    [index]: {
                      ...competitors[index],
                      url: e.target.value,
                    },
                  });
                }}
              />
            </HStack>
          ))}
        </Stack>
      </Stack>

      <Stack>
        <Text fontSize="lg" fontWeight="bold">
          Geography
        </Text>
        <Text>Select the geography that you are competing in.</Text>
        <Box>
          <SemrushDatabaseMenu
            onChange={setGeography}
            itemVerboseName="Geography"
            itemVerbosePluralName="Geographies"
          />
        </Box>
      </Stack>

      <HStack>
        <Button onClick={previousStep}>Previous Step</Button>
        <Button
          onClick={handleCreateCompetitors}
          isLoading={isLoading}
          isDisabled={geography === null}
        >
          Next
        </Button>
      </HStack>
    </Stack>
  );
};
