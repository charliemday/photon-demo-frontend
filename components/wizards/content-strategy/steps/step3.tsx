import { HStack, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import React from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {
  stepIndex: number;
  totalSteps: number;
}

export const Step3: React.FC<Props> = ({
  nextStep,
  stepIndex,
  totalSteps,
  previousStep,
}) => (
  <Stack spacing={12}>
    <Stack>
      <Text fontSize="xl" fontWeight="bold">
        Review Competitors
      </Text>
      <Text fontSize="sm" fontWeight="light" color="gray.500">
        Step {stepIndex + 1} of {totalSteps}
      </Text>
    </Stack>

    <Stack></Stack>

    <HStack>
      <Button onClick={previousStep}>Previous Step</Button>
      <Button onClick={nextStep}>Start Content Strategy</Button>
    </HStack>
  </Stack>
);
