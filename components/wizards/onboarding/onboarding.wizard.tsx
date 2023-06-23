import { useToast } from "@chakra-ui/react";
import { FC } from "react";
import StepWizard from "react-step-wizard";

import { useUpdateOnboardingStepMutation } from "api/user.api";
import { Modal } from "components/modals";
import { FATHOM_EVENTS } from "config";
import { useFathom } from "hooks";
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
  const fathom = useFathom();

  const handleCompleteOnboarding = async () => {
    const response = await updateOnboardingStep({
      onboardingStep: 1,
    });

    fathom.trackEvent(FATHOM_EVENTS.ONBOARDING_COMPLETED);

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

  const handleClose = () => {
    onClose();
    fathom.trackEvent(FATHOM_EVENTS.ONBOARDING_MODAL_CLOSED);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
