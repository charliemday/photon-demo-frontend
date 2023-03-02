import { Box, Divider, Heading, HStack, Text } from "@chakra-ui/react";
import { SemrushDatabaseMenu } from "components/menus";
import { CompetitorInterface, CompetitorsForm } from "forms/competitors";

import { SEMRUSH_DATABASES } from "config";

import { Image } from "components/image";
import React, { useEffect, useState } from "react";
import { Team } from "types";

interface Props {
  onChangeCompetitors: (competitors: CompetitorInterface[]) => void;
  onChangeDb: (database: SemrushDatabase) => void;
  activeTeam?: Team;
}

type SemrushDatabaseKeys = keyof typeof SEMRUSH_DATABASES;
type SemrushDatabase = typeof SEMRUSH_DATABASES[SemrushDatabaseKeys];

const CompetitorsSection: React.FC<Props> = ({
  onChangeCompetitors,
  onChangeDb,
  activeTeam,
}) => {
  const [competitors, setCompetitors] = useState<CompetitorInterface[]>([]);
  const [database, setDatabase] = useState<SemrushDatabase>("uk");

  useEffect(() => {
    onChangeCompetitors(competitors);
  }, [competitors, onChangeCompetitors]);

  useEffect(() => {
    onChangeDb(database);
  }, [database, onChangeDb]);

  if (!activeTeam) return null;

  return (
    <Box>
      <HStack>
        <Box
          width={18}
          height={18}
          position="relative"
          borderRadius={4}
          overflow="hidden"
        >
          <Image src="steps/semrush.jpeg" layout="fill" alt="Semrush Logo" />
        </Box>
        <Heading fontSize="md">Competitors</Heading>
      </HStack>
      <Text fontSize="xs" opacity={0.75} py={3}>
        List the competitor names and urls you want to compare against via
        SEMRush
      </Text>

      <HStack position="relative">
        <Text opacity={0.75}>SEMRush Database:</Text>
        <SemrushDatabaseMenu onChange={setDatabase} />
      </HStack>

      <Divider pb={3} />

      <Box pt={6}>
        <CompetitorsForm onChange={setCompetitors} team={activeTeam} />
      </Box>
    </Box>
  );
};

export default CompetitorsSection;
