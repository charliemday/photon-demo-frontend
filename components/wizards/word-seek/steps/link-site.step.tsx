import {
  FormControl,
  FormHelperText,
  FormLabel,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { FC, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

import { useUpdateTeamMutation } from "api/team.api";
import { SiteSelect } from "components/select";
import { Label } from "components/text";
import { useActiveTeam } from "hooks";
import { typeCheckError } from "utils";

interface Props extends Partial<StepWizardChildProps> {
  onCompleted?: () => void;
  title?: string;
}

export const LinkSiteStep: FC<Props> = (props) => {
  const { title = "Link a Google Search Console Site" } = props;

  const activeTeam = useActiveTeam();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [updateTeam, { isLoading, error }] = useUpdateTeamMutation();

  const toast = useToast();

  const handleLinkWorkspace = async () => {
    if (selectedSite) {
      const response = await updateTeam({
        teamId: activeTeam?.id!,
        body: {
          gscUrl: selectedSite,
        },
      });

      if ("error" in response) {
        toast({
          title: "Error",
          description: typeCheckError(error) || "Something went wrong",
          status: "error",
        });
      } else {
        if (props.onCompleted) {
          props.onCompleted();
        } else {
          props.nextStep?.();
        }
      }
    }
  };

  return (
    <>
      <ModalHeader>
        {title}
        <Label color="gray.400">
          {props?.currentStep && props?.currentStep > 0
            ? `Step ${props.currentStep} of ${props.totalSteps}`
            : ""}
        </Label>
      </ModalHeader>
      <ModalBody py={6}>
        <Stack spacing={6}>
          <FormControl>
            <FormLabel>Select or Search for a GSC Site</FormLabel>
            <SiteSelect onChange={setSelectedSite} />
            <FormHelperText fontSize="xs">
              Link a GSC site to your workspace. This will allow you to run WordSeek on your site.
            </FormHelperText>
          </FormControl>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="blue"
          onClick={handleLinkWorkspace}
          type="submit"
          isLoading={isLoading}
          isDisabled={!selectedSite}
          w="full"
        >
          Link Workspace
        </Button>
      </ModalFooter>
    </>
  );
};
