import { HStack, Stack } from "@chakra-ui/react";
import { useWordSeekJobsQuery } from "api/engine.api";
import { Button } from "components/button";
import { PageSelect, SiteSelect } from "components/select";
import { Body, Heading, Label } from "components/text";
import { MAX_FREE_RESULTS } from "config";
import { useActiveTeam } from "hooks";
import { FC, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {
  onChangeSite: (site: string) => void;
  onChangePage: (page: string) => void;
  runAllPages: () => void;
  runWordSeek?: (pages: string[], callback?: () => void) => void;
  hasAccess?: boolean;
  isRunningWordSeek?: boolean;
}

export const Step1: FC<Props> = ({
  currentStep = 0,
  totalSteps,
  nextStep,
  onChangeSite,
  onChangePage,
  runAllPages,
  lastStep,
  hasAccess,
  runWordSeek,
  isRunningWordSeek,
}) => {
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [selectedPath, setSelectedPath] = useState<string>("");
  const activeTeam = useActiveTeam();

  const { data: wordSeekJobs, refetch } = useWordSeekJobsQuery({
    teamId: activeTeam?.id,
  });

  const handleSiteChange = (site: string) => {
    setSelectedSite(site);
    onChangeSite(site);
  };

  const renderPremiumButton = () => (
    <HStack w="full">
      <Button
        onClick={() => {
          runAllPages();
          lastStep?.();
        }}
        isDisabled={!selectedSite}
        flex={1}
      >
        Run all pages
      </Button>
      <Button onClick={nextStep} isDisabled={!selectedSite} flex={1}>
        Select Pages
      </Button>
    </HStack>
  );

  const renderFreemiumButton = () =>
    wordSeekJobs && wordSeekJobs?.length < MAX_FREE_RESULTS ? (
      <HStack w="full">
        <Button
          isDisabled={!selectedPath}
          flex={1}
          isLoading={isRunningWordSeek}
          onClick={() => {
            runWordSeek?.([selectedPath], () => {
              lastStep?.();
              refetch();
            });
          }}
        >
          Run Word Seek
        </Button>
      </HStack>
    ) : (
      <Body fontSize="sm" fontWeight="bold">
        Upgrade to run for more than {MAX_FREE_RESULTS} pages
      </Body>
    );

  return (
    <Stack spacing={6}>
      <Stack pb={6}>
        <Heading fontSize="2xl">WordSeek</Heading>
        <Label color="gray.500">
          Step {currentStep} of {totalSteps}
        </Label>
      </Stack>
      <Stack spacing={12}>
        <Stack spacing={4}>
          <Heading>Select a site</Heading>
          <SiteSelect onChange={handleSiteChange} />
        </Stack>

        {selectedSite && (
          <Stack spacing={4}>
            <Heading>{hasAccess ? "Select path" : "Select page"}</Heading>
            <Body fontSize="sm">
              {hasAccess
                ? `Enter your target URL or URL path. For example, you can select www.website.com/blog to
              show all blog pages.`
                : `Find the page you want to run WordSeek on. This will identify all the queries that don't exist on this page.`}
            </Body>
            <PageSelect
              domain={selectedSite}
              onChange={(page) => {
                onChangePage(page);
                setSelectedPath(page);
              }}
            />
          </Stack>
        )}
        {hasAccess ? renderPremiumButton() : renderFreemiumButton()}
      </Stack>
    </Stack>
  );
};
