import { Box, Flex } from "@chakra-ui/react";
import { Image } from "components/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useLoginMutation, useSignupMutation } from "api/auth.api";
import { useUserDetailsQuery } from "api/user.api";
import { LoginForm, LoginFormValues } from "forms/login";
import { SignupForm, SignupFormValues } from "forms/signup";

import { ROUTES } from "config/routes";

const IMAGE_RATIO = 1210 / 870;
const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = IMAGE_WIDTH * IMAGE_RATIO;

export const WelcomeView: React.FC = () => {
  const router = useRouter();

  const [authView, setAuthView] = useState<"login" | "signup">("login");

  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  const [fetchUserDetails, setFetchUserDetails] = useState(false);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
  const {
    data: userDetails,
    isLoading: isFetchingUserDetails,
    isSuccess,
  } = useUserDetailsQuery(undefined, {
    skip: !fetchUserDetails,
  });

  useEffect(() => {
    if (isSuccess && userDetails) {
      if (userDetails.isStaff) {
        router.push(ROUTES.AUTOMATION);
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleSignup = async (values: SignupFormValues) => {
    await signup(values)
      .unwrap()
      .then(() => {
        setFetchUserDetails(true);
      })
      .catch(() => setSignupError("Unable to signup with details"));
  };

  const handleLogin = async (values: LoginFormValues) => {
    await login(values)
      .unwrap()
      .then((res) => {
        setFetchUserDetails(true);
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
                isLoading={isLoginLoading || isFetchingUserDetails}
                formErrorMsg={loginError}
              />
            ) : (
              <SignupForm
                onLinkClick={() => setAuthView("login")}
                handleSignup={handleSignup}
                isLoading={isSignupLoading || isFetchingUserDetails}
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
