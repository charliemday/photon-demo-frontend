import React, { useEffect } from "react";

import { Box, Checkbox, HStack, Stack, Text } from "@chakra-ui/react";
import { useListKeywordThemesQuery } from "api/engine.api";
import { useSelector } from "react-redux";
import { RootState, Team } from "types";

interface Props {
  onSelectTheme?: (themes: string[]) => void;
}

const KeywordThemeSection: React.FC<Props> = ({ onSelectTheme }) => {
  const [selectedThemes, setSelectedThemes] = React.useState<string[]>([]);

  useEffect(() => {
    if (onSelectTheme) onSelectTheme(selectedThemes);
  }, [selectedThemes, onSelectTheme]);

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const { data: keywordThemesData, refetch } = useListKeywordThemesQuery(
    activeTeam?.uid,
    {
      skip: !activeTeam?.uid,
    }
  );

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!keywordThemesData || keywordThemesData.length === 0)
    return (
      <Box>
        <Text fontSize="sm">{`No Themes Found yet. Try running the "Seed Keywords" section first.`}</Text>
      </Box>
    );

  return (
    <Box w="full">
      <HStack alignItems="flex-start" spacing={12}>
        <Stack flex={1}>
          <Text fontWeight="semibold">Select Keyword Themes</Text>
          <HStack justifyContent="space-between">
            <Text fontSize="xs" fontWeight="semibold">
              Theme
            </Text>
            <Text fontSize="xs" fontWeight="semibold">
              Frequency
            </Text>
          </HStack>
          <Box overflow="auto" minH="200px">
            {keywordThemesData.map(({ theme, volume }, key) => (
              <HStack
                key={key}
                justifyContent="space-between"
                _hover={{ bgColor: "gray.100" }}
                p={1}
                borderRadius="md"
                cursor="pointer"
              >
                <Checkbox
                  isChecked={selectedThemes.includes(theme)}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (e.target.checked) {
                      setSelectedThemes([...selectedThemes, theme]);
                    } else {
                      setSelectedThemes(
                        selectedThemes.filter((t) => t !== theme)
                      );
                    }
                  }}
                >
                  {theme}
                </Checkbox>
                <Box
                  bgColor="purple.200"
                  py={1}
                  px={2}
                  borderRadius="md"
                  minW="10%"
                  textAlign="center"
                >
                  <Text fontSize="sm" fontWeight="bold">
                    {volume}
                  </Text>
                </Box>
              </HStack>
            ))}
          </Box>
        </Stack>
        <HStack flex={1} pt={6} flexWrap="wrap" h="full">
          <div />
          {selectedThemes.map((theme, key) => (
            <Box key={key}>
              <Box
                bgColor="purple.200"
                py={1}
                px={2}
                mb={2}
                borderRadius="md"
                minW="10%"
                textAlign="center"
                cursor="pointer"
                _hover={{ bgColor: "purple.300" }}
                onClick={() => {
                  setSelectedThemes(selectedThemes.filter((t) => t !== theme));
                }}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  {theme}
                </Text>
              </Box>
            </Box>
          ))}
        </HStack>
      </HStack>
    </Box>
  );
};

export default KeywordThemeSection;
