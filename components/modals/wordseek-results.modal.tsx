import { Stack, Text } from "@chakra-ui/react";
import { Table } from "../table";
import { Modal } from "./modal";
import { FC } from "react";
import { Button } from "components/button";
import { SECONDARY_COLOR } from "config";
import { Body } from "components/text";

interface Props {
  missingQueries: number;
  size?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WordSeekResultsModal: FC<Props> = ({ missingQueries, size, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size={size}>
    <Stack align="center" spacing="16px">
      <Stack direction="row" justify="space-between" align="center" spacing="16px">
        <Body>🎉 {missingQueries} missing queries found for this page</Body>

        <Button bgColor={SECONDARY_COLOR} textColor="white" borderColor="black" borderWidth="1px">
          Close
        </Button>
      </Stack>

      <Table />
    </Stack>
  </Modal>
);
