import {
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Text,
  Box,
  Stack,
  MenuDivider,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsChevronDown as ChevronDownIcon } from "react-icons/bs";
import { setActiveTeam } from "store/slices";
import { useDispatch } from "react-redux";
import { Team } from "types";
import { Image } from "components/image";
import { AiOutlineTeam } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { AddTeamModal } from "components/modals";

interface Props {
  teams: Team[];
  fixed?: boolean;
}

export const FloatingButton: React.FC<Props> = ({ teams, fixed }) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(
    teams?.[0] || null
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
      <Stack>
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
