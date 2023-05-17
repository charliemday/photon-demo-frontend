import { Modal } from "components/modals";
import { useActiveContentStrategy } from "hooks";
import { FC, useState } from "react";
import StepWizard from "react-step-wizard";
import { Step1, Step2, Step5, Step6 } from "./steps";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentStrategy: FC<Props> = ({ isOpen, onClose }) => {
  const activeContentStrategy = useActiveContentStrategy();

  const [contentStrategyId, setContentStrategyId] = useState<number | null>(
    activeContentStrategy?.id || null
  );

  const handleStep1Complete = (id: number) => setContentStrategyId(id);

  const handleCompleteWizard = () => {
    /**
     * Because we use hashes to keep track of the steps, we need to reset the hash
     */
    window.location.hash = "";
    onClose();
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
      <StepWizard isHashEnabled={true}>
        <Step1 onComplete={handleStep1Complete} />
        <Step2 contentStrategyId={contentStrategyId} />
        {/* We have Step 3 and 4 but they're not required yet */}
        <Step5 contentStrategyId={contentStrategyId} />
        <Step6 handleCompleteWizard={handleCompleteWizard} />
      </StepWizard>
    </Modal>
  );
};
