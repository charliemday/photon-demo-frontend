import {
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useUserDetailsQuery } from "api/user.api";
import { ProfileIcon } from "components/icons";
import { FeedbackModal } from "components/modals";
import { ROUTES } from "config";
import { useInitials, useLogout } from "hooks";
import { useRouter } from "next/router";
import { FC } from "react";
import { FiCompass, FiLogOut, FiSettings } from "react-icons/fi";

export const DropdownAvatar: FC = () => {
  const { data: userDetails } = useUserDetailsQuery(undefined);
  const router = useRouter();
  const { logout } = useLogout();
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure();

  const { initials } = useInitials();

  if (!userDetails) {
    return null;
  }

  const menuItems = [
    {
      label: "Settings",
      icon: <FiSettings />,
      onClick: () => router.push(ROUTES.SETTINGS),
    },
    {
      label: "Feedback",
      icon: <FiCompass />,
      onClick: () => onFeedbackModalOpen(),
    },
    {
      label: "Logout",
      icon: <FiLogOut />,
      onClick: () => logout(),
    },
  ];

  return (
    <HStack>
      <Menu>
        <MenuButton>
          <ProfileIcon initials={initials} size="base" />
        </MenuButton>
        <MenuList p={0} overflow="hidden">
          {menuItems.map(({ label, onClick, icon }, key) => (
            <MenuItem key={key} onClick={onClick} py={2}>
              <HStack alignItems="center">
                {icon}
                <Text fontSize="sm">{label}</Text>
              </HStack>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={onFeedbackModalClose} />
    </HStack>
  );
};
