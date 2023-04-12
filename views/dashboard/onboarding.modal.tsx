import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftAddon,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { FC } from "react";
import StepWizard, { StepWizardChildProps } from "react-step-wizard";

import { useCreateTeamMutation } from "api/team.api";
import { useUpdateOnboardingStepMutation } from "api/user.api";
import { Modal } from "components/modals";
import { useFormik } from "formik";
import { typeCheckError } from "utils";
import * as Yup from "yup";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  url: string;
}

interface Step2Props extends Partial<StepWizardChildProps> {
  onCompleted: () => void;
}

const urlPrefix = "https://";

const OnboardingStep1: FC<Partial<StepWizardChildProps>> = (props) => (
  <>
    <ModalHeader>Welcome to Baser 👋</ModalHeader>
    <ModalBody>
      <Text>
        {`To get started let's create a team you can run the word seek on`}
      </Text>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={props.nextStep}>
        Next
      </Button>
    </ModalFooter>
  </>
);

const OnboardingStep2: FC<Step2Props> = (props) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();

  const toast = useToast();

  const FormSchema = Yup.object().shape({
    name: Yup.string().required("Name Required"),
  });

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
          ...values,
        },
      })
        .unwrap()
        .then(() => {
          toast({
            title: "Team Created",
            description: "Your team has been created successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          props.onCompleted();
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
    console.log("URL", formik.values.url);

    if (formik.values.url) {
      // Regex remove all https:// or http:// from the url
      const cleanUrl = `https://${formik.values.url.replace(
        /https?:\/\//g,
        ""
      )}`;
      // Prefix the url with https://
      formik.setFieldValue("url", cleanUrl);
    }

    if (formik.values.url === urlPrefix) {
      formik.setFieldValue("url", "");
    }

    await formik.handleSubmit();
  };

  return (
    <>
      <ModalHeader>Add your first team ➕</ModalHeader>
      <Text ml={6} fontSize="sm" opacity={0.75}>
        A Team could be a client, customer, or even your own company.
      </Text>
      <ModalBody>
        <Stack spacing={6}>
          <FormControl
            isInvalid={!!formik.errors?.name && formik.touched?.name}
          >
            <Input
              name="name"
              placeholder="Team Name"
              onChange={formik.handleChange}
            />
            <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formik.errors?.url && formik.touched?.url}>
            <InputGroup>
              <InputLeftAddon>{urlPrefix}</InputLeftAddon>
              <Input
                name="url"
                placeholder="teamurl.com"
                onChange={formik.handleChange}
              />
            </InputGroup>
            <FormHelperText fontSize="xs">(Optional)</FormHelperText>
            <FormErrorMessage>{formik.errors?.url}</FormErrorMessage>
          </FormControl>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="blue"
          mr={3}
          onClick={props.previousStep}
          isDisabled={isLoading}
        >
          Back
        </Button>
        <Button
          colorScheme="blue"
          mr={3}
          onClick={handleSubmit}
          type="submit"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Next
        </Button>
      </ModalFooter>
    </>
  );
};

export const OnboardingModal: FC<Props> = ({ isOpen, onClose }) => {
  const [updateOnboardingStep] = useUpdateOnboardingStepMutation();
  const toast = useToast();

  const handleCompleteOnboarding = async () => {
    await updateOnboardingStep({
      onboardingStep: 1,
    })
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: typeCheckError(err) || "Something went wrong",
          status: "error",
          duration: 5000,
        });
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      size="xl"
      contentProps={{
        overflow: "hidden",
      }}
      showCloseButton={false}
    >
      <StepWizard>
        <OnboardingStep1 />
        <OnboardingStep2 onCompleted={handleCompleteOnboarding} />
      </StepWizard>
    </Modal>
  );
};
