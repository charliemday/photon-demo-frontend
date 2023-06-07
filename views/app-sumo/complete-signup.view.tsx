import { Box, Flex, HStack, useToast } from "@chakra-ui/react";
import { useCompleteSignupMutation } from "api/auth.api";
import { AppSumoLogo, WordSeekLogo } from "components/logos";
import { BRAND_LIGHT_GRAY } from "config";
import { CompleteSignupForm, CompleteSignupFormValues } from "forms/complete-signup";
import { FC, useEffect, useState } from "react";
import { typeCheckError } from "utils";
import { BackgroundView } from "views/background";

export const CompleteSignupView: FC = () => {
  const [showBackground, setShowBackground] = useState(false);
  const [completeSignup, { isLoading, error }] = useCompleteSignupMutation();
  const [email, setEmail] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    // Get the url parameters
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    if (email) setEmail(email);
  }, []);

  const handleCompleteSignup = async (values: CompleteSignupFormValues) => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      const response = await completeSignup({
        token,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
      });

      if ("error" in response) {
        toast({
          title: typeCheckError(error) || "Could not complete signup",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      } else {
        toast({
          title: "Signup completed successfully",
          status: "success",
          isClosable: true,
          duration: 5000,
        });
        setShowBackground(true);
      }
    } else {
      toast({
        title: "Could not complete signup",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    }
  };

  if (showBackground) {
    return <BackgroundView />;
  }

  return (
    <Flex h="100vh">
      <Box flex={1}>
        <Flex h="full" w="full" flexDir="column" alignItems="center" justifyContent="center">
          <Box w={["80%", "50%"]}>
            <CompleteSignupForm
              handleSubmit={handleCompleteSignup}
              isLoading={isLoading}
              email={email}
            />
          </Box>
        </Flex>
      </Box>
      <Box flex={1} bgColor={BRAND_LIGHT_GRAY} display={{ base: "none", md: "block" }}>
        <HStack alignItems="center" justifyContent="center" h="full" spacing={12}>
          <Box>
            <WordSeekLogo />
          </Box>
          <Box>
            <AppSumoLogo />
          </Box>
        </HStack>
      </Box>
    </Flex>
  );
};
