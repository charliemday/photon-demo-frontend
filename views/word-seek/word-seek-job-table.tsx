import { Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { useWordSeekResultsQuery } from "api/engine.api";
import { useListTeamsQuery } from "api/team.api";
import { useUserDetailsQuery } from "api/user.api";
import { Button } from "components/button";
import { WordSeekEmpty } from "components/empty";
import { Table } from "components/table";
import { HeaderItem } from "components/table/table.header";
import { Heading } from "components/text";
import { FATHOM_EVENTS } from "config";
import { useActiveTeam, useBuildJobTableData, useFathom } from "hooks";
import { FC, useEffect, useState } from "react";
import { GscConnectModal, PricingModal, WordSeekModal, WordSeekResultsModal } from "./modals";
import { OnboardingModal } from "./onboarding";

const rowHeaders: HeaderItem[] = [
  {
    text: "Job Name",
    flex: 2,
  },
  {
    text: "Job Type",
  },
  {
    text: "Pages",
  },
  {
    text: "Status",
  },
  {
    text: "User",
  },
  {
    text: "Result",
  },
];

// TODO: Place this in a constants file
const MIN_ONBOARDING_STEP = 1;

export const WordSeekJobTable: FC = () => {
  // Custom hooks
  const activeTeam = useActiveTeam();
  const fathom = useFathom();

  // Local State
  const [defaultPage, setDefaultPage] = useState<string | null>(null);
  const [selectedJobGroupUuid, setSelectedJobGroupUuid] = useState<string | null>(null);

  // RTK Queries
  const { data: userDetails } = useUserDetailsQuery();
  const { data: wordSeekResults, isLoading: isLoadingResults } = useWordSeekResultsQuery(
    {
      teamUid: activeTeam?.uid,
    },
    {
      skip: !activeTeam,
    },
  );
  const { data: teams } = useListTeamsQuery({});

  // useEffects
  useEffect(() => {
    if (
      userDetails &&
      userDetails.onboardingStep !== undefined &&
      userDetails.onboardingStep < MIN_ONBOARDING_STEP &&
      teams?.length === 0
    ) {
      onOnboardingModalToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  // Modal States
  const {
    isOpen: isWordSeekOpen,
    onClose: onWordSeekClose,
    onToggle: onWordSeekToggle,
  } = useDisclosure();
  const {
    isOpen: isWordSeekResultsOpen,
    onClose: onWordSeekResultsClose,
    onToggle: onWordSeekResultsToggle,
  } = useDisclosure();
  const {
    isOpen: isOnboardingModalOpen,
    onClose: onOnboardingModalClose,
    onToggle: onOnboardingModalToggle,
  } = useDisclosure();
  const {
    isOpen: isPricingModalOpen,
    onClose: onPricingModalClose,
    onToggle: onPricingModalToggle,
  } = useDisclosure();

  const { rowItems, isLoading } = useBuildJobTableData({
    onClick: (jobGroupUuid) => {
      setSelectedJobGroupUuid(jobGroupUuid);
      onWordSeekResultsToggle();
    },
  });

  const handleShowResults = (page: string) => {
    setDefaultPage(page);
    onWordSeekResultsToggle();
  };

  const handleStartWordSeek = () => {
    if (activeTeam) {
      onWordSeekToggle();
      fathom.trackEvent(FATHOM_EVENTS.WORD_SEEK_CLICK);
    } else {
      onOnboardingModalToggle();
    }
  };

  const renderModals = () => (
    <>
      {userDetails?.connectedSearchConsole ? (
        <WordSeekModal
          isOpen={isWordSeekOpen}
          onClose={onWordSeekClose}
          onShowResults={handleShowResults}
          onUpgrade={() => {
            onWordSeekClose();
            onPricingModalToggle();
          }}
        />
      ) : (
        <GscConnectModal isOpen={isWordSeekOpen} onClose={onWordSeekClose} />
      )}

      <WordSeekResultsModal
        isOpen={isWordSeekResultsOpen}
        onClose={onWordSeekResultsClose}
        defaultPage={defaultPage}
        jobGroupUuid={selectedJobGroupUuid}
      />
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={onOnboardingModalClose}
        onComplete={() => {
          onWordSeekToggle();
        }}
      />
      <PricingModal isOpen={isPricingModalOpen} onClose={onPricingModalClose} />
    </>
  );

  // We show the empty state if the user has no results
  const showEmptyState = (!wordSeekResults || wordSeekResults.length === 0) && !isLoading;

  if (showEmptyState) {
    return (
      <>
        <WordSeekEmpty onClick={handleStartWordSeek} />
        {renderModals()}
      </>
    );
  }

  return (
    <Stack>
      <Heading>Word Seek Jobs</Heading>
      <Flex w="full" justifyContent="flex-end">
        <Button size="sm" onClick={onWordSeekToggle} isDisabled={isLoading}>
          Run WordSeek
        </Button>
      </Flex>
      <Table
        rowItems={rowItems}
        headers={rowHeaders}
        isLoading={isLoading}
        emptyText="You have no tasks to display."
      />
      {renderModals()}
    </Stack>
  );
};
