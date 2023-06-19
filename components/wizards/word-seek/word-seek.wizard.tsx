import { useWordSeekJobsQuery } from "api/engine.api";
import { Modal } from "components/modals";
import { useActiveTeam, useFeatureFlag, useHasProductAccess, useRunWordSeek } from "hooks";
import { FC, useMemo, useState } from "react";
import StepWizard from "react-step-wizard";
import { Features } from "types";
import { LinkSiteStep, Step1, Step2, Step3 } from "./steps";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WordSeekWizard: FC<Props> = ({ isOpen, onClose }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  const activeTeam = useActiveTeam();
  const gscUrl = activeTeam?.gscUrl;
  const { hasAccess: hasProductAccess } = useHasProductAccess();
  const { hasAccess: hasFeatureAccess } = useFeatureFlag();

  const hasAccess = useMemo(() => {
    return hasProductAccess || hasFeatureAccess({ features: [Features.WORD_SEEK_PREMIUM] });
  }, [hasProductAccess, hasFeatureAccess]);

  const { refetch: refetchJobs } = useWordSeekJobsQuery({
    teamId: activeTeam?.id,
  });

  const { runWordSeek, isLoading } = useRunWordSeek({
    site: activeTeam?.gscUrl,
  });

  const handleRunWordSeek = (pages: string[]) => {
    if (activeTeam) {
      runWordSeek(pages);
    }
  };

  const handleCompleteWizard = () => {
    /**
     * Because we use hashes to keep track of the steps, we need to reset the hash
     */
    window.location.hash = "";
    refetchJobs();
    onClose();
  };

  const renderSteps = (): JSX.Element[] => {
    const steps = [];

    if (!gscUrl) {
      steps.push(<LinkSiteStep />);
    }

    steps.push(
      <Step1
        onChangePage={(path) => setSelectedPath(path)}
        runAllPages={() => handleRunWordSeek([])}
        hasAccess={hasAccess}
        runWordSeek={runWordSeek}
        isRunningWordSeek={isLoading}
      />,
    );

    steps.push(
      <Step2
        selectedPath={selectedPath}
        onComplete={(pages: string[]) => {
          handleRunWordSeek(pages);
          setSelectedPages(pages);
        }}
        isLoading={isLoading}
      />,
    );

    steps.push(<Step3 completeWizard={handleCompleteWizard} pageCount={selectedPages.length} />);

    console.log("Steps", steps);

    return steps;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentProps={{
        overflowX: "hidden",
        overflowY: "visible",
      }}
    >
      {gscUrl ? (
        <StepWizard isHashEnabled={true}>
          <Step1
            onChangePage={(path) => setSelectedPath(path)}
            runAllPages={() => handleRunWordSeek([])}
            hasAccess={hasAccess}
            runWordSeek={runWordSeek}
            isRunningWordSeek={isLoading}
          />
          <Step2
            selectedPath={selectedPath}
            onComplete={(pages: string[]) => {
              handleRunWordSeek(pages);
              setSelectedPages(pages);
            }}
            isLoading={isLoading}
          />
          <Step3 completeWizard={handleCompleteWizard} pageCount={selectedPages.length} />
        </StepWizard>
      ) : (
        <LinkSiteStep />
      )}
    </Modal>
  );
};
