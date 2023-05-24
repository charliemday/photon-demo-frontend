import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { Label } from "components/text";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export interface FormValeus {
  name: string;
  description: string;
}

export const OAuthConnectingModal: React.FC<Props> = ({ isOpen, onClose, title }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack alignItems="center">
            <Spinner />
            <Label>This will only take a moment</Label>
          </Stack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
