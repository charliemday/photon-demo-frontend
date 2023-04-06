import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useCreateTeamMutation } from "api/team.api";
import { Button } from "components/button";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { typeCheckError } from "utils";
import * as Yup from "yup";

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
  const [createTeam, { isLoading, isSuccess, error, isError }] =
    useCreateTeamMutation();
  const toast = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        toast({
          title: "Team created.",
          description: "You've created your team.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      }

      if (isError && error) {
        toast({
          title: "Error creating team.",
          description: typeCheckError(error) || "Something went wrong",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [isSuccess, toast, onClose, error, isLoading, isError]);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      url: "",
    },
    validationSchema: FormSchema,
    onSubmit: (values) => {
      const url = `https://${values.url.replace(/https?:\/\//g, "")}`;
      createTeam({
        body: {
          name: values.name,
          url,
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
                  placeholder="Team Name"
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors?.url}>
                <FormLabel fontSize="sm">Team URL</FormLabel>
                <InputGroup>
                  <InputLeftAddon>{`https://`}</InputLeftAddon>
                  <Input
                    name="url"
                    placeholder="Team URL"
                    onChange={formik.handleChange}
                  />
                </InputGroup>
                <FormErrorMessage>{formik.errors?.url}</FormErrorMessage>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Flex alignItems="center" justifyContent="flex-end">
              <Button type="submit" isLoading={isLoading}>
                Create Team
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
