import React, { useState } from "react";
import {
  HStack,
  Heading,
  Box,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import { FloatingButton } from "components/button";

import { useUserDetailsQuery } from "api/user.api";
import { useListTeamsQuery } from "api/team.api";

import { AutomationCard } from "components/cards";
import {
  PeopleAlsoAsked,
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
}

const STEPS: {
  title: string;
  description: string;
  key?: KEY;
  comingSoon?: boolean;
  image?: string;
}[] = [
  {
    title: "1. Process CSV",
    description: `This will take a group of CSV files from Ahrefs and sort them to
    exclude duplicate keywords and only show the keywords on the the
    first 2 pages`,
    key: KEY.PROCESS_RAW_DATA,
    image: "/steps/excel.ico",
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
    title: "7. Automate Content Creation",
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

  return (
    <Box mt={20}>
      <HStack justifyContent="space-between" mb={10}>
        <Heading fontSize="2xl" mb={8}>
          {`🤖 Welcome to the Automation page, ${user?.firstName || ""}`}
        </Heading>

        {teams && <FloatingButton teams={teams} />}
      </HStack>

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
    </Box>
  );
};
