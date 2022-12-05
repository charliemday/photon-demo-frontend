import { Flex, Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { useUserDetailsQuery } from "api/user.api";
import { RootState } from "store";
import { AuthState } from "store/slices";
import { BRAND_NAME, ROUTES, TAG_LINE } from "config";
import { Topbar } from "components/topbar";
import Head from "next/head";

interface Props {
  children: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({ children }) => {
  const authState: AuthState = useSelector((state: RootState) => state.auth);
  const activeTeam = useSelector((state: RootState) => state.team?.activeTeam);
  const authToken = authState?.token;

  const router = useRouter();
  const dispatch = useDispatch();

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
      <Flex position="relative" bgColor="#F5F5F5" flexDir="column">
        <Topbar />
        <Box minH="100vh" w="full" px={["0%", "20%"]}>
          {children}
        </Box>
      </Flex>
    </div>
  );
};
