import {
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useListTeamsQuery } from "api/team.api";
import { AddWorkspaceModal } from "components/modals";
import { useActiveTeam } from "hooks";
import { FC } from "react";
import { BsChevronDown, BsPlusLg } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setActiveTeam } from "store/slices";
import { Team } from "types";

export const TeamDropdown: FC = () => {
  const activeTeam = useActiveTeam();
  const { data: teams } = useListTeamsQuery({});
  const { isOpen, onClose, onOpen } = useDisclosure();

  const dispatch = useDispatch();

  const handleTeamSelect = (team: Team) => {
    dispatch(setActiveTeam(team));
  };

  if (!activeTeam) return null;

  return (
    <HStack>
      <Menu>
        <MenuButton border={`solid 2px #E7E7E7`} p={1} borderRadius="md" px={3} bgColor="#F6F5FA">
          <HStack>
            <Text fontWeight="semibold">{activeTeam?.name}</Text>
            <BsChevronDown />
          </HStack>
        </MenuButton>
        <MenuList p={0} overflow="hidden">
          {teams?.map((team, key) => (
            <MenuItem
              key={key}
              py="12px"
              onClick={() => {
                handleTeamSelect(team);
              }}
              bgColor={team.id === activeTeam?.id ? "#EDF2F7" : "white"}
              _hover={{ bgColor: "#EDF2F7" }}
            >
              <HStack alignItems="center">
                <Text fontSize="sm">{team.name}</Text>
              </HStack>
            </MenuItem>
          ))}
          <MenuItem onClick={onOpen}>
            <HStack alignItems="center" py="10px">
              <BsPlusLg fontSize={12} />
              <Text fontSize="sm">Create a Workspace</Text>
            </HStack>
          </MenuItem>
        </MenuList>
      </Menu>
      <AddWorkspaceModal isOpen={isOpen} onClose={onClose} />
    </HStack>
  );
};
