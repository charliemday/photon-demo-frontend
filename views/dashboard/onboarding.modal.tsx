import {
  FormControl,
  FormErrorMessage,
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
  Text,
  useToast,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { FC } from "react";
import StepWizard, { StepWizardChildProps } from "react-step-wizard";

import { useCreateTeamMutation } from "api/team.api";
import { useUpdateOnboardingStepMutation } from "api/user.api";
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

const OnboardingStep1: FC<Partial<StepWizardChildProps>> = (props) => (
  <>
    <ModalHeader>Welcome to Baser 👋</ModalHeader>
    <ModalCloseButton />
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
    url: Yup.string().required("URL Required"),
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
          name: values.name,
          url: values.url,
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
    // Regex remove all https:// or http:// from the url
    const cleanUrl = `https://${formik.values.url.replace(/https?:\/\//g, "")}`;
    // Prefix the url with https://
    formik.setFieldValue("url", cleanUrl);
    await formik.handleSubmit();
  };

  return (
    <>
      <ModalHeader>Add your site ➕</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack>
          <FormControl isInvalid={!!formik.errors?.name}>
            <Input
              name="name"
              placeholder="Site Name"
              onChange={formik.handleChange}
            />
            <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formik.errors?.url}>
            <InputGroup>
              <InputLeftAddon>{`https://`}</InputLeftAddon>
              <Input
                name="url"
                placeholder="yoursite.com"
                onChange={formik.handleChange}
              />
            </InputGroup>
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent overflow="hidden">
        <StepWizard>
          <OnboardingStep1 />
          <OnboardingStep2 onCompleted={handleCompleteOnboarding} />
        </StepWizard>
      </ModalContent>
    </Modal>
  );
};
