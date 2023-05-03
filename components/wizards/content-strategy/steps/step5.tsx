import { Checkbox, Divider, HStack, Stack, Tag, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { FC, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {}

// TODO: Replace with real data from API
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

export const Step5: FC<Props> = ({
  nextStep,
  currentStep = 0,
  totalSteps,
  previousStep,
}) => {
  const [targetKeywords, setTargetKeywords] = useState<{
    [key: number]: { keyword: string; volume: number };
  }>({
    0: {
      keyword: "",
      volume: 0,
    },
  });

  const [suggestedKeywords, setSuggestedKeywords] = useState<{
    [key: number]: { keyword: string; volume: number };
  }>({
    0: {
      keyword: "",
      volume: 0,
    },
  });

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
            {testData.map(({ keyword, volume }, i) => {
              return (
                <HStack key={i} justifyContent="space-between">
                  <Checkbox
                    isChecked={targetKeywords[i] ? true : false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTargetKeywords({
                          ...targetKeywords,
                          [i]: { keyword, volume },
                        });
                      } else {
                        const newTargetKeywords = { ...targetKeywords };
                        delete newTargetKeywords[i];
                        setTargetKeywords(newTargetKeywords);
                      }
                    }}
                  >
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
        <Divider />
        <Stack spacing={6}>
          <Text fontSize="lg" fontWeight="semibold">
            Suggested Competitor Keywords
          </Text>
          <Stack spacing={4}>
            {testData.map(({ keyword, volume }, i) => {
              return (
                <HStack key={i} justifyContent="space-between">
                  <Checkbox
                    isChecked={suggestedKeywords[i] ? true : false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSuggestedKeywords({
                          ...suggestedKeywords,
                          [i]: { keyword, volume },
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
                  <HStack>
                    <Text>Volume</Text>
                    <Tag>{volume}</Tag>
                  </HStack>
                </HStack>
              );
            })}
          </Stack>
        </Stack>
      </Stack>

      <HStack>
        <Button onClick={previousStep}>Previous Step</Button>
        <Button onClick={nextStep}>Generate Strategy</Button>
      </HStack>
    </Stack>
  );
};
