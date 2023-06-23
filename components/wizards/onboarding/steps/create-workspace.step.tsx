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
import { FC, useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

import { useCreateTeamMutation } from "api/team.api";
import { SiteSelect } from "components/select";
import { Label } from "components/text";
import { FATHOM_EVENTS } from "config";
import { useFormik } from "formik";
import { useFathom } from "hooks";
import { typeCheckError } from "utils";
import * as Yup from "yup";

interface Props extends Partial<StepWizardChildProps> {
  onCompleted?: () => void;
}

interface FormValues {
  name: string;
}

export const CreateWorkspaceStep: FC<Props> = (props) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const fathom = useFathom();

  const toast = useToast();

  useEffect(() => {
    fathom.trackEvent(FATHOM_EVENTS.ONBOARDING_CREATE_WORKSPACE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          gscUrl: selectedSite,
        },
      })
        .unwrap()
        .then(() => {
          fathom.trackEvent(FATHOM_EVENTS.ONBOARDING_CREATED_WORKSPACE);
          if (props.onCompleted) {
            props.onCompleted();
          } else {
            props.nextStep?.();
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

  const handleSelectSite = (site: string) => {
    fathom.trackEvent(FATHOM_EVENTS.ONBOARDING_SITE_SELECTED);
    setSelectedSite(site);
  };

  const handleSubmit = async () => {
    await formik.handleSubmit();
  };

  const isDisabled = selectedSite === null || formik.values.name === "";

  if (props.isActive === false) {
    return null;
  }

  return (
    <>
      <ModalHeader>
        Create Workspace
        <Label color="gray.400">
          Step {props.currentStep} of {props.totalSteps}
        </Label>
      </ModalHeader>
      <ModalBody py={6}>
        <Stack spacing={6}>
          <FormControl>
            <FormLabel>1. Select or Search for a Search Console Site</FormLabel>
            <SiteSelect onChange={handleSelectSite} />
            <FormHelperText fontSize="xs">
              These are all the sites we have found for you.
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={!!formik.errors?.name && formik.touched?.name}>
            <FormLabel>2. Workspace name</FormLabel>
            <Input
              name="name"
              placeholder="Create a memorable workspace name"
              onChange={formik.handleChange}
            />
            <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>
            <FormHelperText fontSize="xs">
              This can be the name of your website, project, or a team
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
          isDisabled={isLoading || isDisabled}
          w="full"
        >
          Create workspace
        </Button>
      </ModalFooter>
    </>
  );
};
