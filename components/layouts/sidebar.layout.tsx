import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { DropdownAvatar } from "components/avatar";
import { Breadcrumb, Breadcrumbs } from "components/breadcrumbs";
import { SidebarV2 as Sidebar } from "components/sidebar";
import { ROUTES } from "config";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "types";

interface Props {
  children?: ReactNode;
  title?: string;
  headerTitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export const SidebarLayout: React.FC<Props> = ({ children, title, headerTitle, breadcrumbs }) => {
  const authToken = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    if (!authToken && router.isReady) {
      /**
       *  If the user is not logged in, redirect to the login page
       */
      router.push(ROUTES.BASE);
    }
  }, [router, authToken]);

  return (
    <>
      {headerTitle ? (
        <Head>
          <title>{headerTitle}</title>
        </Head>
      ) : null}

      <Flex dir="row" alignItems="flex-start">
        <Sidebar />

        <Flex flexGrow="1" px="4" py="12">
          <Box maxWidth="1098px" mx={8}>
            <Stack spacing="8">
              {title || breadcrumbs ? (
                <Stack spacing="4">
                  {title ? (
                    <Text fontSize="2xl" fontWeight="bold" lineHeight="1">
                      {title}
                    </Text>
                  ) : null}

                  {breadcrumbs ? (
                    <Box>
                      <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </Box>
                  ) : null}
                </Stack>
              ) : null}

              {children}
            </Stack>
          </Box>
        </Flex>
      </Flex>

      <Box position="absolute" right={5} top={5}>
        <HStack>
          <DropdownAvatar />
        </HStack>
      </Box>
    </>
  );
};
