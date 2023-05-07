import {
  Box,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";

import { useListTeamsQuery } from "api/team.api";
import { useUserDetailsQuery } from "api/user.api";
import {
  Button,
  FloatingButton,
  FloatingButtonContentStrategy,
} from "components/button";

import { AutomationCard } from "components/cards";
import { ContentStrategy } from "components/wizards";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Team, TeamType } from "types";
import { KEY, STEPS } from "./config";
import {
  BroadSeedKeywords,
  KeywordInsightsResults,
  KeywordInsightsUpload,
  PeopleAlsoAsked,
  PopulateSCReports,
  SearchConsoleConnect,
  SearchConsoleReport,
  SeedKeywords,
  TeamBlogs,
  WordSeek,
} from "./steps";
import { GenerateKIInput } from "./steps/seed-keywords";

export const AutomationView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<KEY>(KEY.COMPARE_CONSOLE_REPORT);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isContentStrategyOpen,
    onClose: onCloseContentStrategy,
    onOpen: onOpenContentStrategy,
  } = useDisclosure();

  const { data: user } = useUserDetailsQuery(undefined);
  const { data: teams } = useListTeamsQuery({
    teamType: TeamType.INTERNAL,
  });
  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  return (
    <Box mt={20}>
      <ContentStrategy
        isOpen={isContentStrategyOpen}
        onClose={onCloseContentStrategy}
      />
      <HStack justifyContent="space-between" mb={10} alignItems="flex-start">
        <Heading fontSize="2xl">
          {`🤖 Welcome to the Automation page, ${user?.firstName || ""}`}
        </Heading>

        <HStack spacing={6}>
          {teams && <FloatingButton teams={teams} />}
          {<FloatingButtonContentStrategy />}
        </HStack>
      </HStack>

      <Stack my={4}>
        <HStack>
          <Text fontSize="sm">Current Team:</Text>
          <Text fontSize="sm" fontWeight="bold">
            {activeTeam?.name || ""}
          </Text>
          <Box
            h={6}
            w={6}
            position="relative"
            borderRadius={4}
            overflow="hidden"
          >
            {activeTeam?.logo && (
              <Image
                src={activeTeam?.logo || ""}
                layout="fill"
                alt="Team Logo"
              />
            )}
          </Box>
        </HStack>
        <HStack>
          <Text fontSize="sm">Team Has Drive Setup:</Text>
          {activeTeam?.driveFolderId ? (
            <BsCheckCircleFill color="green" />
          ) : (
            <IoIosCloseCircle color="red" />
          )}
        </HStack>
        <HStack>
          <Text fontSize="sm">UID:</Text>
          <Text fontSize="sm" fontWeight="bold">
            {activeTeam?.uid || ""}
          </Text>
        </HStack>
      </Stack>

      <Divider my={8} />

      <Button onClick={onOpenContentStrategy}>
        Open Content Strategy Wizard
      </Button>

      <Stack spacing={12} pb={32} pt={6}>
        {STEPS.map(({ title, steps }, key) => (
          <Stack key={key} spacing={8}>
            <Text fontSize="lg" fontWeight="semibold">
              {title}
            </Text>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {steps.map((step, key) => (
                <GridItem key={key} w="100%">
                  <AutomationCard
                    title={step.title}
                    description={step.description}
                    onClick={() => {
                      setActiveStep(step.key as KEY);
                      onOpen();
                    }}
                    comingSoon={step.comingSoon}
                    image={step.image}
                    isDisabled={step.isDisabled}
                    badgeLabel={
                      step.isNew
                        ? "New"
                        : step.isDeprecated
                        ? "Deprecated"
                        : undefined
                    }
                    badgeColor={
                      step.isNew
                        ? "green"
                        : step.isDeprecated
                        ? "yellow"
                        : undefined
                    }
                  />
                </GridItem>
              ))}
            </Grid>
          </Stack>
        ))}
      </Stack>

      {/* STEPS */}

      {/* Step 1.1 */}
      <SeedKeywords
        isOpen={isOpen && activeStep === KEY.SEMRUSH_STEP_1}
        onClose={onClose}
      />

      {/* Step 1.2 */}
      <BroadSeedKeywords
        isOpen={isOpen && activeStep === KEY.SEMRUSH_BROAD_SEED_KEYWORDS}
        onClose={onClose}
      />

      {/* Step 1.3 */}
      <GenerateKIInput
        isOpen={isOpen && activeStep === KEY.COMBINED_STEPS}
        onClose={onClose}
      />

      {/* Step 2 */}
      <PeopleAlsoAsked
        isOpen={isOpen && activeStep === KEY.PEOPLE_ALSO_ASKED}
        onClose={onClose}
      />

      {/* Step 3.1 */}
      <KeywordInsightsUpload
        isOpen={isOpen && activeStep === KEY.KEYWORD_INSIGHTS_UPLOAD}
        onClose={onClose}
      />

      {/* Step 3.2 */}
      <KeywordInsightsResults
        isOpen={isOpen && activeStep === KEY.KEYWORD_INSIGHTS_RESULTS}
        onClose={onClose}
      />

      {/* Step 3.3 */}
      <TeamBlogs
        isOpen={isOpen && activeStep === KEY.TEAM_BLOGS}
        onClose={onClose}
      />

      {/* Other */}
      <SearchConsoleConnect
        isOpen={isOpen && activeStep === KEY.SEARCH_CONSOLE_CONNECT}
        onClose={onClose}
      />
      <SearchConsoleReport
        isOpen={isOpen && activeStep === KEY.SEARCH_CONSOLE_REPORT}
        onClose={onClose}
      />
      <WordSeek
        isOpen={isOpen && activeStep === KEY.COMPARE_CONSOLE_REPORT}
        onClose={onClose}
      />
      <PopulateSCReports
        isOpen={isOpen && activeStep === KEY.POPULATE_SC_REPORTS}
        onClose={onClose}
      />
    </Box>
  );
};
