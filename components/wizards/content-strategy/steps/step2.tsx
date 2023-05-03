import { Box, HStack, Text, useToast } from "@chakra-ui/react";
import { Button } from "components/button";
import React, { useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

import { Input, Stack } from "@chakra-ui/react";
import { useCreateCompetitorsMutation } from "api/strategies.api";
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
  const [competitors, setCompetitors] = useState<{
    [key: number]: CompetitorInterface;
  }>({
    0: {
      name: "",
      url: "",
    },
  });
  const toast = useToast();

  const [
    createCompetitors,
    {
      isLoading: isCreatingCompetitors,
      error: createCompetitorsError,
      isSuccess: isCompetitorsCreated,
      isError: isCompetitorsCreateError,
    },
  ] = useCreateCompetitorsMutation();

  const handleCreateCompetitors = () => {
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
    if (!isCreatingCompetitors && isCompetitorsCreated) {
      toast({
        title: "Competitors Created",
        description: "Your competitors have been created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      nextStep && nextStep();
    }

    if (!isCreatingCompetitors && isCompetitorsCreateError) {
      toast({
        title:
          typeCheckError(createCompetitorsError) ||
          "Error Creating Competitors",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [
    isCompetitorsCreated,
    isCompetitorsCreateError,
    createCompetitorsError,
    isCreatingCompetitors,
    toast,
    nextStep,
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
            onChange={(e: any) => setGeography(e.value)}
            itemVerboseName="Geography"
            itemVerbosePluralName="Geographies"
          />
        </Box>
      </Stack>

      <HStack>
        <Button onClick={previousStep}>Previous Step</Button>
        <Button onClick={handleCreateCompetitors}>Next</Button>
      </HStack>
    </Stack>
  );
};
