import { Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { Modal } from "./modal";
import { Dropdown } from "components/dropdown";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WordSeekModal: FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="lg">
    <Stack spacing="16px">
      <Stack spacing="4px">
        <Text maxWidth="400px" fontSize="sm" fontWeight="medium">
          Top URLs
        </Text>

        <Dropdown label="https://getbaser.com" />
      </Stack>

      <Stack spacing="4px">
        <Text maxWidth="400px" fontSize="sm" fontWeight="medium">
          Select URL
        </Text>

        <Dropdown label="https://getbaser.com" />
      </Stack>
    </Stack>
  </Modal>
);
