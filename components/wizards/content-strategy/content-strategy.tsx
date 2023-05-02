import { Modal } from "components/modals";
import React from "react";
import StepWizard from "react-step-wizard";
import { Step1, Step2, Step3, Step4, Step5 } from "./steps";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_STEPS = 3;

export const ContentStrategy: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size="xl"
    contentProps={{
      overflow: "hidden",
    }}
  >
    <StepWizard>
      <Step1 stepIndex={0} totalSteps={TOTAL_STEPS} />
      <Step2 stepIndex={1} totalSteps={TOTAL_STEPS} />
      <Step3 stepIndex={2} totalSteps={TOTAL_STEPS} />
      <Step4 stepIndex={3} totalSteps={TOTAL_STEPS} />
      <Step5 stepIndex={4} totalSteps={TOTAL_STEPS} />
    </StepWizard>
  </Modal>
);
