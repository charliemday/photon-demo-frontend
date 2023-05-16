import { Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import React from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {}

export const Step6: React.FC<Props> = ({ previousStep, currentStep = 0 }) => (
  <Stack spacing={12} pb={12}>
    <Stack>
      <Text fontSize="lg" fontWeight="bold">
        Content Strategy
      </Text>
    </Stack>

    <Stack alignItems="center" textAlign="center">
      <Text fontSize="2xl">⏰</Text>
      <Text fontSize="2xl" fontWeight="bold">
        {`Don't hang around`}
      </Text>
      <Text w="70%">
        This might take a while... we are scraping Google to understand all the
        questions people are asking, clustering the data and using AI to extract
        themes for your content strategy.
      </Text>
    </Stack>
    <Button onClick={previousStep}>Previous Step</Button>
  </Stack>
);
