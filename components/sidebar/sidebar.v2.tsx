import { Box, Stack } from "@chakra-ui/react";
import { NavButton } from "components/nav";
import { TopIcon } from "./top-icon";

import { FiGrid, FiHelpCircle, FiPenTool, FiPieChart, FiZap } from "react-icons/fi";

import { ROUTES } from "config/routes";
import { useFeatureFlag } from "hooks";
import { useRouter } from "next/router";
import { FC } from "react";
import { Features } from "types";

interface Props {}

interface SidebarItem {
  label: string;
  isActive: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  isHidden?: boolean;
}

export const SidebarV2: FC<Props> = () => {
  const router = useRouter();
  const { hasAccess } = useFeatureFlag();

  const SIDEBAR_ITEMS: SidebarItem[] = [
    {
      label: "Home",
      isActive: router.route === ROUTES.DASHBOARD,
      icon: <FiGrid />,
      onClick: () => router.push(ROUTES.DASHBOARD),
      isHidden: !hasAccess({
        features: [Features.CONTENT_STRATEGY_WIZARD],
      }),
    },
    {
      label: "Content Strategy",
      isActive: router.route === ROUTES.CONTENT_STRATEGY,
      icon: <FiPenTool />,
      onClick: () => router.push(ROUTES.CONTENT_STRATEGY),
      isHidden: !hasAccess({
        features: [Features.CONTENT_STRATEGY_WIZARD],
      }),
    },
    {
      label: "Performance",
      isActive: router.route === ROUTES.PERFORMANCE,
      icon: <FiPieChart />,
      onClick: () => router.push(ROUTES.PERFORMANCE),
      isHidden: !hasAccess({
        features: [Features.PERFORMANCE_DASHBOARD],
      }),
    },
    {
      label: "Word Seek",
      isActive: router.route === ROUTES.WORD_SEEK,
      icon: <FiZap />,
      onClick: () => router.push(ROUTES.WORD_SEEK),
    },
    {
      label: "FAQs",
      isActive: router.route === ROUTES.FAQS,
      icon: <FiHelpCircle />,
      onClick: () => router.push(ROUTES.FAQS),
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
      <Stack justify="space-between" align="flex-start" spacing="100%" height="100%" w="full">
        <Stack justify="center" align="flex-start" spacing="60px" w="full">
          <TopIcon />
          <Stack justify="flex-start" align="flex-start" spacing="16px" width="full" height="100%">
            {SIDEBAR_ITEMS.filter((s) => !s.isHidden).map((item) => (
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
      </Stack>
    </Box>
  );
};
