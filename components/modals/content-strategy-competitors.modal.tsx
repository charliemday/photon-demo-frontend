import { Stack, Text } from "@chakra-ui/react";
import { Dropdown } from "components/dropdown";
import { FC } from "react";
import { Modal } from "./modal";
import { ModalField } from "./modal.field";
import { Body, Label } from "components/text";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentStrategyCompetitorsModal: FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="lg">
    <Stack spacing="30px">
      <Stack spacing="20px">
        <Stack spacing="7px">
          <Label>Competitors</Label>
          <Body>Enter the URLs of your competitors in this space.</Body>
        </Stack>

        <Stack spacing="10px">
          {Array.from({ length: 4 }, (_, i) => (
            <Stack direction="row" spacing="10px" key={i}>
              <ModalField label="www.climbingtapes.com" />
              <ModalField label="www.climbingtapes.com" />
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack spacing="20px">
        <Stack spacing="7px">
          <Label>Geography</Label>
          <Body>Select the geography that you are competing in.</Body>
        </Stack>

        <Dropdown label="Select Geography" />
      </Stack>
    </Stack>
  </Modal>
);
