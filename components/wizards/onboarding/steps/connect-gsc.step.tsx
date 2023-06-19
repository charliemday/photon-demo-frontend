import {
  Heading,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { CodeResponse, GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useCompleteOauthMutation } from "api/auth.api";
import { Button } from "components/button";
import { Label } from "components/text";
import { GOOGLE_EXTERNAL_CLIENT_ID, GOOGLE_EXTERNAL_SCOPES } from "config";
import { FC, useEffect } from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {
  /**
   * Optional function ot call if this is the
   * last step in the wizard
   */
  onCompleted?: () => void;
}

export const ConnectGscStepContent: FC<Props> = (props) => {
  const [completeOauth, { isLoading, isSuccess, isError, error }] = useCompleteOauthMutation();
  const toast = useToast();
  // const { refetch: refetchUserDetails } = useUserDetailsQuery(undefined);

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        toast({
          title: "Success",
          description: "Connected to Google Search Console successfully 🎉",
          status: "success",
          isClosable: true,
        });

        // refetchUserDetails();
        if (props.onCompleted) {
          props.onCompleted();
        } else {
          props.nextStep?.();
        }
      }

      if (isError) {
        toast({
          title: "Error",
          description: "Could not connect to Google Search Console",
          status: "error",
          isClosable: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSuccess, isError, toast]);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: GOOGLE_EXTERNAL_SCOPES.map((scope) => scope).join(" "),
    onSuccess: (response: CodeResponse) => {
      // On Success we should complete the OAuth flow by exchanging the code for an access token
      completeOauth({ code: response.code, app: "google_external" });
    },
  });

  return (
    <>
      <ModalHeader>
        Connect Search Console
        <Label color="gray.400">
          Step {props.currentStep} of {props.totalSteps}
        </Label>
      </ModalHeader>

      <ModalBody py={12}>
        <Stack alignItems="center" textAlign="center" w="75%" m="auto">
          <Heading>🤖</Heading>
          <Text fontSize="lg" fontWeight="medium">
            Baser will need to read your Search Console data to give you the fastest SEO insights
          </Text>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Stack w="full" alignItems="center" spacing={4}>
          <Button w="full" isLoading={isLoading} onClick={googleLogin}>
            Connect Search Console
          </Button>
        </Stack>
      </ModalFooter>
    </>
  );
};

export const ConnectGscStep: FC<Props> = (props) => (
  <GoogleOAuthProvider clientId={GOOGLE_EXTERNAL_CLIENT_ID}>
    <ConnectGscStepContent {...props} />
  </GoogleOAuthProvider>
);
