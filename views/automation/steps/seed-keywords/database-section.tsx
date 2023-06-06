import { Box, Heading, HStack, Text } from "@chakra-ui/react";

import { Image } from "components/image";
import { SemrushDatabaseMenu } from "components/menus";
import { Body } from "components/text";
import React, { useEffect, useState } from "react";
import { SemrushDatabase } from "types";

interface Props {
  onChange: (database: SemrushDatabase) => void;
}

const DatabaseSection: React.FC<Props> = ({ onChange }) => {
  const [database, setDatabase] = useState<SemrushDatabase>("uk");

  useEffect(() => {
    if (onChange) {
      onChange(database);
    }
  }, [database, onChange]);

  return (
    <Box>
      <HStack>
        <Box width={18} height={18} position="relative" borderRadius={4} overflow="hidden">
          <Image src="steps/semrush.jpeg" layout="fill" alt="Semrush Logo" />
        </Box>
        <Heading fontSize="md">Database</Heading>
      </HStack>
      <Box opacity={0.75} py={3}>
        <Body>Determine the SEMRush database to use for the keyword research.</Body>
      </Box>
      <HStack position="relative" py={3}>
        <Text opacity={0.75} fontSize="sm">
          SEMRush Database:
        </Text>
        <SemrushDatabaseMenu onChange={setDatabase} />
      </HStack>
    </Box>
  );
};

export default DatabaseSection;
