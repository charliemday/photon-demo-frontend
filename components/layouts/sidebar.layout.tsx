import { Box, Flex, Text } from "@chakra-ui/react";
import { Avatar } from "components/avatar";
import { Sidebar } from "components/sidebar";
import { ROUTES } from "config";
import { useLogout } from "hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { FiLogOut } from "react-icons/fi";

interface Props {
  children: React.ReactNode;
  title?: string;
  headerTitle?: string;
}

const SIDEBAR_WIDTH = "15%";

export const SidebarLayout: React.FC<Props> = ({
  children,
  title,
  headerTitle,
}) => {
  const router = useRouter();
  const { logout } = useLogout();

  const SIDEBAR_ITEMS = [
    {
      label: "Word Seek",
      isActive: router.route === ROUTES.DASHBOARD,
      icon: <Text fontSize="sm">🚀</Text>,
      onClick: () => router.push(ROUTES.DASHBOARD),
    },
    // {
    //   label: "Performance",
    //   isActive: router.route === ROUTES.KEYWORDS,
    //   onClick: () => router.push(ROUTES.KEYWORDS),
    //   icon: <Text fontSize="sm">🔥</Text>,
    // },
    {
      label: "FAQs",
      isActive: router.route === ROUTES.FAQS,
      onClick: () => router.push(ROUTES.FAQS),
      icon: <Text fontSize="sm">🧠</Text>,
    },
  ];

  const FOOTER_ITEMS = [
    {
      label: "Settings",
      isActive: router.route === ROUTES.SETTINGS,
      onClick: () => router.push(ROUTES.SETTINGS),
      icon: <Text fontSize="sm">⚙️</Text>,
    },
    {
      label: "Logout",
      onClick: logout,
      icon: <FiLogOut />,
    },
  ];

  return (
    <Flex>
      <Box position="absolute" right={5} top={5}>
        <Avatar />
      </Box>
      {headerTitle && (
        <Head>
          <title>{headerTitle}</title>
        </Head>
      )}
      <Sidebar
        width={SIDEBAR_WIDTH}
        items={SIDEBAR_ITEMS}
        footerItems={FOOTER_ITEMS}
      />
      <Box pl={SIDEBAR_WIDTH} m={20}>
        {title && (
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            {title}
          </Text>
        )}
        {children}
      </Box>
    </Flex>
  );
};
