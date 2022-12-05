import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Stack,
} from "@chakra-ui/react";
import { BankingStep } from "components/onboarding-flow";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormValeus {
  name: string;
  description: string;
}

export const ConnectingBankModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="lg">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Connect to your banks</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <Text fontSize="sm">
            Connect to your bank through{" "}
            <a
              href="https://tink.com/"
              style={{
                textDecoration: "underline",
              }}
            >
              Tink
            </a>{" "}
            to automatically sync your tools.
          </Text>
          <BankingStep />
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
);
