import { Stack, Text } from "@chakra-ui/react";
import { Dropdown } from "components/dropdown";
import { FC } from "react";
import { Modal } from "./modal";
import { ModalField } from "./modal.field";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentStrategyCompetitorsModal: FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="lg">
    <Stack spacing="30px">
      <Stack spacing="20px">
        <Stack spacing="7px">
          <Text fontSize="14px" fontWeight="medium">
            Competitors
          </Text>

          <Text fontSize="xs">Enter the URLs of your competitors in this space.</Text>
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
          <Text fontSize="sm" fontWeight="medium">
            Geography
          </Text>

          <Text fontSize="12px" fontWeight="regular">
            Select the geography that you are competing in.
          </Text>
        </Stack>

        <Dropdown label="Select Geography" />
      </Stack>
    </Stack>
  </Modal>
);
