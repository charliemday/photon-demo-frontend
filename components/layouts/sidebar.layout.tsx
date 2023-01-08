import { Flex, Box, Text } from "@chakra-ui/react";
import { Sidebar } from "components/sidebar";
import React from "react";
import { RiDashboard3Line } from "react-icons/ri";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { VscGraph } from "react-icons/vsc";
import { IoNewspaperOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { ROUTES } from "config";
import { useLogout } from "hooks";

interface Props {
  children: React.ReactNode;
  title?: string;
}

const SIDEBAR_WIDTH = "225px";

export const SidebarLayout: React.FC<Props> = ({ children, title }) => {
  const router = useRouter();
  const { logout } = useLogout();

  const SIDEBAR_ITEMS = [
    {
      label: "Dashboard",
      isActive: true,
      icon: <RiDashboard3Line />,
      onClick: () => router.push(ROUTES.DASHBOARD),
    },
    {
      label: "Keywords",
      onClick: () => router.push(ROUTES.KEYWORDS),
      icon: <IoNewspaperOutline />,
    },
    {
      label: "Report",
      onClick: () => router.push(ROUTES.REPORTS),
      icon: <VscGraph />,
    },
  ];

  const FOOTER_ITEMS = [
    {
      label: "Settings",
      onClick: () => router.push(ROUTES.DASHBOARD),
      icon: <FiSettings />,
    },
    {
      label: "Logout",
      onClick: logout,
      icon: <FiLogOut />,
    },
  ];

  return (
    <Flex>
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
