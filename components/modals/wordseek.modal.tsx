import { Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { Modal } from "./modal";
import { Dropdown } from "components/dropdown";
import { Label } from "components/text";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WordSeekModal: FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="lg">
    <Stack spacing="16px">
      <Stack spacing="4px">
        <Label>Top URLs</Label>
        <Dropdown label="https://getbaser.com" />
      </Stack>

      <Stack spacing="4px">
        <Label>Select URL</Label>
        <Dropdown label="https://getbaser.com" />
      </Stack>
    </Stack>
  </Modal>
);
