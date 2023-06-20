import { HStack, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { Body, Heading } from "components/text";
import { useActiveTeam } from "hooks";
import { FC } from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {
  completeWizard: () => void;
  pageCount: number;
}

export const Step3: FC<Props> = ({ completeWizard, firstStep, pageCount }) => {
  const activeTeam = useActiveTeam();
  const site = activeTeam?.gscUrl || "";

  const renderMessage = () => {
    if (!site) return "";

    if (pageCount === 0) {
      return `WordSeek is running on all pages for ${site}...we will email your results, but they will also appear in your dashboard`;
    }

    return `WordSeek is running on ${pageCount} page${
      pageCount != 1 ? "s" : ""
    } for ${site}...we will email your results, but they will also appear in your dashboard`;
  };

  return (
    <Stack spacing={6}>
      <Stack alignItems="center" textAlign="center" w="80%" m="auto" py={12} spacing={6}>
        <Text fontSize="3xl">⏰</Text>
        <Heading fontSize="3xl">{`Don't hang around`}</Heading>
        <Body fontSize="xl" w="70%">
          This might take a couple of minutes to analyse all your pages.
        </Body>
        <Body fontSize="sm">{renderMessage()}</Body>
      </Stack>

      <HStack w="full">
        <Button flex={1} onClick={firstStep}>
          Run another
        </Button>

        <Button flex={1} onClick={completeWizard}>
          Close
        </Button>
      </HStack>
    </Stack>
  );
};
