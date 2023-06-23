import { ModalBody, ModalFooter, Stack } from "@chakra-ui/react";
import { Button } from "components/button";
import { Heading, Label } from "components/text";
import { FATHOM_EVENTS } from "config";
import { useFathom } from "hooks";
import { FC } from "react";
import { StepWizardChildProps } from "react-step-wizard";

export const OnboardingStep1: FC<Partial<StepWizardChildProps>> = (props) => {
  const fathom = useFathom();

  const handleGetStarted = () => {
    fathom.trackEvent(FATHOM_EVENTS.ONBOARDING_GET_STARTED_CLICKED);
    props.nextStep?.();
  };

  return (
    <>
      <ModalBody>
        <Stack w="70%" m="auto" alignItems="center" textAlign="center" py={16}>
          <Heading fontSize="2xl">👋</Heading>
          <Heading fontSize="2xl">Welcome to WordSeek</Heading>
          <Label fontWeight="medium">
            {`Your account has been created! Let’s connect your Google Search Console and set up your first optimisation workspace.`}
          </Label>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" onClick={handleGetStarted} w="full">
          Get Started
        </Button>
      </ModalFooter>
    </>
  );
};
