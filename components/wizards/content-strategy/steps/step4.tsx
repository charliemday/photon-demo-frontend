import { Checkbox, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { CompetitorInterface } from "forms/competitors";
import { FC, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {}

const testData: CompetitorInterface[] = [
  {
    name: "Competitor 1",
    url: "https://www.competitor1.com",
  },
  {
    name: "Competitor 2",
    url: "https://www.competitor2.com",
  },
  {
    name: "Competitor 3",
    url: "https://www.competitor3.com",
  },
];

export const Step4: FC<Props> = ({
  nextStep,
  currentStep = 0,
  totalSteps,
  previousStep,
}) => {
  const [competitors, setCompetitors] = useState<{
    [key: number]: CompetitorInterface;
  }>({
    0: {
      name: "",
      url: "",
    },
  });

  console.log(competitors);

  return (
    <Stack spacing={12}>
      <Stack>
        <Text fontSize="xl" fontWeight="bold">
          Review Competitors
        </Text>
        <Text fontSize="sm" fontWeight="light" color="gray.500">
          Step {currentStep} of {totalSteps}
        </Text>
      </Stack>

      <Stack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          Add Competitors
        </Text>
        <Text>
          Would you like to add any of these competitors into the mix?
        </Text>
        <Stack>
          {testData.map(({ name, url }, index) => (
            <HStack key={index} spacing={4}>
              <Flex flex={1} p={2} border="solid 1px #E7E7E7" rounded="md">
                <Checkbox
                  isChecked={!!competitors[index]}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCompetitors({
                        ...competitors,
                        [index]: {
                          name,
                          url,
                        },
                      });
                    } else {
                      delete competitors[index];
                      setCompetitors({ ...competitors });
                    }
                  }}
                >
                  <Text fontWeight="semibold">{name}</Text>
                </Checkbox>
              </Flex>
              <Flex
                flex={1}
                p={2}
                border="solid 1px #E7E7E7"
                rounded="md"
                bgColor="gray.50"
              >
                <Text fontWeight="semibold">{url}</Text>
              </Flex>
            </HStack>
          ))}
        </Stack>
      </Stack>

      <HStack>
        <Button onClick={previousStep}>Previous Step</Button>
        <Button onClick={nextStep}>Check for more competitors</Button>
      </HStack>
    </Stack>
  );
};
