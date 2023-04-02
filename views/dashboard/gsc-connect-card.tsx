import { useToast } from "@chakra-ui/react";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { useCompleteOauthMutation } from "api/auth.api";
import { useUserDetailsQuery } from "api/user.api";
import React, { useEffect } from "react";
import DashboardCard from "./dashboard-card";

interface Props {}

export const GscConnectCard: React.FC<Props> = () => {
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
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    onSuccess: (response: CodeResponse) => {
      // On Success we should complete the OAuth flow by exchanging the code for an access token
      completeOauth({ code: response.code, app: "google" });
    },
  });

  if (user?.connectedSearchConsole) {
    return (
      <DashboardCard
        title="Connected to Google Search Console"
        description="You are already connected to Google Search Console"
        buttonLabel="Reconnect"
        emoji="✅"
        onClick={googleLogin}
        isLoading={isLoading}
      />
    );
  }

  return (
    <DashboardCard
      title="Connect Google Search Console"
      description="Connect your Google Search Console account to get started"
      buttonLabel="Connect"
      emoji="🔌"
      onClick={googleLogin}
      isLoading={isLoading}
    />
  );
};
