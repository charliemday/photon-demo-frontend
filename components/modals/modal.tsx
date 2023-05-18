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
  contentProps?: Record<string, unknown>;
  showCloseButton?: boolean;
}

export const Modal: React.FC<Props> = ({
  children,
  isOpen,
  onClose,
  contentPadding = 6,
  contentRadius = "lg",
  contentProps = {},
  size = "2xl",
  showCloseButton = true,
}) => (
  <ChakraModal isOpen={isOpen} onClose={onClose} size={size}>
    <ModalOverlay />
    <ModalContent p={contentPadding} borderRadius={contentRadius} {...contentProps}>
      {showCloseButton && <ModalCloseButton zIndex="docked" />}
      {children}
    </ModalContent>
  </ChakraModal>
);
