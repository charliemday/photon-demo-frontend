import { Box, Heading, HStack, Text, useToast } from "@chakra-ui/react";
import { CodeResponse, GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useCompleteOauthMutation } from "api/auth.api";
import { useUserDetailsQuery } from "api/user.api";
import { GOOGLE_INTERNAL_CLIENT_ID } from "config";
import { FC, useEffect } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { GoogleLoginButton } from "react-social-login-buttons";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";
import { Label } from "components/text";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SearchConsoleConnectModal: FC<Props> = (props) => {
  const { data: user, refetch: refetchUserDetails } = useUserDetailsQuery(undefined);
  const [completeOauth, { isLoading, isSuccess, isError, error }] = useCompleteOauthMutation();

  const toast = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        toast({
          title: "Success",
          description:
            "Connected to Google Search Console successfully. We'll start processing your data shortly.",
          status: "success",
          isClosable: true,
        });

        refetchUserDetails();
      }

      if (isError && error) {
        toast({
          title: "Error",
          description: typeCheckError(error) || "Something went wrong",
          status: "error",
          isClosable: true,
        });
      }
    }
  }, [isLoading, isSuccess, isError, toast, refetchUserDetails, error]);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope:
      "https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/drive",
    onSuccess: (response: CodeResponse) => {
      // On Success we should complete the OAuth flow by exchanging the code for an access token
      completeOauth({ code: response.code, app: "google_internal" });
    },
  });

  return (
    <ModalStepWrapper {...props}>
      <Box>
        <Heading fontSize="lg" mb={6}>
          3. Connect up your Google Search Console
        </Heading>
        <Text fontSize="xs" my={6} opacity={0.5}>
          {`This will allow Baser to access your Google Search Console data through Google's API so we can show your site metrics on your SEO hub.`}
        </Text>
        {user?.connectedSearchConsole && (
          <HStack mb={6} color="green.400">
            <BsCheckCircle />
            <Label>You are already connected to Google Search Console</Label>
          </HStack>
        )}
        <Box opacity={user?.connectedSearchConsole ? 0.5 : 1}>
          {/* @ts-ignore */}
          <GoogleLoginButton onClick={googleLogin}>
            <Label>
              {user?.connectedSearchConsole
                ? "Reconnect to Google Search Console"
                : "Connect up Google Search Console"}
            </Label>
          </GoogleLoginButton>
        </Box>
      </Box>
    </ModalStepWrapper>
  );
};

export const SearchConsoleConnect: FC<Props> = (props) => (
  <GoogleOAuthProvider clientId={GOOGLE_INTERNAL_CLIENT_ID}>
    <SearchConsoleConnectModal {...props} />
  </GoogleOAuthProvider>
);
