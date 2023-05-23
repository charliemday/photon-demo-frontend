import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { DropdownAvatar } from "components/avatar";
import { Breadcrumb, Breadcrumbs } from "components/breadcrumbs";
import { SidebarV2 as Sidebar } from "components/sidebar";
import Head from "next/head";
import { FC, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  title?: string;
  headerTitle?: string;
  breadcrumbs?: Breadcrumb[];
}

const SIDEBAR_WIDTH = "15%";

export const SidebarLayout: FC<Props> = ({ children, title, headerTitle, breadcrumbs }) => {
  return (
    <Flex>
      <Box position="absolute" right={5} top={5}>
        <HStack>
          <DropdownAvatar />
        </HStack>
      </Box>
      {headerTitle && (
        <Head>
          <title>{headerTitle}</title>
        </Head>
      )}
      <Sidebar />
      <Box pl={SIDEBAR_WIDTH} m={20}>
        {title && (
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            {title}
          </Text>
        )}
        {breadcrumbs && (
          <Box mb={12}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </Box>
        )}
        {children}
      </Box>
    </Flex>
  );
};
