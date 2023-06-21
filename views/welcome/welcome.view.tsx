import { Box, Flex, HStack } from "@chakra-ui/react";
import React, { useState } from "react";

import { useLoginMutation, useSignupMutation } from "api/auth.api";
import { LoginForm, LoginFormValues } from "forms/login";
import { SignupForm, SignupFormValues } from "forms/signup";

import { WordSeekLogo } from "components/logos";
import { BRAND_COLOR, FATHOM_EVENTS } from "config";
import { useFathom } from "hooks";
import { typeCheckError } from "utils";
import { BackgroundView } from "views/background";

export const WelcomeView: React.FC = () => {
  const [authView, setAuthView] = useState<"login" | "signup">("login");

  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  const [showBackground, setShowBackground] = useState(false);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();

  const fathom = useFathom();

  const handleSignup = async (values: SignupFormValues) => {
    await signup(values)
      .unwrap()
      .then(() => {
        fathom.trackEvent(FATHOM_EVENTS.SIGNUP);
        setShowBackground(true);
      })
      .catch((e) => {
        const error = typeCheckError(e);
        setSignupError(typeof error === "string" ? error : "Unable to signup with details");
      });
  };

  const handleLogin = async (values: LoginFormValues) => {
    await login(values)
      .unwrap()
      .then(() => {
        setShowBackground(true);
      })
      .catch((e) => {
        const error = typeCheckError(e);
        setLoginError(typeof error === "string" ? error : "Unable to login with credentials");
      });
  };

  if (showBackground) {
    return <BackgroundView />;
  }

  return (
    <Flex h="100vh">
      <Box flex={1}>
        <Flex h="full" w="full" flexDir="column" alignItems="center" justifyContent="center">
          <Box w={["80%", "50%"]}>
            {authView === "login" ? (
              <LoginForm
                onLinkClick={() => setAuthView("signup")}
                handleLogin={handleLogin}
                isLoading={isLoginLoading}
                formErrorMsg={loginError}
              />
            ) : (
              <SignupForm
                onLinkClick={() => setAuthView("login")}
                handleSignup={handleSignup}
                isLoading={isSignupLoading}
                formErrorMsg={signupError}
              />
            )}
          </Box>
        </Flex>
      </Box>
      <Box flex={1} bgColor={BRAND_COLOR} display={{ base: "none", md: "block" }}>
        <HStack spacing={12} w="full" justifyContent="center" h="full">
          <Box>
            <WordSeekLogo />
          </Box>
        </HStack>
      </Box>
    </Flex>
  );
};
