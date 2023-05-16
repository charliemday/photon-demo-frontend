import {
  Badge,
  Box,
  Flex,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Avatar } from "components/avatar";
import { FeedbackModal } from "components/modals";
import { Sidebar } from "components/sidebar";
import { ROUTES } from "config";
import { useLogout } from "hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { FiLogOut } from "react-icons/fi";

interface Props {
  children?: React.ReactNode;
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
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onOpenFeedbackModal,
    onClose: onCloseFeedbackModal,
  } = useDisclosure();

  const SIDEBAR_ITEMS = [
    {
      label: "Word Seek",
      isActive: router.route === ROUTES.DASHBOARD,
      icon: <Text fontSize="sm">🚀</Text>,
      onClick: () => router.push(ROUTES.DASHBOARD),
      badge: (
        <Badge color="white" variant="solid">
          Beta
        </Badge>
      ),
    },
    {
      label: "FAQs",
      isActive: router.route === ROUTES.FAQS,
      onClick: () => router.push(ROUTES.FAQS),
      icon: <Text fontSize="sm">🧠</Text>,
    },
  ];

  const FOOTER_ITEMS = [
    {
      label: "Feedback",
      isActive: isFeedbackModalOpen,
      onClick: () => {
        onOpenFeedbackModal();
      },
      icon: <Text fontSize="sm">📝</Text>,
    },
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
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={onCloseFeedbackModal}
      />
      <Box position="absolute" right={5} top={5}>
        <HStack>
          <Avatar />
        </HStack>
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
