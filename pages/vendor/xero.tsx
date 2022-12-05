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
  Box,
  useToast,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { useRouter } from "next/router";
import { Image } from "components/image";
import { ONBOARDING_STEPS, ROUTES } from "config";
import { resetQueryParams } from "utils";
import { useCompleteOauthMutation } from "api/auth.api";
import {
  useListUserToolsQuery,
  usePopulateToolsFromVendorMutation,
} from "api/tool.api";
import {
  useUpdateOnboardingStepMutation,
  useUserDetailsQuery,
} from "api/user.api";

interface Props {}

const XERO_LOGO_WIDTH = 75;
const XERO_LOGO_HEIGHT = 75;

const XERO_SLUG = "xero";

const Xero: React.FC<Props> = () => {
  const [isXeroConnected, setIsXeroConnected] = useState(false);
  const [hasErrored, setHasErrored] = useState(false);

  const router = useRouter();
  const [completeOauth] = useCompleteOauthMutation();
  const [populateTools] = usePopulateToolsFromVendorMutation();
  const { isLoading, refetch } = useListUserToolsQuery(undefined);
  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();
  const { data: userDetails } = useUserDetailsQuery(undefined);
  const toast = useToast();

  useEffect(() => {
    const handleCompleteAuth = async (code: string) => {
      const completeOauthResponse = await completeOauth({
        code,
        app: XERO_SLUG,
      });

      if ("error" in completeOauthResponse) {
        toast({
          title: "Error",
          description: "Could not connect to your Xero Account",
          status: "error",
          isClosable: true,
        });
      }

      if ("data" in completeOauthResponse) {
        await populateTools({
          vendor: XERO_SLUG,
        });

        // If we're currently in the onboarding flow update the onboarding
        if (
          userDetails?.onboardingStep !== undefined &&
          userDetails.onboardingStep <= ONBOARDING_STEPS.connectXeroStep
        ) {
          await updateOnboardingStep({
            onboardingStep: ONBOARDING_STEPS.connectXeroStep + 1,
          });
        }

        setIsXeroConnected(true);
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
  }, [
    router,
    completeOauth,
    toast,
    populateTools,
    refetch,
    updateOnboardingStep,
  ]);

  const renderXeroConnected = () => (
    <Text fontSize="sm">
      You have successfully connected your Xero account. We are now populating
      your SaaS and will notify you when it is ready - this should take less
      than an hour.
    </Text>
  );

  const renderXeroNotConnected = () => {
    if (hasErrored) {
      return (
        <>
          <Text fontSize="sm" color="red">
            There was an error trying to connect to Xero.
          </Text>
        </>
      );
    }

    return (
      <>
        <Text fontSize="sm">Verifying connection with Xero</Text>
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
                width={XERO_LOGO_WIDTH}
                height={XERO_LOGO_HEIGHT}
                position="relative"
                overflow="hidden"
                borderRadius="md"
              >
                <Image src="/logos/xero.svg" alt="Tink Logo" layout="fill" />
              </Box>
              {isXeroConnected
                ? renderXeroConnected()
                : renderXeroNotConnected()}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(ROUTES.OVERVIEW)}
              disabled={(isLoading || !isXeroConnected) && !hasErrored}
            >
              Ok - back to overview
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
};

export default Xero;
