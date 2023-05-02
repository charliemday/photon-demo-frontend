import { Box, HStack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import React, { useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

import { Input, Stack } from "@chakra-ui/react";
import { SemrushDatabaseMenu } from "components/menus";

interface Props extends Partial<StepWizardChildProps> {
  stepIndex: number;
  totalSteps: number;
}

export const Step2: React.FC<Props> = ({
  nextStep,
  previousStep,
  stepIndex,
  totalSteps,
}) => {
  const [geography, setGeography] = useState<string | null>(null);
  return (
    <Stack spacing={12}>
      <Stack>
        <Text fontSize="xl" fontWeight="bold">
          Competitor Analysis
        </Text>
        <Text fontSize="sm" fontWeight="light" color="gray.500">
          Step {stepIndex + 1} of {totalSteps}
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
              <Input placeholder="Competitor Name" />
              <Input placeholder="Competitor URL" />
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
        <Button onClick={nextStep}>Next</Button>
      </HStack>
    </Stack>
  );
};
