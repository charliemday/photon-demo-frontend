import { Box, Heading, Text, HStack, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useUserDetailsQuery } from "api/user.api";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { useCompleteOauthMutation } from "api/auth.api";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchConsoleConnect: React.FC<Props> = (props) => {
  const { data: user, refetch: refetchUserDetails } =
    useUserDetailsQuery(undefined);
  const [completeOauth, { isLoading, isSuccess, isError }] =
    useCompleteOauthMutation();

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

      if (isError) {
        toast({
          title: "Error",
          description: "Could not connect to Google Search Console",
          status: "error",
          isClosable: true,
        });
      }
    }
  }, [isLoading, isSuccess, isError, toast, refetchUserDetails]);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope:
      "https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/drive", // TODO: This is NOT suitable for non-admin users
    onSuccess: (response: CodeResponse) => {
      // On Success we should complete the OAuth flow by exchanging the code for an access token
      completeOauth({ code: response.code, app: "google" });
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
            <Text fontSize="sm" fontWeight="semibold">
              You are already connected to Google Search Console
            </Text>
          </HStack>
        )}
        <Box opacity={user?.connectedSearchConsole ? 0.5 : 1}>
          {/* @ts-ignore */}
          <GoogleLoginButton onClick={googleLogin}>
            <Text fontSize="sm">
              {user?.connectedSearchConsole
                ? "Reconnect to Google Search Console"
                : "Connect up Google Search Console"}
            </Text>
          </GoogleLoginButton>
        </Box>
      </Box>
    </ModalStepWrapper>
  );
};
