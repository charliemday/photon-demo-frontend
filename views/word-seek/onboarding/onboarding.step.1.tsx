import { Heading, ModalBody, ModalFooter, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { FC } from "react";
import { StepWizardChildProps } from "react-step-wizard";

export const OnboardingStep1: FC<Partial<StepWizardChildProps>> = (props) => (
  <>
    <ModalBody>
      <Stack w="70%" m="auto" alignItems="center" textAlign="center" py={16}>
        <Heading>👋</Heading>
        <Heading size="lg">Welcome to Baser</Heading>
        <Text>
          {`Your account has been created! Let's create a workspace to that you can run WordSeek!`}
        </Text>
      </Stack>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" onClick={props.nextStep} w="full">
        Get Started
      </Button>
    </ModalFooter>
  </>
);
