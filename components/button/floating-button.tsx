import {
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Image } from "components/image";
import { AddTeamModal } from "components/modals";
import React, { useState } from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { BsChevronDown as ChevronDownIcon } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setActiveTeam } from "store/slices";
import { Team } from "types";

interface Props {
  teams: Team[];
  fixed?: boolean;
}

export const FloatingButton: React.FC<Props> = ({ teams, fixed }) => {
  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(
    activeTeam || teams?.[0] || null
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();
  const onSelect = (team: Team) => {
    setSelectedTeam(team);
    dispatch(setActiveTeam(team));
  };

  const renderButton = () => (
    <>
      <AddTeamModal isOpen={isOpen} onClose={onClose} />
      <Stack zIndex={101}>
        <Text fontWeight="semibold" fontSize="sm">
          Select a Team to Work on:
        </Text>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon color="black" />}
            size="sm"
            border="solid 1px black"
          >
            <Flex alignItems="center">
              <Box w={5} minH={5} m={2} overflow="hidden" position="relative">
                {selectedTeam?.logo ? (
                  <Image
                    src={selectedTeam.logo}
                    alt={selectedTeam.name}
                    layout="fill"
                  />
                ) : (
                  <AiOutlineTeam />
                )}
              </Box>
              <Text color="black">{selectedTeam?.name}</Text>
            </Flex>
          </MenuButton>
          <MenuList>
            <Box py={1} px={6}>
              <Text fontSize="sm">
                {teams.length
                  ? `${teams.length} team${teams.length > 1 ? "s" : ""}`
                  : `No Teams Found`}
              </Text>
            </Box>

            <MenuDivider />
            <Box maxH="30vh" overflow="auto">
              {teams?.map((team) => (
                <MenuItem key={team.id} onClick={() => onSelect(team)}>
                  <Box
                    w={5}
                    minH={5}
                    mx={4}
                    overflow="hidden"
                    position="relative"
                  >
                    {team?.logo ? (
                      <Image src={team.logo} alt={team.name} layout="fill" />
                    ) : (
                      <AiOutlineTeam />
                    )}
                  </Box>
                  <Text fontSize="sm">{team.name}</Text>
                </MenuItem>
              ))}
            </Box>
            <MenuDivider />
            <MenuItem onClick={onOpen}>
              <HStack>
                <GrAdd />
                <Text fontSize="sm">Add a Team</Text>
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>
      </Stack>
    </>
  );

  if (!teams) return null;

  if (fixed) {
    return (
      <Flex cursor="pointer" w="auto" position="fixed" right="5%" zIndex={99}>
        {renderButton()}
      </Flex>
    );
  }

  return <>{renderButton()}</>;
};
