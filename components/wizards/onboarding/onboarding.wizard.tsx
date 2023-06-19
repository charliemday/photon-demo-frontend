import { useToast } from "@chakra-ui/react";
import { FC } from "react";
import StepWizard from "react-step-wizard";

import { useUpdateOnboardingStepMutation } from "api/user.api";
import { Modal } from "components/modals";
import { typeCheckError } from "utils";
import { ConnectGscStep, CreateWorkspaceStep, LinkSiteStep, OnboardingStep1 } from ".";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const Onboarding: FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();
  const toast = useToast();

  const handleCompleteOnboarding = async () => {
    await updateOnboardingStep({
      onboardingStep: 1,
    })
      .unwrap()
      .then(() => {
        onClose();
        onComplete?.();
      })
      .catch((err: any) => {
        toast({
          title: "Error",
          description: typeCheckError(err) || "Something went wrong",
          status: "error",
          duration: 5000,
        });
      });
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
        <CreateWorkspaceStep />
        <LinkSiteStep onCompleted={handleCompleteOnboarding} />
      </StepWizard>
    </Modal>
  );
};
