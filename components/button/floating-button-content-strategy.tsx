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
} from "@chakra-ui/react";
import { useListContentStrategiesQuery } from "api/strategies.api";
import { AddTeamModal } from "components/modals";
import FuseJS from "fuse.js";
import { useActiveContentStrategy, useActiveTeam } from "hooks";
import debounce from "lodash/debounce";
import { FC, useEffect, useState } from "react";
import { BsChevronDown as ChevronDownIcon } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setActiveContentStrategy } from "store/slices";
import { ContentStrategy } from "types";

export const FloatingButtonContentStrategy: FC = () => {
  const activeContentStrategy = useActiveContentStrategy();
  const activeTeam = useActiveTeam();

  const { data: contentStrategies, refetch } = useListContentStrategiesQuery({
    teamId: activeTeam?.id,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  const [selectedStrategy, setSelectedStrategy] =
    useState<ContentStrategy | null>(
      activeContentStrategy || contentStrategies?.[0] || null
    );
  const [searchResults, setSearchResults] = useState<ContentStrategy[]>(
    contentStrategies || []
  );

  useEffect(() => {
    contentStrategies && setSearchResults(contentStrategies);
    setSelectedStrategy(contentStrategies?.[0] || null);
  }, [contentStrategies]);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();
  const onSelect = (contentStrategy: ContentStrategy) => {
    setSelectedStrategy(contentStrategy);
    dispatch(setActiveContentStrategy(contentStrategy));
  };

  const fuse = new FuseJS(contentStrategies || [], {
    keys: ["name"],
  });

  const handleSearch = debounce((value: string) => {
    if (value) {
      const results = fuse.search(value);
      setSearchResults(results.map((result) => result.item));
    } else {
      setSearchResults(contentStrategies || []);
    }
  }, 500);

  const formatName = (name: string) => {
    const limit = 10;
    if (name.length > limit) {
      return name.slice(0, limit) + "...";
    }

    return name;
  };
  const renderButton = () => (
    <>
      <AddTeamModal isOpen={isOpen} onClose={onClose} />
      <HStack position="relative">
        <Stack zIndex={101}>
          <Text fontWeight="semibold" fontSize="sm">
            Select a Content Strategy
          </Text>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon color="black" />}
              size="sm"
              border="solid 2px black"
            >
              <Flex alignItems="center">
                <Text color="black">
                  {formatName(selectedStrategy?.name || "")}
                </Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <HStack px={2}>
                <Box opacity={0.5}>🔍</Box>
                <Input
                  fontSize="sm"
                  placeholder={
                    contentStrategies?.length
                      ? `${contentStrategies.length} ${
                          contentStrategies.length > 1
                            ? "strategies..."
                            : "strategy..."
                        }`
                      : `No Content Strategies Found`
                  }
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </HStack>

              <MenuDivider />
              <Box maxH="30vh" overflow="auto">
                {searchResults?.map((strategy) => (
                  <MenuItem
                    key={strategy.id}
                    onClick={() => onSelect(strategy)}
                  >
                    <Text fontSize="sm">{strategy.name}</Text>
                  </MenuItem>
                ))}
              </Box>
            </MenuList>
          </Menu>
        </Stack>
      </HStack>
    </>
  );

  if (!contentStrategies) return null;

  return <>{renderButton()}</>;
};
