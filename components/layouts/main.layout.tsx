import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { useUserDetailsQuery } from "api/user.api";
import { Topbar } from "components/topbar";
import { BRAND_NAME, ROUTES, TAG_LINE } from "config";
import Head from "next/head";
import { RootState } from "store";
import { AuthState } from "store/slices";

interface Props {
  children: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({ children }) => {
  const authState: AuthState = useSelector((state: RootState) => state.auth);
  const authToken = authState?.token;

  const router = useRouter();

  useUserDetailsQuery(undefined, {
    skip: !authToken,
  });

  useEffect(() => {
    /**
     * On load check if the user has a token
     */
    if (router.isReady) {
      if (!authToken) {
        router.push(ROUTES.BASE);
      }
    }
  }, [router, authToken]);

  return (
    <div>
      <Head>
        <title>
          {BRAND_NAME} | {TAG_LINE}
        </title>
      </Head>
      <Flex position="relative" bgColor="#F5F5F5" flexDir="column" w="full">
        <Topbar />
        <Box minH="100vh" w="full" px={["0%", "10%"]}>
          {children}
        </Box>
      </Flex>
    </div>
  );
};
