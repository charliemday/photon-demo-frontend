import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useListTeamsQuery } from "api/team.api";
import { Image } from "components/image";
import { AddTeamModal } from "components/modals";
import { motion } from "framer-motion";
import FuseJS from "fuse.js";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { BsChevronDown as ChevronDownIcon } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setActiveTeam } from "store/slices";
import { Team, TeamType } from "types";
import { typeCheckError } from "utils";

interface Props {
  teams: Team[];
  fixed?: boolean;
  enableAddTeam?: boolean;
  showRefresh?: boolean;
  title?: string;
  teamType?: TeamType;
}

export const FloatingButton: React.FC<Props> = ({
  teams,
  fixed,
  enableAddTeam,
  showRefresh,
  title = "Select a Team",
  teamType = TeamType.INTERNAL,
}) => {
  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(
    activeTeam || teams?.[0] || null
  );

  const [searchResults, setSearchResults] = useState<Team[]>(teams || []);

  useEffect(() => {
    setSearchResults(teams);
    setSelectedTeam(activeTeam || teams?.[0] || null);
  }, [teams, activeTeam]);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();
  const onSelect = (team: Team) => {
    setSelectedTeam(team);
    dispatch(setActiveTeam(team));
  };

  const fuse = new FuseJS(teams, {
    keys: ["name"],
  });

  const handleSearch = debounce((value: string) => {
    if (value) {
      const results = fuse.search(value);
      setSearchResults(results.map((result) => result.item));
    } else {
      setSearchResults(teams);
    }
  }, 500);

  const toast = useToast();

  const { refetch, error, isError } = useListTeamsQuery({
    teamType,
  });

  useEffect(() => {
    if (error && isError) {
      toast({
        title: "Error",
        description: typeCheckError(error) || "Something went wrong",
        status: "error",
        isClosable: true,
      });
    }
  }, [error, isError, toast]);

  const renderButton = () => (
    <>
      <AddTeamModal isOpen={isOpen} onClose={onClose} />
      <HStack position="relative">
        {showRefresh && (
          <motion.div
            whileTap={{
              rotate: -180,
            }}
            style={{
              position: "absolute",
              left: -20,
              bottom: 5,
              cursor: "pointer",
            }}
            onClick={refetch}
            title="Refresh Teams"
          >
            <BiRefresh fontSize={18} />
          </motion.div>
        )}
        <Stack zIndex={101}>
          <Text fontWeight="semibold" fontSize="sm">
            {title}
          </Text>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon color="black" />}
              size="sm"
              border="solid 2px black"
            >
              <Flex alignItems="center">
                <Box
                  w={5}
                  minH={5}
                  m={2}
                  overflow="hidden"
                  position="relative"
                  borderRadius="sm"
                >
                  {selectedTeam?.logo ? (
                    <Image
                      src={selectedTeam.logo}
                      alt={selectedTeam.name}
                      layout="fill"
                      fallbackComponent={<AiOutlineTeam />}
                    />
                  ) : (
                    <AiOutlineTeam />
                  )}
                </Box>
                <Text color="black">{selectedTeam?.name}</Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <HStack px={2}>
                <Box opacity={0.5}>🔍</Box>
                <Input
                  fontSize="sm"
                  placeholder={
                    teams.length
                      ? `${teams.length} team${
                          teams.length > 1 ? "s..." : "..."
                        }`
                      : `No Teams Found`
                  }
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </HStack>

              <MenuDivider />
              <Box maxH="30vh" overflow="auto">
                {searchResults?.map((team) => (
                  <MenuItem key={team.id} onClick={() => onSelect(team)}>
                    <Box
                      w={5}
                      minH={5}
                      mx={4}
                      overflow="hidden"
                      position="relative"
                      borderRadius="sm"
                    >
                      {team?.logo ? (
                        <Image
                          src={team.logo}
                          alt={team.name}
                          layout="fill"
                          fallbackComponent={<AiOutlineTeam />}
                        />
                      ) : (
                        <AiOutlineTeam />
                      )}
                    </Box>
                    <Text fontSize="sm">{team.name}</Text>
                  </MenuItem>
                ))}
              </Box>
              {enableAddTeam && (
                <>
                  <MenuDivider />
                  <MenuItem onClick={onOpen}>
                    <HStack>
                      <GrAdd />
                      <Text fontSize="sm">Add a Team</Text>
                    </HStack>
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </Stack>
      </HStack>
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
