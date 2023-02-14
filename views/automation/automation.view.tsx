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
import { Team } from "types";
import {
  PeopleAlsoAsked,
  PopulateSCReports,
  ProcessRawData,
  SearchConsoleCompare,
  SearchConsoleConnect,
  SearchConsoleReport,
  UploadAhrefsReport,
} from "./steps";

enum KEY {
  PROCESS_RAW_DATA = "process-raw-data",
  PEOPLE_ALSO_ASKED = "people-also-asked",
  SEARCH_CONSOLE_CONNECT = "search-console-connect",
  SEARCH_CONSOLE_REPORT = "search-console-report",
  COMPARE_CONSOLE_REPORT = "compare-console-report",
  UPLOAD_AHREFS_REPORT = "upload-ahrefs-report",
  POPULATE_SC_REPORTS = "populate-sc-reports",
}

const STEPS: {
  title: string;
  description: string;
  key?: KEY;
  comingSoon?: boolean;
  image?: string | string[];
  isDisabled?: boolean;
}[] = [
  {
    title: "1. Process Ahrefs Export",
    description: `This will take a group of CSV files from Ahrefs and sort them to
    exclude duplicate keywords and only show the keywords on the the
    first 2 pages`,
    key: KEY.PROCESS_RAW_DATA,
    image: ["/steps/excel.png", "/steps/ahrefs.jpeg", "/openai-avatar.png"],
  },
  {
    title: "2. People Also Asked",
    description: `This will take a CSV file with the first column of sorted keywords and get the "People Also Asked" questions for each keyword`,
    key: KEY.PEOPLE_ALSO_ASKED,
    image: "/steps/google.jpeg",
  },
  {
    title: "3. Connect up your Google Search Console",
    description: `This will allow Baser to access your Google Search Console data through Google's API so we can show your site metrics on your SEO hub.`,
    key: KEY.SEARCH_CONSOLE_CONNECT,
    image: "/steps/google.jpeg",
  },
  {
    title: "4. Google Search Console Report",
    description: "Get the search console report sent to info@getbaser.com",
    key: KEY.SEARCH_CONSOLE_REPORT,
    image: "/steps/search-console.svg",
    isDisabled: true,
  },
  {
    title: "5. Compare Console Report",
    description: `Compare the Search Console Results whether the keywords exist on a
    specific page. The output will be an email sent to info@getbaser.com`,
    key: KEY.COMPARE_CONSOLE_REPORT,
    image: "/steps/search-console.svg",
  },
  {
    title: "6. Upload Ahrefs report",
    description: "Upload the Ahrefs report.",
    key: KEY.UPLOAD_AHREFS_REPORT,
    image: "/steps/ahrefs.jpeg",
  },
  {
    title: "7. Populate SC Reports",
    description: `This will populate the Search Console reports for *all* the teams.`,
    key: KEY.POPULATE_SC_REPORTS,
    image: "/steps/search-console.svg",
  },
  {
    title: "8. Automate Content Creation",
    description: `This will automate the content creation on the SEO Hub`,
    comingSoon: true,
    image: "/steps/notion.png",
  },
];

export const AutomationView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<KEY>(KEY.COMPARE_CONSOLE_REPORT);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { data: user } = useUserDetailsQuery(undefined);
  const { data: teams } = useListTeamsQuery(undefined);
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

      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {STEPS.map((step, key) => (
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
            />
          </GridItem>
        ))}
      </Grid>

      {/* STEPS */}
      <ProcessRawData
        isOpen={isOpen && activeStep === KEY.PROCESS_RAW_DATA}
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
      <SearchConsoleCompare
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
    </Box>
  );
};
