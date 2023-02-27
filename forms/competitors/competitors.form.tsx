import { Box, FormControl, HStack, Input, Stack } from "@chakra-ui/react";
import { useTeamCompetitorsQuery } from "api/team.api";
import { Button } from "components/button";
import { useEffect, useState } from "react";
import { BiMinusCircle } from "react-icons/bi";
import uuid from "react-uuid";
import { Team } from "types";

export interface CompetitorInterface {
  name: string;
  url: string;
}

interface Props {
  onChange?: (competitors: CompetitorInterface[]) => void;
  team: Team;
}

const CompetitorsForm: React.FC<Props> = ({ onChange, team }) => {
  const [inputs, setInputs] = useState<{
    [key: string]: CompetitorInterface;
  }>({
    [uuid()]: {
      name: "",
      url: "",
    },
  });

  const { data: competitorData, isSuccess } = useTeamCompetitorsQuery(team.uid);

  useEffect(() => {
    if (team) {
      /**
       * Reset the team inputs
       */
      setInputs({
        [uuid()]: {
          name: "",
          url: "",
        },
      });
    }
  }, [team]);

  useEffect(() => {
    if (isSuccess) {
      if (competitorData?.length) {
        const initialCompetitors: {
          [key: string]: CompetitorInterface;
        } = {};

        competitorData.forEach((competitor) => {
          initialCompetitors[uuid()] = {
            name: competitor.competitorName,
            url: competitor.competitorUrl,
          };
        });

        setInputs(initialCompetitors);
      }
    }
  }, [isSuccess, competitorData]);

  useEffect(() => {
    if (onChange) {
      onChange(Object.values(inputs));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const renderCompetitorInput = (key: string) => (
    <HStack pr={2}>
      <FormControl isRequired>
        <Input
          placeholder="Competitor Name"
          value={inputs[key].name}
          onChange={(e) => {
            setInputs((s) => {
              const newInputs = { ...s };
              newInputs[key] = {
                ...newInputs[key],
                name: e.target.value,
              };
              return newInputs;
            });
          }}
        />
      </FormControl>
      <FormControl isRequired>
        <Input
          placeholder={`Competitor URL ${inputs[key].url}`}
          type="url"
          value={inputs[key].url}
          onChange={(e) => {
            setInputs((s) => {
              const newInputs = { ...s };
              newInputs[key] = {
                ...newInputs[key],
                url: e.target.value,
              };
              return newInputs;
            });
          }}
        />
      </FormControl>
      <Box
        cursor="pointer"
        opacity={0.5}
        _hover={{
          color: "red.500",
          opacity: 1,
        }}
        onClick={() => {
          setInputs((s) => {
            const newInputs = { ...s };
            delete newInputs[key];
            return newInputs;
          });
        }}
      >
        <BiMinusCircle />
      </Box>
    </HStack>
  );

  return (
    <Stack>
      {Object.keys(inputs).map((inputKey, key) =>
        renderCompetitorInput(inputKey)
      )}
      <Box>
        <Button
          size="sm"
          mt={3}
          onClick={() => {
            setInputs((s) => {
              const newInputs = { ...s };
              newInputs[uuid()] = {
                name: "",
                url: "",
              };
              return newInputs;
            });
          }}
        >
          Add a new Competitor
        </Button>
      </Box>
    </Stack>
  );
};

export default CompetitorsForm;
