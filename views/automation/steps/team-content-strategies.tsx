import {
  Button as ChakraButton,
  Divider,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  useDeleteContentStrategyMutation,
  useListContentStrategiesQuery,
} from "api/strategies.api";
import { ConfirmationModal } from "components/modals";
import { useActiveTeam } from "hooks";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeContentStrategy, setActiveContentStrategy } from "store/slices/strategy.slice";
import { ContentStrategy } from "types";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamContentStrategies: FC<Props> = (props) => {
  const activeTeam = useActiveTeam();
  const [selectedContentStrategy, setSelectedContentStrategy] = useState<ContentStrategy | null>(
    null,
  );
  const toast = useToast();
  const dispatch = useDispatch();

  const { data: contentStrategies, refetch } = useListContentStrategiesQuery(
    {
      teamId: activeTeam?.id,
    },
    {
      skip: !activeTeam?.id,
      refetchOnMountOrArgChange: true,
    },
  );
  useEffect(() => {
    if (props.isOpen) {
      refetch();
    }
  }, [props.isOpen]);

  const [
    deleteContentStrategy,
    {
      isLoading: isDeletingContentStrategy,
      isSuccess: isDeletedContentStrategy,
      isError: isDeleteContentStrategyError,
      error: deleteContentStrategyError,
    },
  ] = useDeleteContentStrategyMutation();

  const {
    isOpen: isConfirmDeleteOpen,
    onClose: onCloseConfirmDelete,
    onOpen: onOpenConfirmDelete,
  } = useDisclosure();

  useEffect(() => {
    /**
     * Handle the deletion of a content strategy
     */
    if (!isDeletingContentStrategy) {
      onCloseConfirmDelete();
      if (isDeletedContentStrategy) {
        refetch();

        toast({
          title: "Content Strategy Deleted",
          description: "Your content strategy has been deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Remove the content strategy from the store
        dispatch(removeContentStrategy(selectedContentStrategy?.id));

        // Remove the active content strategy locally
        const updatedContentStrategies = contentStrategies?.filter(
          (contentStrategy: ContentStrategy) => contentStrategy.id !== selectedContentStrategy?.id,
        );

        if (updatedContentStrategies && updatedContentStrategies?.length > 0) {
          // Set the active content strategy to the first one
          dispatch(setActiveContentStrategy(updatedContentStrategies[0]));
        } else {
          // Set the default to null
          dispatch(setActiveContentStrategy(null));
        }
      } else if (isDeleteContentStrategyError) {
        toast({
          title: "Error",
          description:
            typeCheckError(deleteContentStrategyError) || "Unable to delete content strategy",
          duration: 5000,
          status: "error",
          isClosable: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDeletedContentStrategy,
    isDeleteContentStrategyError,
    deleteContentStrategyError,
    isDeletingContentStrategy,
  ]);

  const renderRow = (strategy: ContentStrategy) => {
    const name = strategy.name;
    const status = strategy.status;
    const seedKeywordCount = strategy.seedKeywordCount;
    const blogCount = strategy.blogCount;

    const statusColor =
      status === "Active"
        ? "green.500"
        : status === "Failure"
        ? "red.500"
        : status === "In Progress"
        ? "yellow.500"
        : "gray.500";

    return (
      <HStack
        justifyContent="space-between"
        p={2}
        borderRadius="md"
        _hover={{
          backgroundColor: "gray.50",
        }}
        position="relative"
      >
        <Text flex={1}>{name}</Text>
        <Text flex={1}>{seedKeywordCount}</Text>
        <Text flex={1}>{blogCount}</Text>
        <Text flex={1} color={statusColor} fontWeight="semibold">
          {status}
        </Text>
        <ChakraButton
          onClick={() => {
            setSelectedContentStrategy(strategy);
            onOpenConfirmDelete();
          }}
          size="sm"
          colorScheme="red"
          variant="outline"
          position="absolute"
          right={0}
        >
          Delete
        </ChakraButton>
      </HStack>
    );
  };

  return (
    <>
      <ModalStepWrapper {...props} size="4xl">
        <HStack p={2}>
          <Text fontWeight="bold" flex={1}>
            Content Strategy Name
          </Text>
          <Text color="gray.500" fontSize="sm" flex={1}>
            # Blogs
          </Text>
          <Text color="gray.500" fontSize="sm" flex={1}>
            # Seed Keywords
          </Text>
          <Text color="gray.500" fontSize="sm" flex={1}>
            Status
          </Text>
        </HStack>
        <Divider my={2} />
        <Stack>{contentStrategies?.map((strategy) => renderRow(strategy))}</Stack>
      </ModalStepWrapper>
      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        onClose={onCloseConfirmDelete}
        handleConfirm={() => {
          if (selectedContentStrategy?.id) {
            deleteContentStrategy({ id: selectedContentStrategy.id });
          }
        }}
        isLoading={isDeletingContentStrategy}
        title={`Delete Content Strategy "${selectedContentStrategy?.name}"?`}
      />
    </>
  );
};
