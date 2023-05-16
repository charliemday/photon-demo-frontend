import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button as ChakraButton,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import { BsChevronDown as ChevronDownIcon } from "react-icons/bs";

import { useListGeographiesQuery } from "api/strategies.api";
import FuseJS from "fuse.js";
import debounce from "lodash/debounce";
import { typeCheckError } from "utils";

interface Props {
  onChange: (value: string) => void;
  /**
   * For the placeholder e.g. "database"
   */
  itemVerboseName?: string;
  /**
   * For the placeholder e.g. "databases"
   */
  itemVerbosePluralName?: string;
}

interface Database {
  label: string;
  value: string;
}

export const SemrushDatabaseMenu: React.FC<Props> = ({
  onChange,
  itemVerboseName = "database",
  itemVerbosePluralName = "databases",
}) => {
  const {
    data: geographies,
    refetch,
    error,
    isError,
    isLoading,
  } = useListGeographiesQuery();

  const buildDatabaseMenu = useMemo(
    () => () =>
      geographies
        ? geographies.map(({ label, name }) => ({
            label,
            value: name,
          }))
        : [],
    [geographies]
  );

  const toast = useToast();

  useEffect(() => {
    /**
     * When the component mounts, we want to refetch the geographies
     */
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && isError && error) {
      toast({
        title: "Error loading geographies",
        description: typeCheckError(error) || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isError, error, isLoading, toast]);

  const databases = buildDatabaseMenu();

  const [searchResults, setSearchResults] = useState<Database[]>(
    databases || []
  );

  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>({
    label: "🇬🇧 United Kingdom",
    value: "uk",
  });

  useEffect(() => {
    if (selectedDatabase) {
      onChange(selectedDatabase.value);
    }
  }, [selectedDatabase, onChange]);

  const fuse = new FuseJS(databases, {
    keys: ["label"],
  });

  const handleSearch = debounce((value: string) => {
    if (value) {
      const results = fuse.search(value);
      setSearchResults(results.map((result) => result.item));
    } else {
      setSearchResults(databases);
    }
  }, 500);

  return (
    <Menu size="sm">
      <MenuButton
        size="sm"
        as={ChakraButton}
        rightIcon={<ChevronDownIcon />}
        variant="outline"
      >
        {selectedDatabase?.label || "Select Database"}
      </MenuButton>
      <MenuList fontSize="sm">
        <HStack px={2}>
          <Box opacity={0.5}>🔍</Box>
          <Input
            fontSize="sm"
            placeholder={
              databases.length > 0
                ? `${databases.length} ${
                    databases.length === 1
                      ? itemVerboseName
                      : itemVerbosePluralName
                  }
                  `
                : `No ${itemVerbosePluralName} Found`
            }
            onChange={(e) => handleSearch(e.target.value)}
          />
        </HStack>
        <MenuDivider />
        <Box maxH="30vh" overflow="auto">
          {searchResults.map(({ label, value }, key) => (
            <MenuItem
              key={key}
              onClick={() => setSelectedDatabase({ label, value })}
            >
              {label}
            </MenuItem>
          ))}
          {searchResults.length === 0 && (
            <Text p={6}>No {itemVerbosePluralName} Found</Text>
          )}
        </Box>
      </MenuList>
    </Menu>
  );
};
