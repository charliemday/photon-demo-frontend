import { Box, Flex } from "@chakra-ui/react";
import { Image } from "components/image";
import React, { useState } from "react";

import { useLoginMutation, useSignupMutation } from "api/auth.api";
import { LoginForm, LoginFormValues } from "forms/login";
import { SignupForm, SignupFormValues } from "forms/signup";

import { FATHOM_EVENTS } from "config";
import { useFathom } from "hooks";
import { typeCheckError } from "utils";
import { BackgroundView } from "views/background";

const IMAGE_RATIO = 1210 / 870;
const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = IMAGE_WIDTH * IMAGE_RATIO;

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
      <Box flex={1} bgColor="#F2F5F9" display={{ base: "none", md: "block" }}>
        <Flex alignItems="center" justifyContent="center" h="full">
          <Image src="/welcome-image.png" alt="Welcome" height={IMAGE_HEIGHT} width={IMAGE_WIDTH} />
        </Flex>
      </Box>
    </Flex>
  );
};
