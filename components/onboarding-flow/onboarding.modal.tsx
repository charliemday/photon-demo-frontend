import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
  Box,
  Stack,
  HStack,
} from "@chakra-ui/react";
import StepWizard, { StepWizardProps } from "react-step-wizard";
import { AccountingStep } from "./accounting-step";
import {
  useUpdateOnboardingStepMutation,
  useUserDetailsQuery,
} from "api/user.api";
import { BankingStep } from "./banking-step";
import { ImMagicWand } from "react-icons/im";
import { Button } from "components/button";
import { WelcomeStep } from "./welcome-step";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface StepInterface extends StepWizardProps {
  title?: string;
  skipButton?: boolean;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { data: userDetails } = useUserDetailsQuery(undefined);
  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();

  const onboardingStep = userDetails?.onboardingStep;

  const handleCompleteOnboarding = async () => {
    if (onboardingStep !== undefined) {
      await updateOnboardingStep({
        onboardingStep: onboardingStep + 1,
      });
      onClose();
    }
  };

  const Step0 = (props: StepWizardProps) => (
    <StepWrapper {...props} title="Welcome to Baser">
      <WelcomeStep />
      <HStack pt={6} justifyContent="center">
        {/* @ts-ignore */}
        <Button size="sm" onClick={() => props.nextStep()}>
          {"Let's go!"}
        </Button>
      </HStack>
    </StepWrapper>
  );

  const Step1 = (props: StepWizardProps) => (
    <StepWrapper {...props} title="Step 1. Get your accounts set up" skipButton>
      <Text fontSize="sm" mb={6}>
        {
          "Let's start by linking up your Accounting software. Select from a list of popular providers below."
        }
      </Text>
      <AccountingStep />
    </StepWrapper>
  );

  const Step2 = (props: StepWizardProps) => (
    <StepWrapper
      {...props}
      title="Step 2. Connect your Bank Accounts"
      skipButton
    >
      <Text fontSize="sm" mb={6}>
        {`Connect up your bank accounts these so we can give you an overview of your paid tools.`}
      </Text>
      <BankingStep />
    </StepWrapper>
  );

  const Step3 = (props: StepWizardProps) => (
    <StepWrapper {...props}>
      <Stack w="full" alignItems="center" spacing={12}>
        <HStack>
          <ImMagicWand fontSize={28} />
          <Text fontSize="lg" fontWeight="semibold">
            Creating Magic
          </Text>
        </HStack>
        <Text textAlign="center" w="65%" fontSize="sm">
          {
            "We're mapping your SaaS spend so that we can automate your invoice reconciliation. This takes a little while. We will email you when it's done."
          }
        </Text>
        <Button onClick={handleCompleteOnboarding}>Ok</Button>
      </Stack>
    </StepWrapper>
  );

  const StepWrapper = (props: StepInterface) => (
    <Box>
      <Box>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalBody>{props.children}</ModalBody>
        <ModalFooter justifyContent="center">
          {props.skipButton && (
            <Text
              fontSize="xs"
              opacity={0.5}
              cursor="pointer"
              textAlign="center"
              _hover={{
                textDecoration: "underline",
              }}
              onClick={async () => {
                if (onboardingStep !== undefined) {
                  await updateOnboardingStep({
                    onboardingStep: onboardingStep + 1,
                  });
                }
                // @ts-ignore
                props.nextStep();
              }}
            >
              Skip to next step
            </Text>
          )}
        </ModalFooter>
      </Box>
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent overflow="hidden">
        <ModalCloseButton />
        <StepWizard
          initialStep={onboardingStep !== undefined ? onboardingStep + 1 : 0}
        >
          <Step0 />
          <Step1 />
          <Step2 />
          <Step3 />
        </StepWizard>
      </ModalContent>
    </Modal>
  );
};
