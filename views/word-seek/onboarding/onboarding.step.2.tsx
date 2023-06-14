import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { FC } from "react";
import { StepWizardChildProps } from "react-step-wizard";

import { useCreateTeamMutation } from "api/team.api";
import { Label } from "components/text";
import { useFormik } from "formik";
import { typeCheckError } from "utils";
import * as Yup from "yup";

interface Props extends Partial<StepWizardChildProps> {
  onCompleted?: () => void;
}

interface FormValues {
  name: string;
}

export const OnboardingStep2: FC<Props> = (props) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();

  const toast = useToast();

  const FormSchema = Yup.object().shape({
    name: Yup.string().required("Name Required"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
    },
    validationSchema: FormSchema,
    onSubmit: (values) => {
      // Create the team here
      createTeam({
        body: {
          ...values,
        },
      })
        .unwrap()
        .then(() => {
          if (props.onCompleted) {
            props.onCompleted();
          }
          if (props.nextStep) {
            props.nextStep();
          }
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: typeCheckError(err) || "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    },
  });

  const handleSubmit = async () => {
    await formik.handleSubmit();
  };

  return (
    <>
      <ModalHeader>
        Create Workspace
        <Label color="gray.400">Step 1 of 2</Label>
      </ModalHeader>
      <ModalBody py={6}>
        <Stack spacing={6}>
          <FormControl isInvalid={!!formik.errors?.name && formik.touched?.name}>
            <FormLabel>Workspace name</FormLabel>
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
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          type="submit"
          isLoading={isLoading}
          isDisabled={isLoading}
          w="full"
        >
          Create workspace
        </Button>
      </ModalFooter>
    </>
  );
};
