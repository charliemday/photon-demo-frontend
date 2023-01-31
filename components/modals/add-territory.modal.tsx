import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useCreateTerritoryMutation,
  useListTerritoriesQuery,
} from "api/engine.api";
import { useSelector } from "react-redux";
import { RootState } from "store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormValeus {
  name: string;
}

const FormSchema = Yup.object().shape({
  name: Yup.string().required("Name Required"),
});

export const AddTerritoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [createTerritory, { isLoading, isSuccess, error }] =
    useCreateTerritoryMutation();
  const activeTeam = useSelector((state: RootState) => state.team?.activeTeam);
  const toast = useToast();
  const { refetch: refetchTerritories } = useListTerritoriesQuery(
    activeTeam?.id,
    {
      skip: !activeTeam,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Territory created.",
        description: "You've created your territory.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      refetchTerritories();
      onClose();
    }
  }, [isSuccess, toast, onClose, refetchTerritories]);

  const formik = useFormik<FormValeus>({
    initialValues: {
      name: "",
    },
    validationSchema: FormSchema,
    onSubmit: (values) => {
      // Create the territory here
      if (activeTeam) {
        createTerritory({
          body: values,
          teamId: activeTeam.id,
        });
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a New Territory</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Stack spacing={6} mb={4}>
              <FormControl isInvalid={!!formik.errors?.name}>
                <FormLabel>Territory Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Insert your territory name here"
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>
              </FormControl>
            </Stack>

            {error && (
              <Flex>
                <Text textColor={"red.500"} fontSize="sm">
                  Oops, unable to create Territory
                </Text>
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Flex alignItems="center" justifyContent="flex-end">
              <Button colorScheme="purple" type="submit" isLoading={isLoading}>
                Create
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
