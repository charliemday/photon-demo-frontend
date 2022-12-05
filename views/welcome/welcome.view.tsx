import { Box, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { Image } from "components/image";
import { useRouter } from "next/router";

import { useLoginMutation, useSignupMutation } from "api/auth.api";
import { LoginForm, LoginFormValues } from "forms/login";
import { SignupForm, SignupFormValues } from "forms/signup";
import { ROUTES } from "config";

const IMAGE_RATIO = 1210 / 870;
const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = IMAGE_WIDTH * IMAGE_RATIO;

export const WelcomeView: React.FC = () => {
  const router = useRouter();

  const [authView, setAuthView] = useState<"login" | "signup">("login");

  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();

  const handleSignup = (values: SignupFormValues) => {
    signup(values)
      .unwrap()
      .then(() => {
        router.push(ROUTES.OVERVIEW);
      })
      .catch(() => setSignupError("Unable to signup with details"));
  };

  const handleLogin = async (values: LoginFormValues) => {
    setLoginError(null);
    await login(values)
      .unwrap()
      .then((res) => {
        router.push(ROUTES.OVERVIEW);
      })
      .catch(() => setLoginError("Unable to login with credentials"));
  };

  return (
    <Flex h="100vh">
      <Box flex={1}>
        <Flex
          h="full"
          w="full"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
        >
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
          <Image
            src="/welcome-image.png"
            alt="Welcome"
            height={IMAGE_HEIGHT}
            width={IMAGE_WIDTH}
          />
        </Flex>
      </Box>
    </Flex>
  );
};
