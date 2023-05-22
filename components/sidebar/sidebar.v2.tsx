import { Box, Stack } from "@chakra-ui/react";
import { NavButton } from "components/nav";
import { TopIcon } from "./top-icon";

import { FiGrid, FiPenTool, FiPieChart, FiZap } from "react-icons/fi";

import { ROUTES } from "config/routes";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {}

export const SidebarV2: FC<Props> = () => {
  const router = useRouter();

  const SIDEBAR_ITEMS = [
    {
      label: "Home",
      isActive: router.route === ROUTES.DASHBOARD,
      icon: <FiGrid />,
      onClick: () => router.push(ROUTES.DASHBOARD),
    },
    {
      label: "Content Strategy",
      isActive: router.route === ROUTES.CONTENT_STRATEGY,
      icon: <FiPenTool />,
      onClick: () => router.push(ROUTES.CONTENT_STRATEGY),
    },
    {
      label: "Performance",
      isActive: router.route === ROUTES.PERFORMANCE,
      icon: <FiPieChart />,
      onClick: () => router.push(ROUTES.PERFORMANCE),
    },
    {
      label: "Word Seek",
      isActive: router.route === ROUTES.WORD_SEEK,
      icon: <FiZap />,
      onClick: () => router.push(ROUTES.WORD_SEEK),
    },
  ];

  return (
    <Box
      background="white"
      padding="24px"
      width="240px"
      height="100dvh"
      flexShrink="0"
      borderRight="1px solid #ECECEC"
      position="sticky"
      top="0"
      zIndex={100}
    >
      <Stack justify="center" spacing="60px">
        <TopIcon />

        <Stack spacing="16px" width="134px">
          {SIDEBAR_ITEMS.map((item) => (
            <NavButton
              key={item.label}
              label={item.label}
              icon={item.icon}
              isActive={item.isActive}
              onClick={item.onClick}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};
