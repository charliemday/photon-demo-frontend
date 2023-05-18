import { Modal, Stack, Text } from "@chakra-ui/react";
import { ModalField } from "./modal.field";
import { FC } from "react";

interface Props {
  heading: string;
  text: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ContentStrategyModal: FC<Props> = ({
  heading = "Name your content strategy",
  text = "You could end up with multiple strategies for different topics. e.g. if you do online wish lists, you might have a strategy for Christmas or Birthday, with different competitors.",
  isOpen,
  onClose,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Stack spacing="16px">
      <Stack spacing="4px">
        <Text maxWidth="400px" fontSize="sm" fontWeight="medium">
          {heading}
        </Text>

        <Text maxWidth="400px" fontSize="xs">
          {text}
        </Text>
      </Stack>

      <ModalField label="www.climbingtapes.com" />
    </Stack>
  </Modal>
);
