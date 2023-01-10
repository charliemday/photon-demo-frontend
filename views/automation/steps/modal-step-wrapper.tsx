import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalStepWrapper: React.FC<Props> = ({
  isOpen,
  onClose,
  children,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="2xl">
    <ModalOverlay />
    <ModalContent p={12}>
      <ModalCloseButton />

      {children}
    </ModalContent>
  </Modal>
);
