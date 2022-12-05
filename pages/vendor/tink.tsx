import { MainLayout } from "components/layouts";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Spinner,
  Stack,
  useToast,
  Box,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { useRouter } from "next/router";
import { useCompleteOauthMutation } from "api/auth.api";
import {
  useListUserToolsQuery,
  usePopulateToolsFromVendorMutation,
} from "api/tool.api";
import { ONBOARDING_STEPS, ROUTES } from "config";
import { Image } from "components/image";
import {
  useUserDetailsQuery,
  useUpdateOnboardingStepMutation,
} from "api/user.api";
import { resetQueryParams } from "utils";

interface Props {}

const TINK_LOGO_RATIO = 1200 / 630;
const TINK_LOGO_WIDTH = 125;
const TINK_LOGO_HEIGHT = TINK_LOGO_WIDTH / TINK_LOGO_RATIO;

const Tink: React.FC<Props> = () => {
  const [hasErrored, setHasErrored] = useState(false);
  const [isTinkConnected, setIsTinkConnected] = useState(false);

  const router = useRouter();
  const [completeOauth] = useCompleteOauthMutation();
  const toast = useToast();
  const { isLoading, refetch } = useListUserToolsQuery(undefined);
  const [populateTools] = usePopulateToolsFromVendorMutation();
  const { refetch: fetchUserDetails } = useUserDetailsQuery(undefined);
  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();
  const { data: userDetails } = useUserDetailsQuery(undefined);

  useEffect(() => {
    const handleCompleteAuth = async (code: string) => {
      const completeOauthResponse = await completeOauth({ code, app: "tink" });

      if ("error" in completeOauthResponse) {
        toast({
          title: "Error",
          description: "Could not connect to your Bank Account",
          status: "error",
          isClosable: true,
        });
      }

      if ("data" in completeOauthResponse) {
        await populateTools({
          vendor: "tink",
        });

        // If we're currently in the onboarding flow update the onboarding
        if (
          userDetails?.onboardingStep !== undefined &&
          userDetails?.onboardingStep <= ONBOARDING_STEPS.connectBanksStep
        ) {
          await updateOnboardingStep({
            onboardingStep: ONBOARDING_STEPS.connectBanksStep + 1,
          });
        }

        // We need to refetch the user details to hide the tools
        await fetchUserDetails();

        setIsTinkConnected(true);
        refetch();
        resetQueryParams(router);
      }
    };

    if (router.isReady) {
      const { code, error } = router.query;
      if (code) {
        setHasErrored(false);
        handleCompleteAuth(code as string);
      }

      if (error) {
        setHasErrored(true);
        resetQueryParams(router);
      }
    }
  }, [router, completeOauth, toast, refetch, populateTools, fetchUserDetails]);

  const renderTinkConnected = () => (
    <Text fontSize="sm">
      You have successfully connected your Bank account. We are now populating
      your SaaS and will notify you when it is ready - this should take less
      than an hour.
    </Text>
  );

  const renderTinkNotConnected = () => {
    if (hasErrored) {
      return (
        <>
          <Text fontSize="sm" color="red">
            There was an error trying to connect to Tink.
          </Text>
        </>
      );
    }

    return (
      <>
        <Text fontSize="sm">Verifying connection with Tink</Text>
        <Spinner />
      </>
    );
  };

  return (
    <MainLayout>
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack alignItems="center" spacing={6}>
              <Box
                width={TINK_LOGO_WIDTH}
                height={TINK_LOGO_HEIGHT}
                position="relative"
                overflow="hidden"
                borderRadius="md"
              >
                <Image src="/logos/tink.png" alt="Tink Logo" layout="fill" />
              </Box>
              {isTinkConnected
                ? renderTinkConnected()
                : renderTinkNotConnected()}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(ROUTES.OVERVIEW)}
              disabled={(isLoading || !isTinkConnected) && !hasErrored}
            >
              Ok - back to overview
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
};

export default Tink;
