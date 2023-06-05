import { Grid, Stack, useDisclosure } from "@chakra-ui/react";
import { ProductCard } from "components/cards/product.card";
import { useFathom } from "hooks";
import { FC, useEffect, useState } from "react";
import { GscConnectModal, PricingModal, WordSeekModal, WordSeekResultsModal } from ".";
import { OnboardingModal } from "./onboarding";

import { useWordSeekResultsQuery } from "api/engine.api";
import { useListTeamsQuery } from "api/team.api";
import { useUserDetailsQuery } from "api/user.api";
import { useGetAppSumoDetailsQuery } from "api/vendor.api";
import { FATHOM_EVENTS } from "config";
import { useHasProductAccess } from "hooks";
import { useSelector } from "react-redux";
import { RootState, Team } from "types";

interface Props {}

const MIN_ONBOARDING_STEP = 1;

export const WordSeekView: FC<Props> = () => {
  const { data: userDetails } = useUserDetailsQuery(undefined);
  const [defaultPage, setDefaultPage] = useState<string | null>(null);

  const { data: appSumoDetails } = useGetAppSumoDetailsQuery();

  const { data: teams } = useListTeamsQuery({});

  const { hasAccess: hasWordSeekAccess } = useHasProductAccess();

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

  const activeTeam: Team = useSelector((state: RootState) => state.team.activeTeam);

  const { refetch: refetchResult } = useWordSeekResultsQuery(activeTeam?.uid, {
    skip: !activeTeam?.uid,
  });

  const handleShowResults = (page: string) => {
    setDefaultPage(page);
    onWordSeekResultsToggle();
  };

  useEffect(() => {
    refetchResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fathom = useFathom();

  return (
    <Stack py={6} spacing={12}>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <ProductCard
          onClick={() => {
            if (activeTeam) {
              onWordSeekToggle();
              fathom.trackEvent(FATHOM_EVENTS.WORD_SEEK_CLICK);
            } else {
              onOnboardingModalToggle();
            }
          }}
          title={"WordSeek: Missing Keyword Report"}
          description="Automatically identify missing keywords based on your query data from
        Google Search Console"
          buttonLabel="Get Started"
          emoji="👀"
        />
        {activeTeam && (
          <ProductCard
            onClick={() => {
              onWordSeekResultsToggle();
              fathom.trackEvent(FATHOM_EVENTS.WORD_SEEK_RESULTS_OPENED);
            }}
            title={"WordSeek: Results"}
            description="View the results of your WordSeek report"
            buttonLabel="View Results"
            emoji="🏁"
          />
        )}
        {/* We don't allow AppSumo users to upgrade */}
        {!hasWordSeekAccess && !appSumoDetails && (
          <ProductCard
            onClick={() => {
              onPricingModalToggle();
              fathom.trackEvent(FATHOM_EVENTS.PAYMENT_CLICKED);
            }}
            title={"Upgrade"}
            description="You can do one free page per month and one free team. Upgrade to get unlimited pages and unlimited teams."
            buttonLabel="Upgrade"
            emoji="💰"
          />
        )}
      </Grid>
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
      />
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={onOnboardingModalClose}
        onComplete={() => {
          onWordSeekToggle();
        }}
      />
      <PricingModal isOpen={isPricingModalOpen} onClose={onPricingModalClose} />
    </Stack>
  );
};
