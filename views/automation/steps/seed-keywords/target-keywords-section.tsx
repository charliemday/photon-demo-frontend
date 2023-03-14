import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { GridInputForm } from "forms/grid-input";

import { useListSeedKeywordsQuery } from "api/team.api";
import { Image } from "components/image";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import uuid from "react-uuid";
import { RootState, Team } from "types";

interface Props {
  onChangeKeywords: (keywords: string[]) => void;
}

const TargetKeywordsSection: React.FC<Props> = ({ onChangeKeywords }) => {
  const [keywords, setTargetKeywords] = useState<string[]>([]);

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const {
    data: seedKeywords,
    refetch,
    isLoading,
  } = useListSeedKeywordsQuery(activeTeam?.uid, {
    skip: !activeTeam?.uid,
  });

  useEffect(() => {
    refetch();
  }, [activeTeam, refetch]);

  useEffect(() => {
    onChangeKeywords(keywords);
  }, [keywords, onChangeKeywords]);

  const buildDefaultValues = useMemo(() => {
    if (seedKeywords) {
      const defaultValues: {
        [key: string]: string;
      } = {};

      seedKeywords.forEach(({ keyword }) => {
        defaultValues[uuid()] = keyword;
      });

      return defaultValues;
    }
  }, [seedKeywords]);

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
      <Box pt={6}>
        <GridInputForm
          onChange={setTargetKeywords}
          defaultValues={buildDefaultValues}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default TargetKeywordsSection;
