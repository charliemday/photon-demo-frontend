import { Checkbox, HStack, Stack, Tag, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import React from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {
  stepIndex: number;
  totalSteps: number;
}

const testData = [
  {
    keyword: "christmas wish list",
    volume: 2600,
  },
  {
    keyword: "christmas wish list ideas",
    volume: 2600,
  },
  {
    keyword: "christmas wish list template",
    volume: 2600,
  },
];

export const Step4: React.FC<Props> = ({
  nextStep,
  stepIndex,
  totalSteps,
  previousStep,
}) => (
  <Stack spacing={12}>
    <Stack>
      <Text fontSize="xl" fontWeight="bold">
        Review Keywords
      </Text>
      <Text fontSize="sm" fontWeight="light" color="gray.500">
        Step {stepIndex + 1} of {totalSteps}
      </Text>
    </Stack>

    <Stack spacing={6}>
      <Text fontSize="lg" fontWeight="bold">
        Select Seed Keywords
      </Text>
      <Text>
        These keywords are the result of your competitor analysis and form the
        seeds of your content strategy. You can add your own keywords and remove
        any you do not want to target.
      </Text>

      <Stack>
        {testData.map(({ keyword, volume }, i) => {
          return (
            <HStack key={i} justifyContent="space-between">
              <Checkbox>
                <Text fontWeight="semibold">{keyword}</Text>
              </Checkbox>
              <HStack>
                <Text>Volume</Text>
                <Tag>{volume}</Tag>
              </HStack>
            </HStack>
          );
        })}
      </Stack>
    </Stack>

    <HStack>
      <Button onClick={previousStep}>Previous Step</Button>
      <Button onClick={nextStep}>Generate Strategy</Button>
    </HStack>
  </Stack>
);
