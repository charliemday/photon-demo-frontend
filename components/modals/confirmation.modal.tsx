import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  Stack,
  Divider,
  Flex,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleConfirm: (values: any) => void;
  title?: string;
  body?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  error?: string | null;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  handleConfirm,
  error,
  isLoading,
  title = "Confirm",
  body = "Are you sure?",
  confirmButtonLabel = "Yes",
  cancelButtonLabel = "No",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody py={6}>
          <Text fontSize="sm">{body}</Text>
        </ModalBody>
        <Divider />
        <ModalFooter>
          <Flex flexDir="column" w="100%">
            <Stack direction="row">
              <Button
                onClick={handleConfirm}
                isLoading={isLoading}
                colorScheme="red"
                size="sm"
              >
                {confirmButtonLabel}
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                {cancelButtonLabel}
              </Button>
            </Stack>
            {error && (
              <Flex mt={2.5}>
                <Text color="red" fontSize="sm">
                  {error}
                </Text>
              </Flex>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
