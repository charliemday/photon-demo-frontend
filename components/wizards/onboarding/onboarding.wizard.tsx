import { useToast } from "@chakra-ui/react";
import { FC } from "react";
import StepWizard from "react-step-wizard";

import { useUpdateOnboardingStepMutation } from "api/user.api";
import { Modal } from "components/modals";
import { typeCheckError } from "utils";
import { ConnectGscStep, CreateWorkspaceStep, OnboardingStep1 } from ".";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const Onboarding: FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [updateOnboardingStep, { error }] = useUpdateOnboardingStepMutation();
  const toast = useToast();

  const handleCompleteOnboarding = async () => {
    const response = await updateOnboardingStep({
      onboardingStep: 1,
    });

    if ("error" in response) {
      toast({
        title: "Error",
        description: typeCheckError(error) || "Something went wrong",
        status: "error",
        duration: 5000,
      });
    }

    onClose();

    if (onComplete) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      contentProps={{
        overflow: "hidden",
      }}
    >
      <StepWizard>
        <OnboardingStep1 />
        <ConnectGscStep />
        <CreateWorkspaceStep onCompleted={handleCompleteOnboarding} />
      </StepWizard>
    </Modal>
  );
};
