import {
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { BiCheck, BiChevronDown } from "react-icons/bi";
import { IoMdAddCircleOutline, IoMdExit } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

import { useListTeamsQuery } from "api/team.api";
import { useUserDetailsQuery } from "api/user.api";
import { AddTeamModal } from "components/modals";
import { useLogout } from "hooks";
import { RootState } from "store";
import { setActiveTeam } from "store/slices";
import { Team } from "types";

interface Props {}

export const ProfileCard: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const activeTeam = useSelector((state: RootState) => state.team?.activeTeam);
  const authState = useSelector((state: RootState) => state.auth);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { logout } = useLogout();

  const authToken = authState?.token;

  const { data: userData } = useUserDetailsQuery(undefined, {
    skip: !authToken,
  });
  const { data: teamsData } = useListTeamsQuery(
    {},
    {
      skip: !authToken,
    }
  );
  const fullName = `${userData?.firstName} ${userData?.lastName}`;

  const handleTeamClick = (team: Team) => dispatch(setActiveTeam(team));

  return (
    <>
      <AddTeamModal isOpen={isOpen} onClose={onClose} />
      <Menu>
        <MenuButton
          px={4}
          py={2}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          bgColor="white"
        >
          <HStack alignItems="center">
            <Avatar name={fullName} size="sm" />
            <Text fontSize="md" fontWeight="semibold">
              {fullName}
            </Text>
            <BiChevronDown fontSize={25} />
          </HStack>
        </MenuButton>
        <MenuList>
          <Text fontSize="sm" pb={2} pl={2}>
            Select Team:
          </Text>
          {teamsData?.map((team) => (
            <MenuItem key={team.id} onClick={() => handleTeamClick(team)}>
              <HStack>
                <BiCheck
                  color="green"
                  opacity={activeTeam?.id === team.id ? 1 : 0}
                />
                <Text fontWeight="medium">{team.name}</Text>
              </HStack>
            </MenuItem>
          ))}
          <MenuDivider />
          <MenuItem onClick={onOpen}>
            <HStack>
              <IoMdAddCircleOutline fontSize={24} />
              <Text fontWeight="medium">Create Team</Text>
            </HStack>
          </MenuItem>
          <MenuItem onClick={logout}>
            <HStack>
              <IoMdExit fontSize={24} />
              <Text fontWeight="medium">Logout</Text>
            </HStack>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
