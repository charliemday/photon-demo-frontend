import { ModalBody, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { Modal } from "components/modals";
import { ROUTES } from "config";
import { useRouter } from "next/router";
import { FC } from "react";

export const PaymentCancelledModal: FC = () => {
  const router = useRouter();
  return (
    <Modal isOpen onClose={() => {}} size="xl">
      <ModalBody>
        <Stack spacing={6}>
          <Text fontSize="2xl" fontWeight="bold">
            Payment Cancelled
          </Text>
          <Text>
            You have cancelled your payment. You have not been charged. Please try again if you wish
            to continue.
          </Text>
          <Button onClick={() => router.push(ROUTES.WORD_SEEK)}>Back to Dashboard</Button>
        </Stack>
      </ModalBody>
    </Modal>
  );
};
