import { Box, Divider, Heading, HStack, Text } from "@chakra-ui/react";
import { SemrushDatabaseMenu } from "components/menus";
import { GridInputForm } from "forms/grid-input";

import { SEMRUSH_DATABASES } from "config";

import { Image } from "components/image";
import React, { useEffect, useMemo, useState } from "react";
import { Team } from "types";

import { useTeamSeedKeywordsQuery } from "api/team.api";
import uuid from "react-uuid";

interface Props {
  onChangeKeywords: (keywords: string[]) => void;
  onChangeDb: (database: SemrushDatabase) => void;
  activeTeam: Team;
}

type SemrushDatabaseKeys = keyof typeof SEMRUSH_DATABASES;
type SemrushDatabase = typeof SEMRUSH_DATABASES[SemrushDatabaseKeys];

const TargetKeywordsSection: React.FC<Props> = ({
  onChangeKeywords,
  onChangeDb,
  activeTeam,
}) => {
  const [keywords, setTargetKeywords] = useState<string[]>([]);
  const [database, setDatabase] = useState<SemrushDatabase>("uk");

  const { data: teamSeedKeywords, refetch } = useTeamSeedKeywordsQuery(
    activeTeam?.uid,
    {
      skip: !activeTeam?.uid,
    }
  );

  console.log("Active Team", activeTeam);

  useEffect(() => {
    refetch();
  }, [activeTeam, refetch]);

  useEffect(() => {
    onChangeKeywords(keywords);
  }, [keywords, onChangeKeywords]);

  useEffect(() => {
    onChangeDb(database);
  }, [database, onChangeDb]);

  const buildDefaultKeywords = useMemo(
    () => () => {
      const defaultKeywords: {
        [key: string]: string;
      } = {};
      if (teamSeedKeywords) {
        teamSeedKeywords.forEach(({ keyword }) => {
          defaultKeywords[uuid()] = keyword;
        });
      }

      if (Object.keys(defaultKeywords).length === 0) {
        defaultKeywords[uuid()] = "";
      }

      return defaultKeywords;
    },
    [teamSeedKeywords]
  );

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
        <Heading fontSize="md">Target Keywords</Heading>
      </HStack>
      <Text fontSize="xs" opacity={0.75} py={3}>
        List the keywords the user wants to rank for. We will use SEMRush to
        extract a list of URLs that are ranking for these keywords and use them
        to generate a list of seed keywords.
      </Text>

      <HStack position="relative">
        <Text opacity={0.75}>SEMRush Database:</Text>
        <SemrushDatabaseMenu onChange={setDatabase} />
      </HStack>

      <Divider pb={3} />

      <Box pt={6}>
        <GridInputForm
          onChange={setTargetKeywords}
          defaultValues={buildDefaultKeywords()}
        />
      </Box>
    </Box>
  );
};

export default TargetKeywordsSection;
