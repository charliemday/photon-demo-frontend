import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCreateTeamMutation, useListTeamsQuery } from "api/team.api";
import { useUserTiersQuery } from "api/user.api";
import { Button } from "components/button";
import { Modal } from "components/modals";
import { useFormik } from "formik";
import { useFeatureFlag } from "hooks";
import { FC, useEffect, useState } from "react";
import { Features } from "types";
import { typeCheckError } from "utils";
import * as Yup from "yup";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormValues {
  name: string;
}

const FormSchema = Yup.object().shape({
  name: Yup.string().required("Name Required"),
});

export const AddWorkspaceModal: FC<Props> = ({ isOpen, onClose }) => {
  const [createTeam, { isLoading, isSuccess, error, isError }] = useCreateTeamMutation();
  const { data: teams } = useListTeamsQuery({});
  const toast = useToast();
  const { hasAccess } = useFeatureFlag();
  const [restrictedMessage, setRestrictedMessage] = useState<string | null>(null);
  const { refetch } = useUserTiersQuery();

  useEffect(() => {
    if (teams) {
      if (
        teams.length > 0 &&
        !hasAccess({
          features: [Features.WORKSPACE_TEN],
        })
      ) {
        /**
         * If the user has more than 1 team, we want to restrict them from creating more teams
         * unless they have the feature flag enabled
         */
        setRestrictedMessage("You can only create 1 team. Upgrade to create more.");
      }

      if (
        teams.length == 10 &&
        !hasAccess({
          features: [Features.WORKSPACE_UNLIMITED],
        })
      ) {
        /**
         * If the user has more than 10 teams, we want to restrict them from creating more teams
         * unless they have the feature flag enabled
         */
        setRestrictedMessage("You can create a maximum of 10 teams. Upgrade to create more.");
      }
    }
  }, [teams, hasAccess]);

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
        refetch();
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
  }, [isSuccess, toast, onClose, error, isLoading, isError, refetch]);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
    },
    validationSchema: FormSchema,
    onSubmit: (values) => {
      createTeam({
        body: {
          name: values.name,
        },
      });
    },
  });

  const renderRestrictedMessage = () => (
    <Stack alignItems="center" py={12}>
      <Text fontSize="lg">🔒</Text>
      <Text fontSize="lg" fontWeight="semibold">
        {restrictedMessage}
      </Text>
    </Stack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Create a Workspace</ModalHeader>
      {restrictedMessage ? (
        renderRestrictedMessage()
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Stack spacing={6} mb={4}>
              <FormControl isInvalid={!!formik.errors?.name}>
                <FormLabel fontSize="sm">Workspace Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Create a memorable workspace name"
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>
                <FormHelperText fontSize="xs">
                  This could be the name of your website, project, or team
                </FormHelperText>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Flex alignItems="center" justifyContent="flex-end">
              <Button type="submit" isLoading={isLoading}>
                Create Workspace
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
};
