import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { DropdownAvatar } from "components/avatar";
import { Breadcrumb, Breadcrumbs } from "components/breadcrumbs";
import { SidebarV2 as Sidebar } from "components/sidebar";
import { Heading } from "components/text";
import Head from "next/head";
import React from "react";

interface Props {
  children?: React.ReactNode;
  title?: string;
  headerTitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export const SidebarLayout: React.FC<Props> = ({ children, title, headerTitle, breadcrumbs }) => {
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
          <DropdownAvatar />
        </HStack>
      </Box>
    </>
  );
};
