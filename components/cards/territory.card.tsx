import {
  Box,
  Stack,
  Skeleton,
  Text,
  HStack,
  Divider,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiWorld } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setActiveTerritory } from "store/slices";
import { Territory } from "types";

import { AddTerritoryModal, ConfirmationModal } from "components/modals";
import {
  useDeleteTerritoryMutation,
  useListTerritoriesQuery,
} from "api/territory.api";

interface Props {}

export const TerritoryCard: React.FC<Props> = () => {
  const activeTeam = useSelector((state: RootState) => state.team?.activeTeam);
  const activeTerritory = useSelector(
    (state: RootState) => state.territory?.activeTerritory
  );
  const toast = useToast();
  const dispatch = useDispatch();
  const {
    isOpen: isConfirmationOpen,
    onClose: onConfirmationClose,
    onOpen: onConfirmationOpen,
  } = useDisclosure();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const [territoryToDelete, setTerritoryToDelete] = useState<Territory>();

  const { data, isLoading, refetch: refetchTerritories } = useListTerritoriesQuery(activeTeam?.id, {
    skip: !activeTeam,
  });
  const [
    deleteTerritory,
    {
      isLoading: isDeleting,
      error: deleteTerritoryError,
      isSuccess: isDeleteTerritorySuccess,
    },
  ] = useDeleteTerritoryMutation();

  useEffect(() => {
    /**
     * Initialise the active territory to the first territory in the list
     */
    if (!activeTerritory && data?.length) {
      dispatch(setActiveTerritory(data[0]));
    }
  }, [data, activeTerritory, dispatch]);

  useEffect(() => {
    /**
     * Handle the response from the territory deletion mutation
     */
    if (isDeleteTerritorySuccess) {
      onConfirmationClose();
      refetchTerritories();
      toast({
        title: "Territory deleted",
        status: "success",
        duration: 3000,
      });
    }

    if (deleteTerritoryError) {
      onConfirmationClose();
      toast({
        title: "Error deleting territory",
        status: "error",
        duration: 3000,
      });
    }
  }, [
    deleteTerritoryError,
    isDeleteTerritorySuccess,
    onConfirmationClose,
    toast,
    refetchTerritories,
  ]);

  const handleTerritoryClick = (terr: Territory) =>
    dispatch(setActiveTerritory(terr));

  const handleDeleteTerritory = () => {
    if (territoryToDelete) {
      deleteTerritory({
        teamId: activeTeam?.id,
        territoryId: territoryToDelete.id,
      });
      onConfirmationClose();
    }
  };

  const renderItem = (item: Territory) => (
    <HStack
      alignItems="center"
      p={6}
      borderRadius="lg"
      cursor="pointer"
      border="solid 1px"
      borderColor="purple.500"
      opacity={activeTerritory?.id === item.id ? 1 : 0.5}
      _hover={{
        opacity: 1,
      }}
      onClick={() => handleTerritoryClick(item)}
      position="relative"
    >
      <BiWorld fontSize={24} />
      <Text fontWeight="medium">{item.name}</Text>
      <Divider orientation="vertical" />
      {item.accountsCount !== undefined ? (
        <Text opacity={0.5} fontWeight="medium" fontSize="sm">{`${
          item.accountsCount
        } Active Account${item.accountsCount === 1 ? "" : "s"}`}</Text>
      ) : null}
      <Box
        position="absolute"
        onClick={(e) => {
          e.stopPropagation();
          setTerritoryToDelete(item);
          onConfirmationOpen();
        }}
        top={6}
        right={5}
      >
        <Box
          opacity={0.25}
          _hover={{
            opacity: 1,
          }}
        >
          <BsTrash color="red" />
        </Box>
      </Box>
    </HStack>
  );

  const renderAddItem = () => (
    <HStack
      cursor="pointer"
      borderRadius="md"
      border="solid 1px"
      borderColor="purple.500"
      opacity={0.5}
      alignItems="center"
      _hover={{
        opacity: 1,
      }}
      p={6}
      onClick={onToggle}
    >
      <IoMdAddCircleOutline fontSize={24} />
      <Text fontWeight="medium">Add new territory</Text>
    </HStack>
  );

  const renderSkeleton = () => (
    <Stack spacing={4}>
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
    </Stack>
  );

  if (data?.length === 0) {
    return null;
  }

  return (
    <>
      <Box
        p={6}
        boxShadow="md"
        borderRadius="lg"
        border="solid 1px lightgray"
        bgColor="white"
      >
        <Text fontWeight="bold" fontSize="lg" mb={4}>
          Territory Selection
        </Text>
        {isLoading ? (
          renderSkeleton()
        ) : (
          <Stack>
            {data?.map((d, idx) => (
              <div key={idx}>{renderItem(d)}</div>
            ))}
            {renderAddItem()}
          </Stack>
        )}
        <AddTerritoryModal isOpen={isOpen} onClose={onClose} />
      </Box>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        handleConfirm={handleDeleteTerritory}
        title="Remove Territory?"
        body="Are you sure you want to remove this territory? This will remove all accounts and opportunities."
        isLoading={isDeleting}
      />
    </>
  );
};
