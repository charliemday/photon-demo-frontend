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
import { useLogout } from "hooks";
import { useRouter } from "next/router";
import { FC } from "react";

export const DropdownAvatar: FC = () => {
  const { data: userDetails } = useUserDetailsQuery(undefined);
  const router = useRouter();
  const { logout } = useLogout();
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure();

  const initials = `${userDetails?.firstName[0]}${userDetails?.lastName[0]}`;

  if (!userDetails) {
    return null;
  }

  const menuItems = [
    {
      label: "Settings",
      onClick: () => router.push(ROUTES.SETTINGS),
    },
    {
      label: "Feedback",
      onClick: () => onFeedbackModalOpen(),
    },
    {
      label: "Logout",
      onClick: () => logout(),
    },
  ];

  return (
    <HStack>
      <Menu>
        <MenuButton>
          <ProfileIcon initials={initials} size="base" />
        </MenuButton>
        <MenuList>
          {menuItems.map(({ label, onClick }, key) => (
            <MenuItem key={key} onClick={onClick}>
              <Text>{label}</Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={onFeedbackModalClose} />
    </HStack>
  );
};
