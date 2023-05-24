import { Stack } from "@chakra-ui/react";
import { NavIcon } from "components/icons";
import { FC } from "react";
import { FiLogOut, FiMail, FiSettings } from "react-icons/fi";

export const MenuDropdown: FC = () => (
  <Stack
    background="white"
    width="199px"
    padding="16px"
    borderRadius="8px"
    borderColor="#ECECEC"
    borderWidth="1px"
    spacing="16px"
  >
    <NavIcon label="Contact" icon={<FiMail />} />
    <NavIcon label="Settings" icon={<FiSettings />} />
    <NavIcon label="Logout" icon={<FiLogOut />} />
  </Stack>
);