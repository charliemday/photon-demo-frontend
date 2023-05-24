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
import { useUserDetailsQuery } from "api/user.api";
import { Button } from "components/button";
import { Label } from "components/text";
import { GOOGLE_EXTERNAL_CLIENT_ID, GOOGLE_EXTERNAL_SCOPES } from "config";
import { FC, useEffect } from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {
  onCompleted?: () => void;
}

export const OnboardingStep3Content: FC<Props> = (props) => {
  const [completeOauth, { isLoading, isSuccess, isError, error }] = useCompleteOauthMutation();
  const toast = useToast();
  const { refetch: refetchUserDetails } = useUserDetailsQuery(undefined);

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        toast({
          title: "Success",
          description: "Connected to Google Search Console successfully 🎉",
          status: "success",
          isClosable: true,
        });

        refetchUserDetails();
        if (props.onCompleted) {
          props.onCompleted();
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
  }, [isLoading, isSuccess, isError, toast, refetchUserDetails]);

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
        <Label color="gray.400">Step 2 of 2</Label>
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
        <Button w="full" isLoading={isLoading} onClick={googleLogin}>
          Connect Search Console
        </Button>
      </ModalFooter>
    </>
  );
};

export const OnboardingStep3: FC<Props> = (props) => (
  <GoogleOAuthProvider clientId={GOOGLE_EXTERNAL_CLIENT_ID}>
    <OnboardingStep3Content {...props} />
  </GoogleOAuthProvider>
);
