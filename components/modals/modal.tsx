import {
  Modal as ChakraModal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import React from "react";

interface Props extends ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  contentPadding?: number | string;
  contentRadius?: number | string;
}

export const Modal: React.FC<Props> = ({
  children,
  isOpen,
  onClose,
  contentPadding = 6,
  contentRadius = "2xl",
  size = "2xl",
}) => (
  <ChakraModal isOpen={isOpen} onClose={onClose} size={size}>
    <ModalOverlay />
    <ModalContent p={contentPadding} borderRadius={contentRadius}>
      <ModalCloseButton />
      {children}
    </ModalContent>
  </ChakraModal>
);
