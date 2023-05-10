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
import { FloatingButton } from "components/button";

import { AutomationCard } from "components/cards";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Team, TeamType } from "types";
import {
  AdminUser,
  BroadSeedKeywords,
  KeywordInsightsResults,
  KeywordInsightsUpload,
  PeopleAlsoAsked,
  PopulateSCReports,
  ProcessRawData,
  SearchConsoleConnect,
  SearchConsoleReport,
  SeedKeywords,
  TeamBlogs,
  UploadAhrefsReport,
  WordSeek,
} from "./steps";
import { GenerateKIInput } from "./steps/seed-keywords";

enum KEY {
  AHREFS_STEP_1 = "ahrefs-step-1",
  SEMRUSH_STEP_1 = "semrush-step-1",
  COMBINED_STEPS = "combined-steps",
  SEMRUSH_BROAD_SEED_KEYWORDS = "semrush-broad-seed-keywords",
  PEOPLE_ALSO_ASKED = "people-also-asked",
  SEARCH_CONSOLE_CONNECT = "search-console-connect",
  SEARCH_CONSOLE_REPORT = "search-console-report",
  COMPARE_CONSOLE_REPORT = "compare-console-report",
  UPLOAD_AHREFS_REPORT = "upload-ahrefs-report",
  POPULATE_SC_REPORTS = "populate-sc-reports",
  KEYWORD_INSIGHTS_UPLOAD = "keyword-insights-upload",
  KEYWORD_INSIGHTS_RESULTS = "keyword-insights-results",
  TEAM_BLOGS = "team-blogs",
  ADMIN_USER = "admin-user",
}

interface STEP {
  title: string;
  description: string;
  key?: KEY;
  comingSoon?: boolean;
  image?: string | string[];
  isDisabled?: boolean;
  isNew?: boolean;
  isDeprecated?: boolean;
}

const STEPS: { title: string; steps: STEP[] }[] = [
  {
    title: "Step 1",
    steps: [
      {
        title: "Ahrefs Seed Keywords",
        description: `This will take a group of CSV files from Ahrefs and sort them to
        exclude duplicate keywords and only show the keywords on the the
        first 2 pages`,
        key: KEY.AHREFS_STEP_1,
        image: ["/steps/excel.png", "/openai-avatar.png", "/steps/ahrefs.jpeg"],
      },
      {
        title: "SEMRush Seed Keywords",
        description: `This will run Target Keywords and Competitors through the SEMRush API`,
        key: KEY.SEMRUSH_STEP_1,
        image: ["/openai-avatar.png", "/steps/semrush.jpeg"],
      },
      {
        title: "Broad Seed Keywords",
        description: `This will run Target Keywords through the SEMRush API`,
        key: KEY.SEMRUSH_BROAD_SEED_KEYWORDS,
        image: ["/steps/semrush.jpeg"],
      },
      {
        title: "Combined Steps",
        description: `This will run both Step 1 and Step 2`,
        key: KEY.COMBINED_STEPS,
        image: [
          "/steps/excel.png",
          "/openai-avatar.png",
          "/steps/ahrefs.jpeg",
          "/steps/semrush.jpeg",
        ],
      },
    ],
  },
  {
    title: "Step 2",
    steps: [
      {
        title: "People Also Asked",
        description: `This will take a CSV file with the first column of sorted keywords and get the "People Also Asked" questions for each keyword`,
        key: KEY.PEOPLE_ALSO_ASKED,
        image: "/steps/google.jpeg",
      },
    ],
  },
  {
    title: "Step 3",
    steps: [
      {
        title: "3.1 Upload Keyword Insights Data",
        description: `This will automate the content creation on the SEO Hub`,
        image: "/openai-avatar.png",
        key: KEY.KEYWORD_INSIGHTS_UPLOAD,
        isNew: true,
      },
      {
        title: "3.2 View Themes",
        description: `Views the keyword themes prior to blog generation`,
        image: "/openai-avatar.png",
        key: KEY.KEYWORD_INSIGHTS_RESULTS,
        isNew: true,
      },
      {
        title: "3.3 Blog Outlines",
        description: `View the team's blog outlines`,
        image: "/openai-avatar.png",
        key: KEY.TEAM_BLOGS,
        isNew: true,
      },
    ],
  },
  {
    title: "Reporting",
    steps: [
      {
        title: "Upload Ahrefs report",
        description: "Upload the Ahrefs report.",
        key: KEY.UPLOAD_AHREFS_REPORT,
        image: "/steps/ahrefs.jpeg",
      },
      {
        title: "Populate SC Reports",
        description: `This will populate the Search Console reports for *all* the teams.`,
        key: KEY.POPULATE_SC_REPORTS,
        image: "/steps/search-console.svg",
      },
    ],
  },
  {
    title: "SEO Tools",
    steps: [
      {
        title: "Connect up your Google Search Console",
        description: `This will allow Baser to access your Google Search Console data through Google's API so we can show your site metrics on your SEO hub.`,
        key: KEY.SEARCH_CONSOLE_CONNECT,
        image: "/steps/google.jpeg",
      },
      {
        title: "WordSeek",
        description: `Take the GSC keywords and check whether they exist on the
        pages they're associated with. The output will be saved to the drive.`,
        key: KEY.COMPARE_CONSOLE_REPORT,
        image: "/steps/search-console.svg",
      },
    ],
  },
  {
    title: "Admin Tools",
    steps: [
      {
        title: "Admin User",
        description: "For admin use",
        key: KEY.ADMIN_USER,
        image: "/steps/search-console.svg",
      },
    ],
  },
];

