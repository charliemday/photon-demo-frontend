import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { OAUTH_URLS } from "config";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export interface FormValeus {
  name: string;
  description: string;
}

export const OAuthConnectingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack alignItems="center">
            <Spinner />
            <Text fontSize="sm">This will only take a moment</Text>
          </Stack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
