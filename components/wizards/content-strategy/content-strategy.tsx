import { Modal } from "components/modals";
import { FC, useState } from "react";
import StepWizard from "react-step-wizard";
import { Step1, Step2, Step5, Step6 } from "./steps";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentStrategy: FC<Props> = ({ isOpen, onClose }) => {
  const [contentStrategyId, setContentStrategyId] = useState<number | null>(
    null
  );

  const handleStep1Complete = (id: number) => setContentStrategyId(id);

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
        <Step1 onComplete={handleStep1Complete} />
        <Step2 contentStrategyId={contentStrategyId} />
        {/* TODO: Not required for barebones wizard */}
        {/* <Step3 contentStrategyId={contentStrategyId} />
        <Step4 /> */}
        <Step5 contentStrategyId={contentStrategyId} />
        <Step6 />
      </StepWizard>
    </Modal>
  );
};
