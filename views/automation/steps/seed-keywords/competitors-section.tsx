import { Box, Heading, HStack, Switch, Text } from "@chakra-ui/react";
import { CompetitorInterface, CompetitorsForm } from "forms/competitors";

import { Image } from "components/image";
import React, { useEffect, useState } from "react";
import { Team } from "types";
import { Body } from "components/text";

interface Props {
  onChangeCompetitors: (competitors: CompetitorInterface[]) => void;
  activeTeam?: Team;
  onToggle?: (isToggled: boolean) => void;
  defaultChecked?: boolean;
}
const CompetitorsSection: React.FC<Props> = ({
  onChangeCompetitors,
  activeTeam,
  onToggle,
  defaultChecked = false,
}) => {
  const [competitors, setCompetitors] = useState<CompetitorInterface[]>([]);
  const [isToggled, setIsToggled] = useState(defaultChecked);

  useEffect(() => {
    onChangeCompetitors(competitors);
  }, [competitors, onChangeCompetitors]);

  useEffect(() => {
    onToggle && onToggle(isToggled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isToggled]);

  if (!activeTeam) return null;

  return (
    <Box
      opacity={{
        base: isToggled ? 1 : 0.25,
      }}
      _hover={{
        opacity: 1,
      }}
    >
      <HStack>
        <Box width={18} height={18} position="relative" borderRadius={4} overflow="hidden">
          <Image src="steps/semrush.jpeg" layout="fill" alt="Semrush Logo" />
        </Box>
        <Heading fontSize="md">Competitors</Heading>
      </HStack>
      {onToggle && (
        <Switch
          fontSize="sm"
          size="sm"
          py={4}
          onChange={(e) => setIsToggled(e.target.checked)}
          isChecked={isToggled}
        >
          Use Custom Competitors
        </Switch>
      )}
      <Box opacity={0.75} py={3}>
        <Body>List the competitor names and urls you want to compare against via SEMRush</Body>
      </Box>
      <Box pt={6}>
        <CompetitorsForm onChange={setCompetitors} team={activeTeam} />
      </Box>
    </Box>
  );
};

export default CompetitorsSection;
