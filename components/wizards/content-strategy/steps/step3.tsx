import { Grid, GridItem, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { FC, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {}

export const Step3: FC<Props> = ({
  nextStep,
  currentStep = 0,
  totalSteps,
  previousStep,
}) => {
  const [targetKeywords, setTargetKeywords] = useState<{
    [key: number]: string;
  }>({
    0: "",
  });

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
        <Button onClick={nextStep}>Check for more competitors</Button>
      </HStack>
    </Stack>
  );
};
