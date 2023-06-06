import { Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { Modal } from "./modal";
import { Label } from "components/text";

interface Props {
  icon: string;
  heading: string;
  text: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PlaceholderModal: FC<Props> = ({ icon, heading, text, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="md">
    <Stack align="center" spacing="10px" textAlign="center">
      <Text fontSize="2xl" fontWeight="medium">
        {icon}
      </Text>

      <Text fontSize="2xl" fontWeight="medium">
        {heading}
      </Text>

      <Label>{text}</Label>
    </Stack>
  </Modal>
);
