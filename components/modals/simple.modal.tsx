import { ModalHeader, Text } from "@chakra-ui/react";
import { FC } from "react";
import { Modal } from "./modal";

interface Props {
  heading: string;
  text: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleModal: FC<Props> = ({ heading, text, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="2xl">
    <ModalHeader>{heading}</ModalHeader>
    <Text>{text}</Text>
  </Modal>
);