export const AutomationView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<KEY>(KEY.COMPARE_CONSOLE_REPORT);
  const { isOpen, onClose, onOpen } = useDisclosure();
  // const [useNewStep1, setUserNewStep1] = useState<boolean>(false);

  const { data: user } = useUserDetailsQuery(undefined);
  const { data: teams } = useListTeamsQuery({
    teamType: TeamType.INTERNAL,
  });
  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  return (
    <Box mt={20}>
      <HStack justifyContent="space-between" mb={10}>
        <Heading fontSize="2xl">
          {`🤖 Welcome to the Automation page, ${user?.firstName || ""}`}
        </Heading>

        {teams && <FloatingButton teams={teams} />}
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
            <Image src={activeTeam?.logo || ""} layout="fill" alt="Team Logo" />
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

      <Stack spacing={12} pb={32}>
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

      <SeedKeywords
        isOpen={isOpen && activeStep === KEY.SEMRUSH_STEP_1}
        onClose={onClose}
      />

      <BroadSeedKeywords
        isOpen={isOpen && activeStep === KEY.SEMRUSH_BROAD_SEED_KEYWORDS}
        onClose={onClose}
      />

      <ProcessRawData
        isOpen={isOpen && activeStep === KEY.AHREFS_STEP_1}
        onClose={onClose}
      />

      <PeopleAlsoAsked
        isOpen={isOpen && activeStep === KEY.PEOPLE_ALSO_ASKED}
        onClose={onClose}
      />
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
      <UploadAhrefsReport
        isOpen={isOpen && activeStep === KEY.UPLOAD_AHREFS_REPORT}
        onClose={onClose}
      />
      <PopulateSCReports
        isOpen={isOpen && activeStep === KEY.POPULATE_SC_REPORTS}
        onClose={onClose}
      />
      <GenerateKIInput
        isOpen={isOpen && activeStep === KEY.COMBINED_STEPS}
        onClose={onClose}
      />
      <KeywordInsightsUpload
        isOpen={isOpen && activeStep === KEY.KEYWORD_INSIGHTS_UPLOAD}
        onClose={onClose}
      />
      <KeywordInsightsResults
        isOpen={isOpen && activeStep === KEY.KEYWORD_INSIGHTS_RESULTS}
        onClose={onClose}
      />
      <TeamBlogs
        isOpen={isOpen && activeStep === KEY.TEAM_BLOGS}
        onClose={onClose}
      />

      <AdminUser
        isOpen={isOpen && activeStep === KEY.ADMIN_USER}
        onClose={onClose}
      />
    </Box>
  );
};
