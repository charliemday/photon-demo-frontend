import { Box, Flex, HStack, Stack } from "@chakra-ui/react";
import { DropdownAvatar } from "components/avatar";
import { Breadcrumb, Breadcrumbs } from "components/breadcrumbs";
import { TeamDropdown } from "components/dropdown";
import { SidebarV2 as Sidebar } from "components/sidebar";
import { Heading } from "components/text";
import { ROUTES } from "config";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "types";

interface Props {
  children?: ReactNode;
  title?: string;
  headerTitle?: string;
  breadcrumbs?: Breadcrumb[];
}

const MAX_MOBILE_WIDTH = 768;

export const SidebarLayout: FC<Props> = ({ children, title, headerTitle, breadcrumbs }) => {
  const authToken = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!authToken && router.isReady) {
      /**
       *  If the user is not logged in, redirect to the login page
       */
      router.push(ROUTES.BASE);
    }
  }, [router, authToken]);

  if (windowSize.width < MAX_MOBILE_WIDTH) {
    return (
      <Stack alignItems="center" justifyContent="center" py={32} spacing={6} px={8}>
        <Box>
          <IoPhonePortraitOutline fontSize={40} />
        </Box>
        <Heading textAlign="center">{`We're not yet optimised for mobile yet! For the best experience use a laptop or desktop`}</Heading>
      </Stack>
    );
  }

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
          <Box maxWidth="1098px" mx={8} w="full">
            <Stack spacing="10">
              {title || breadcrumbs ? (
                <Stack spacing="4">
                  {title ? (
                    <Heading level="h1" fontSize="2xl">
                      {title}
                    </Heading>
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
          <TeamDropdown />
          <DropdownAvatar />
        </HStack>
      </Box>
    </>
  );
};
