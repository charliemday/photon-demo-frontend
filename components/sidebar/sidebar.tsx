import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useListTeamsQuery } from "api/team.api";
import { Image } from "components/image";
import { useActiveTeam } from "hooks";
import React from "react";
import { BiCheck } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setActiveTeam } from "store/slices";
import { Team } from "types";

interface ItemInterface {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

interface Props {
  width?: string | number;
  items?: ItemInterface[];
  footerItems?: ItemInterface[];
}

const SIDEBAR_COLOR = "#FAF7F3";

const LOGO_DIM = 6;

export const Sidebar: React.FC<Props> = ({ width = "50%", items = [], footerItems = [] }) => {
  const activeTeam = useActiveTeam();
  const dispatch = useDispatch();
  const { data: teams } = useListTeamsQuery({});

  const onSelectWorkspace = (team: Team) => {
    dispatch(setActiveTeam(team));
  };

  const renderTeamMenu = () => (
    <Box>
      <Menu>
        <MenuButton pt={8} pb={4} pl={8}>
          <HStack>
            <Box position="relative" h={LOGO_DIM} w={LOGO_DIM} overflow="hidden" borderRadius="md">
              {activeTeam?.logo && (
                <Image src={activeTeam?.logo} objectFit="cover" alt="Team Logo" layout="fill" />
              )}
            </Box>
            <Text fontWeight="semibold" fontSize="lg">
              {activeTeam?.name}
            </Text>
            <FiChevronDown fontSize={24} />
          </HStack>
        </MenuButton>
        <MenuList w="full" ml={5}>
          <MenuOptionGroup title="Select a Workspace">
            {teams?.map((team, key) => (
              <MenuItem key={key} onClick={() => onSelectWorkspace(team)}>
                <HStack>
                  <Box>{activeTeam?.id === team.id && <BiCheck fontSize={24} />}</Box>

                  <Text>{team.name}</Text>
                </HStack>
              </MenuItem>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </Box>
  );

  return (
    <Flex flexDir="column" width={width} h="full" position="fixed" bgColor={SIDEBAR_COLOR}>
      {renderTeamMenu()}
      <Stack position="relative" overflow="hidden" flex={1}>
        {items?.length > 0 &&
          items.map(({ label, onClick, icon, isActive, badge }, key) => (
            <HStack
              cursor="pointer"
              _hover={{
                backgroundColor: "gray.200",
              }}
              key={key}
              px={6}
              py={2}
              onClick={onClick}
            >
              <Flex
                border={isActive ? "solid 1px black" : "none"}
                p={1}
                borderRadius="md"
                w={8}
                h={8}
                alignItems="center"
                justifyContent="center"
                bgColor={isActive ? "purple.500" : "gray.200"}
                boxShadow="xl"
              >
                {icon}
              </Flex>
              <Text fontWeight={isActive ? "bold" : "semibold"}>{label}</Text>
              {badge}
            </HStack>
          ))}
      </Stack>
      <Stack h="full" flex={1} justifyContent="flex-end" pb={12}>
        {footerItems.length > 0 &&
          footerItems.map(({ label, onClick, icon, isActive }, key) => (
            <HStack
              px={6}
              py={2}
              bottom={10}
              cursor="pointer"
              _hover={{
                backgroundColor: "gray.200",
              }}
              w="full"
              key={key}
              onClick={onClick}
            >
              <Flex
                border={isActive ? "solid 1px black" : "none"}
                p={1}
                borderRadius="md"
                w={8}
                h={8}
                alignItems="center"
                justifyContent="center"
                bgColor={isActive ? "purple.500" : "gray.200"}
                boxShadow="xl"
              >
                {icon}
              </Flex>
              <Text fontWeight={isActive ? "bold" : "semibold"}>{label}</Text>
            </HStack>
          ))}
      </Stack>
    </Flex>
  );
};
