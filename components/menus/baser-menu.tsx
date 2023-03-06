import React, { useEffect, useState } from "react";

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

import FuseJS from "fuse.js";
import debounce from "lodash/debounce";

interface Data {
  label: string;
  value: string;
}

interface Props {
  onChange: (value: string) => void;
  data: Data[];
}

export const BaserMenu: React.FC<Props> = ({ onChange, data }) => {
  const [searchResults, setSearchResults] = useState<Data[]>(data);
  const [selectedItem, setSelectedItem] = useState<Data | null>(
    data?.[0] || null
  );

  useEffect(() => {
    if (selectedItem) {
      onChange(selectedItem.value);
    }
  }, [selectedItem, onChange]);

  useEffect(() => {
    setSearchResults(data);
    setSelectedItem(data?.[0] || null);
  }, [data]);

  const fuse = new FuseJS(data, {
    keys: ["label"],
  });

  const handleSearch = debounce((value: string) => {
    if (value) {
      const results = fuse.search(value);
      setSearchResults(results.map((result) => result.item));
    } else {
      setSearchResults(data);
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
        {selectedItem?.label || "Select Item"}
      </MenuButton>
      <MenuList fontSize="sm">
        <HStack px={2}>
          <Box opacity={0.5}>🔍</Box>
          <Input
            fontSize="sm"
            placeholder={
              data.length
                ? `${data.length} item${data.length > 1 ? "s..." : "..."}`
                : `No data Found`
            }
            onChange={(e) => handleSearch(e.target.value)}
          />
        </HStack>
        <MenuDivider />
        <Box maxH="30vh" overflow="auto">
          {searchResults.map(({ label, value }, key) => (
            <MenuItem
              key={key}
              onClick={() => setSelectedItem({ label, value })}
            >
              {label}
            </MenuItem>
          ))}
        </Box>
      </MenuList>
    </Menu>
  );
};
