import { Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { useWordSeekJobsQuery } from "api/engine.api";
import { useListTeamsQuery } from "api/team.api";
import { useUserDetailsQuery } from "api/user.api";
import { Button } from "components/button";
import { WordSeekEmpty } from "components/empty";
import { Table } from "components/table";
import { Heading } from "components/text";
import { Onboarding } from "components/wizards";
import { WordSeekWizard } from "components/wizards/word-seek";
import { FATHOM_EVENTS, WORD_SEEK } from "config";
import { useActiveTeam, useBuildJobTableData, useFathom, useFeatureFlag } from "hooks";
import { FC, useEffect, useState } from "react";
import { FeatureKeys } from "types";
import { GscConnectModal, PricingModal, WordSeekResultsModal } from "./modals";

// TODO: Place this in a constants file
const MIN_ONBOARDING_STEP = 1;

export const WordSeekJobTable: FC = () => {
  // Custom hooks
  const activeTeam = useActiveTeam();
  const fathom = useFathom();
  const { hasAccess } = useFeatureFlag();
  const hasWordSeekAccess = hasAccess({ features: [FeatureKeys.WORD_SEEK_PREMIUM] });

  // Local State
  const [defaultPage, setDefaultPage] = useState<string | null>(null);
  const [selectedJobGroupUuid, setSelectedJobGroupUuid] = useState<string | null>(null);

  // RTK Queries
  const { data: userDetails } = useUserDetailsQuery();
  const { data: wordSeekJobs } = useWordSeekJobsQuery(
    {
      teamId: activeTeam?.id,
    },
    {
      skip: !activeTeam?.id,
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
      onOnboardingToggle();
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
    isOpen: isOnboardingOpen,
    onClose: onOnboardingClose,
    onToggle: onOnboardingToggle,
  } = useDisclosure();
  const {
    isOpen: isPricingModalOpen,
    onClose: onPricingModalClose,
    onToggle: onPricingModalToggle,
  } = useDisclosure();

  const { rowItems, rowHeaders, isLoading } = useBuildJobTableData({
    onClick: (jobGroupUuid) => {
      setSelectedJobGroupUuid(jobGroupUuid);
      onWordSeekResultsToggle();
    },
  });

  const handleStartWordSeek = () => {
    if (activeTeam) {
      onWordSeekToggle();
      fathom.trackEvent(FATHOM_EVENTS.WORD_SEEK_CLICK);
    } else {
      onOnboardingToggle();
    }
  };

  const renderModals = () => (
    <>
      {userDetails?.connectedSearchConsole ? (
        <WordSeekWizard isOpen={isWordSeekOpen} onClose={onWordSeekClose} />
      ) : (
        <GscConnectModal isOpen={isWordSeekOpen} onClose={onWordSeekClose} />
      )}

      <WordSeekResultsModal
        isOpen={isWordSeekResultsOpen}
        onClose={onWordSeekResultsClose}
        defaultPage={defaultPage}
        jobGroupUuid={selectedJobGroupUuid}
      />
      <PricingModal isOpen={isPricingModalOpen} onClose={onPricingModalClose} />
      <Onboarding
        isOpen={isOnboardingOpen}
        onClose={onOnboardingClose}
        onComplete={() => {
          onWordSeekToggle();
        }}
      />
    </>
  );

  // We show the empty state if the user has no results
  const showEmptyState = (!wordSeekJobs || wordSeekJobs.length === 0) && !isLoading;

  return (
    <Stack>
      <Heading>{WORD_SEEK} Jobs</Heading>
      <Flex w="full" justifyContent="flex-end">
        <Button
          size="sm"
          onClick={() => {
            if (activeTeam) {
              onWordSeekToggle();
            } else {
              onOnboardingToggle();
            }
          }}
          isDisabled={isLoading}
        >
          Run WordSeek
        </Button>
        {!hasWordSeekAccess && (
          <Button size="sm" onClick={onPricingModalToggle} isDisabled={isLoading}>
            💰 Upgrade
          </Button>
        )}
      </Flex>
      {showEmptyState ? (
        <WordSeekEmpty onClick={handleStartWordSeek} />
      ) : (
        <Table
          rowItems={rowItems}
          headers={rowHeaders}
          isLoading={isLoading}
          emptyText="You have no tasks to display."
        />
      )}
      {renderModals()}
    </Stack>
  );
};
