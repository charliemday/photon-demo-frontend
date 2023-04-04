import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CheckoutResponse, useGetCheckoutUrlMutation } from "api/payment.api";
import { Button } from "components/button";
import { CANCEL_URL, PRICEA, SUCCESS_URL } from "config";
import { FC, useEffect, useState } from "react";
import { typeCheckError } from "utils";

import { Image } from "components/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LOGO_DIM = 16;

export const StripeRedirectModal: FC<Props> = ({ isOpen, onClose }) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const [createCheckoutUrl, { isLoading }] = useGetCheckoutUrlMutation();

  const handleCreateCheckoutUrl = () => {
    createCheckoutUrl({
      priceId: PRICEA,
      successUrl: SUCCESS_URL,
      cancelUrl: CANCEL_URL,
    })
      .unwrap()
      .then((result: CheckoutResponse) => {
        window.location.href = result.url as string;
      })
      .catch((err: unknown) => {
        const errorMessage = typeCheckError(err) || "Something went wrong";
        setApiError(errorMessage as string);
      });
  };

  useEffect(() => {
    if (isOpen) {
      handleCreateCheckoutUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isLoading) {
      setApiError(null);
    }
  }, [isLoading]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Stack p={6} alignItems="center">
            {apiError && (
              <Stack alignItems="center" spacing={6}>
                <Stack alignItems="center">
                  <Text fontSize="2xl" color="red.500">
                    ⚠️
                  </Text>
                  <Text fontWeight="semibold" color="red.500">
                    {apiError}
                  </Text>
                </Stack>
                <Button onClick={handleCreateCheckoutUrl}>Retry</Button>
              </Stack>
            )}
            {!apiError && (
              <Stack alignItems="center" spacing={12} mb={12}>
                <Box
                  h={LOGO_DIM}
                  w={LOGO_DIM}
                  position="relative"
                  overflow="hidden"
                  borderRadius="md"
                >
                  <Image
                    src="/logos/stripe.png"
                    layout="fill"
                    objectFit="contain"
                    alt="Stripe logo"
                  />
                </Box>
                <Text fontWeight="medium">
                  You will be redirected to Stripe to complete your payment.
                </Text>
                <Spinner />
              </Stack>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
