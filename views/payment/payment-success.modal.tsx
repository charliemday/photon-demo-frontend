import { Box, HStack, ModalBody, Spinner, Stack, Text } from "@chakra-ui/react";
import { useVerifyPaymentMutation } from "api/payment.api";
import { useUserDetailsQuery } from "api/user.api";
import { Button } from "components/button";
import { Modal } from "components/modals";
import { ROUTES } from "config";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { typeCheckError } from "utils";

interface Props {}

export const PaymentSuccessModal: FC<Props> = () => {
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [showInitialLoadingState, setShowInitialLoadingState] = useState(true);

  const [verifyPayment, { isLoading, isSuccess, isError, error }] =
    useVerifyPaymentMutation();
  const { refetch: refetchUserDetails, isLoading: isLoadingUserDetails } =
    useUserDetailsQuery(undefined);

  useEffect(() => {
    // Wait 5 seconds before verifying payment
    // to give Stripe time to process the payment
    const timeout = setTimeout(() => {
      verifyPayment(undefined);
      setShowInitialLoadingState(false);
    }, 5000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      // On successful payment verification
      setIsPaymentVerified(true);
    }
  }, [isLoading, isSuccess]);

  const router = useRouter();

  const title = isPaymentVerified
    ? "Payment Successful!"
    : isError
    ? typeCheckError(error) || "Error Verifying Payment"
    : "Verifying Payment";

  return (
    <Modal isOpen onClose={() => {}} size="xl">
      <ModalBody>
        <Stack alignItems="center">
          <Text fontSize="2xl" fontWeight="bold">
            {title}
          </Text>
          <Box py={6}>
            {(isLoading || showInitialLoadingState) && <Spinner />}
            {isError && !isLoading && (
              <Text color="red.500" fontWeight="medium">
                Error Verifying Payment. Please try again.
              </Text>
            )}
            {isPaymentVerified && !isLoading && (
              <BsCheckCircle color="green" fontSize={38} />
            )}
          </Box>
          <HStack>
            <Button
              onClick={() => verifyPayment(undefined)}
              isDisabled={isLoading || isPaymentVerified}
            >
              Retry Verification
            </Button>

            <Button
              onClick={async () => {
                refetchUserDetails();
                router.push(ROUTES.DASHBOARD);
              }}
              isDisabled={isLoadingUserDetails}
              isLoading={isLoadingUserDetails}
            >
              Back to Dashboard
            </Button>
          </HStack>
        </Stack>
      </ModalBody>
    </Modal>
  );
};
