import {
  Box,
  HStack,
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
import { Image } from "components/image";
import { Modal } from "components/modals";
import { GOOGLE_EXTERNAL_CLIENT_ID } from "config";
import { FC, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GscConnect: FC<Props> = ({ isOpen, onClose }) => {
  const [completeOauth, { isLoading, isSuccess, isError }] = useCompleteOauthMutation();

  const toast = useToast();
  const { data: userDetails, refetch: refetchUserDetails } = useUserDetailsQuery(undefined);

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
      completeOauth({ code: response.code, app: "google_external" });
    },
  });

  const userIsConnected = () => (
    <>
      <ModalHeader>
        <HStack>
          <Box position="relative" h={8} w={8}>
            <Image src="/steps/search-console.svg" alt="Search Console" layout="fill" />
          </Box>
          <Text>GSC Connection</Text>
        </HStack>
      </ModalHeader>
      <ModalBody>
        <Text>You are already connected to GSC</Text>
      </ModalBody>
      <ModalFooter>
        <Button onClick={googleLogin} isLoading={isLoading}>
          Refresh Connection
        </Button>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </>
  );

  const userIsNotConnected = () => (
    <>
      <ModalHeader>
        <HStack spacing={6}>
          <Box position="relative" h={8} w={8}>
            <Image src="/steps/search-console.svg" alt="Search Console" layout="fill" />
          </Box>
          <Text>Connect your Google Search Console</Text>
        </HStack>
      </ModalHeader>
      <ModalBody>
        <Stack>
          <Text>
            Connect your Google Search Console Account so we can find the pages most important to
            you!
          </Text>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={googleLogin} isLoading={isLoading}>
          Connect with GSC
        </Button>
      </ModalFooter>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      {userDetails?.connectedSearchConsole ? userIsConnected() : userIsNotConnected()}
    </Modal>
  );
};

export const GscConnectModal: FC<Props> = (props) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_EXTERNAL_CLIENT_ID}>
      <GscConnect {...props} />
    </GoogleOAuthProvider>
  );
};
