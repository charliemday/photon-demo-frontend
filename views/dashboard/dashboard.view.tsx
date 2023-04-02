import { Grid, Stack, useDisclosure } from "@chakra-ui/react";
import { useListTeamsQuery } from "api/team.api";
import { FC, useEffect, useState } from "react";
import {
  DashboardCard,
  GscConnectModal,
  OnboardingModal,
  StripeRedirectModal,
  WordSeekModal,
  WordSeekResultsModal,
} from ".";

import { useWordSeekResultsQuery } from "api/engine.api";
import { useUserDetailsQuery } from "api/user.api";
import { FloatingButton } from "components/button";
import { useSelector } from "react-redux";
import { RootState, Team } from "types";

interface Props {}

const MIN_ONBOARDING_STEP = 1;

export const DashboardView: FC<Props> = () => {
  const { data: teams } = useListTeamsQuery(undefined);
  const { data: userDetails } = useUserDetailsQuery(undefined);
  const [defaultPage, setDefaultPage] = useState<string | null>(null);

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
    isOpen: isPaymentRedirectOpen,
    onClose: onPaymentRedirectClose,
    onToggle: onPaymentRedirectToggle,
  } = useDisclosure();
  const {
    isOpen: isOnboardingModalOpen,
    onClose: onOnboardingModalClose,
    onToggle: onOnboardingModalToggle,
  } = useDisclosure();

  useEffect(() => {
    if (
      userDetails &&
      userDetails.onboardingStep !== undefined &&
      userDetails.onboardingStep < MIN_ONBOARDING_STEP
    ) {
      onOnboardingModalToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const { data: wordSeekResults } = useWordSeekResultsQuery(activeTeam?.uid, {
    skip: !activeTeam?.uid,
  });

  const handleShowResults = (page: string) => {
    setDefaultPage(page);
    onWordSeekResultsToggle();
  };

  return (
    <Stack py={6} spacing={12}>
      {teams && <FloatingButton teams={teams} enableAddTeam />}
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <DashboardCard
          onClick={onWordSeekToggle}
          title={"WordSeek: Missing Keyword Report"}
          description="Automatically identify missing keywords based on your query data from
        Google Search Console"
          buttonLabel="Get Started"
          emoji="👀"
        />
        {/* <GscConnectCard /> */}
        {wordSeekResults && wordSeekResults.length > 0 && (
          <DashboardCard
            onClick={onWordSeekResultsToggle}
            title={"WordSeek: Results"}
            description="View the results of your WordSeek report"
            buttonLabel="View Results"
            emoji="🏁"
          />
        )}
        <DashboardCard
          onClick={onPaymentRedirectToggle}
          title={"Upgrade"}
          description="You can do one free page per month and one free team. Upgrade to get unlimited pages and unlimited teams."
          buttonLabel="Upgrade"
          emoji="💰"
        />
      </Grid>
      {userDetails?.connectedSearchConsole ? (
        <WordSeekModal
          isOpen={isWordSeekOpen}
          onClose={onWordSeekClose}
          onShowResults={handleShowResults}
        />
      ) : (
        <GscConnectModal isOpen={isWordSeekOpen} onClose={onWordSeekClose} />
      )}

      <WordSeekResultsModal
        isOpen={isWordSeekResultsOpen}
        onClose={onWordSeekResultsClose}
        defaultPage={defaultPage}
      />
      <StripeRedirectModal
        isOpen={isPaymentRedirectOpen}
        onClose={onPaymentRedirectClose}
      />
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={onOnboardingModalClose}
      />
    </Stack>
  );
};
