import { Input, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import React from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {
  stepIndex: number;
  totalSteps: number;
}

export const Step1: React.FC<Props> = ({ nextStep, stepIndex, totalSteps }) => (
  <Stack spacing={12}>
    <Stack>
      <Text fontSize="xl" fontWeight="bold">
        Content Strategy
      </Text>
      <Text fontSize="sm" fontWeight="light" color="gray.500">
        Step {stepIndex + 1} of {totalSteps}
      </Text>
    </Stack>

    <Stack>
      <Text fontSize="lg" fontWeight="bold">
        Name your content strategy
      </Text>
      <Text>
        You could end up with multiple strategies for different topics. e.g. if
        you do online wish lists, you might have a strategy for Christmas or
        Birthday, with different competitors.
      </Text>
      <Input placeholder="Content Strategy Name" />
    </Stack>

    <Button onClick={nextStep}>Start Content Strategy</Button>
  </Stack>
);
