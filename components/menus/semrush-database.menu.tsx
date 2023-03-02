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
} from "@chakra-ui/react";
import { BsChevronDown as ChevronDownIcon } from "react-icons/bs";

import { SEMRUSH_DATABASES } from "config";
import FuseJS from "fuse.js";
import debounce from "lodash/debounce";

interface Props {
  onChange: (value: string) => void;
}

interface Database {
  label: string;
  value: string;
}

export const SemrushDatabaseMenu: React.FC<Props> = ({ onChange }) => {
  const buildDatabaseMenu = useMemo(
    () => () =>
      Object.keys(SEMRUSH_DATABASES).map((key) => ({
        label: key,
        // @ts-ignore
        value: SEMRUSH_DATABASES[key],
      })),
    []
  );

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
              databases.length
                ? `${databases.length} database${
                    databases.length > 1 ? "s..." : "..."
                  }`
                : `No databases Found`
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
        </Box>
      </MenuList>
    </Menu>
  );
};
