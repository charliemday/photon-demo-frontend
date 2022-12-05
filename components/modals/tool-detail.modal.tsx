import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  Stack,
  Text,
  Flex,
  Divider,
  useToast,
  useDisclosure,
  Button as ChakraButton,
} from "@chakra-ui/react";
import { format } from "date-fns";

import { Button } from "components/button";
import { Image } from "components/image";
import { UserToolList } from "api/tool.api";
import { AiOutlineBlock } from "react-icons/ai";
import { Fragment } from "react";
import { ConfirmationModal } from "components/modals";
import { useDeleteUserToolMutation, useListUserToolsQuery } from "api/tool.api";
import { capitalizeFirstLetter } from "utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userTool: UserToolList | null;
}

const IMAGE_SIZE = 100;

export const ToolDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userTool,
}) => {
  const [deleteTool, { isLoading: isDeleting }] = useDeleteUserToolMutation();
  const { refetch } = useListUserToolsQuery(undefined);

  const {
    isOpen: isConfirmationModalOpen,
    onOpen: onConfirmationModalOpen,
    onClose: onConfirmationModalClose,
  } = useDisclosure();

  const toast = useToast();

  const renderInfoLabel = (label: string, value: string | number) => (
    <HStack justifyContent="space-between">
      <Text fontSize="sm">{label}:</Text>
      <Text fontSize="sm" fontWeight="semibold">
        {value}
      </Text>
    </HStack>
  );

  if (!userTool) return null;

  const { tool, renewalDate, renewalCycle, renewalAmount, id } = userTool;

  const handleRemove = () => {
    deleteTool(id);
    onClose();
    onConfirmationModalClose();
    toast({
      title: "Tool Removed",
      description: `${tool.name} has been removed from your account`,
      status: "success",
      isClosable: true,
      duration: 5000,
    });
    refetch();
  };

  const buildInfoList = () => {
    let infoList = [];

    // Owner
    infoList.push({
      label: "Owner / Admin",
      value: "You",
    });

    // Created
    infoList.push({
      label: "Added",
      value: format(new Date(tool.created), "do MMM yyyy"),
    });

    // Renewal Date
    infoList.push({
      label: "Renewal Date",
      value: renewalDate ? format(new Date(renewalDate), "do MMM yyyy") : "-",
    });

    // Renewal Cycle
    infoList.push({
      label: "Renewal Plan",
      value: capitalizeFirstLetter(renewalCycle),
    });

    // Renewal Cost
    infoList.push({
      label: "Renewal Cost",
      value: Math.floor(renewalAmount) ? `£${renewalAmount}` : "-",
    });

    return infoList;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody pt={12} px={12}>
            <HStack spacing={12} alignItems="flex-start">
              <Flex>
                {tool.image ? (
                  <Image
                    src={tool.image}
                    width={IMAGE_SIZE}
                    height={IMAGE_SIZE}
                    alt={tool.name}
                  />
                ) : (
                  <AiOutlineBlock size={IMAGE_SIZE} />
                )}
              </Flex>
              <Stack flex={2}>
                <Text fontWeight="semibold">{tool.name}</Text>
                <Text fontSize="sm">{tool.description}</Text>
                <Divider my={6} />
                {buildInfoList().map(({ label, value }, key) => (
                  <Fragment key={key}>{renderInfoLabel(label, value)}</Fragment>
                ))}
              </Stack>
            </HStack>
          </ModalBody>

          <ModalFooter mt={6}>
            <ChakraButton
              size="sm"
              colorScheme="red"
              mr={3}
              onClick={() => {
                onClose();
                onConfirmationModalOpen();
              }}
            >
              Remove
            </ChakraButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={onConfirmationModalClose}
        handleConfirm={handleRemove}
        title="Remove Tool?"
        isLoading={isDeleting}
      />
    </>
  );
};
