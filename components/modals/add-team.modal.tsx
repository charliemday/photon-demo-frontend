import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
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
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useCreateTeamMutation, useListTeamsQuery } from "api/team.api";
import { Button } from "components/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormValues {
  name: string;
  url: string;
}

const FormSchema = Yup.object().shape({
  name: Yup.string().required("Name Required"),
  url: Yup.string().required("URL Required"),
});

export const AddTeamModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [createTeam, { isLoading, isSuccess, error }] = useCreateTeamMutation();
  const toast = useToast();
  const { refetch: refetchTeams } = useListTeamsQuery(undefined);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Team created.",
        description: "You've created your team.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      refetchTeams();
      onClose();
    }
  }, [isSuccess, toast, onClose, refetchTeams]);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      url: "",
    },
    validationSchema: FormSchema,
    onSubmit: (values) => {
      // Create the team here
      createTeam({
        body: {
          name: values.name,
          url: values.url,
        },
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new team</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Stack spacing={6} mb={4}>
              <FormControl isInvalid={!!formik.errors?.name}>
                <FormLabel fontSize="sm">Team Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Insert the team name here"
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors?.url}>
                <FormLabel fontSize="sm">Team URL</FormLabel>
                <Input
                  name="url"
                  placeholder="Insert their URL here"
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors?.url}</FormErrorMessage>
              </FormControl>
            </Stack>

            {error && (
              <Flex>
                <Text textColor={"red.500"} fontSize="sm">
                  Oops, unable to create Team
                </Text>
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Flex alignItems="center" justifyContent="flex-end">
              <Button size="sm" type="submit" isLoading={isLoading}>
                Create
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
