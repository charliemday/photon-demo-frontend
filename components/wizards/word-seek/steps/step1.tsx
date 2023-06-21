import { Flex, HStack, Stack } from "@chakra-ui/react";
import { useWordSeekJobsQuery } from "api/engine.api";
import { Button } from "components/button";
import { PageSelect, SubdomainSelect } from "components/select";
import { Body, Heading, Label } from "components/text";
import { MAX_FREE_RESULTS, WORD_SEEK } from "config";
import { useActiveTeam } from "hooks";
import { FC, useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {
  onChangePage: (page: string) => void;
  runAllPages: () => void;
  runWordSeek?: (pages: string[], callback?: () => void) => void;
  hasAccess?: boolean;
  isRunningWordSeek?: boolean;
  onUpgradeClick?: () => void;
}

export const Step1: FC<Props> = ({
  currentStep = 0,
  totalSteps,
  nextStep,
  onChangePage,
  runAllPages,
  lastStep,
  hasAccess,
  runWordSeek,
  isRunningWordSeek,
  isActive,
  onUpgradeClick,
}) => {
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>("");
  const activeTeam = useActiveTeam();

  const [isLoadingNextStep, setIsLoadingNextStep] = useState<boolean>(false);

  const { data: wordSeekJobs, refetch } = useWordSeekJobsQuery({
    teamId: activeTeam?.id,
  });

  useEffect(() => {
    if (isActive) {
      setIsLoadingNextStep(false);
    }
  }, [isActive]);

  const handleSubdomainChange = (subdomain: string) => {
    setSelectedSubdomain(subdomain);
  };

  const renderPremiumButton = () => (
    <HStack w="full">
      <Button
        onClick={() => {
          runAllPages();
          lastStep?.();
        }}
        isDisabled={!selectedSubdomain}
        flex={1}
      >
        Run all pages
      </Button>
      <Button
        onClick={() => {
          setIsLoadingNextStep(true);
          nextStep?.();
        }}
        isLoading={isLoadingNextStep}
        isDisabled={!selectedSubdomain}
        flex={1}
      >
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
          Run {WORD_SEEK}
        </Button>
      </HStack>
    ) : (
      <Flex alignItems="center" justifyContent="center" pb={6}>
        <Body
          fontSize="sm"
          fontWeight="bold"
          cursor="pointer"
          _hover={{
            textDecoration: "underline",
          }}
          onClick={onUpgradeClick}
        >
          Upgrade to run for more than {MAX_FREE_RESULTS} pages
        </Body>
      </Flex>
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
          <Heading>Select a Subdomain</Heading>
          <SubdomainSelect onChange={handleSubdomainChange} />
        </Stack>

        {selectedSubdomain && (
          <Stack spacing={4}>
            <Heading>{hasAccess ? "Select path" : "Select page"}</Heading>
            <Body fontSize="sm">
              {hasAccess
                ? `Enter your target URL or URL path. For example, you can select www.website.com/blog to
              show all blog pages.`
                : `Find the page you want to run WordSeek on. This will identify all the queries that don't exist on this page.`}
            </Body>
            <PageSelect
              onChange={(page) => {
                onChangePage(page);
                setSelectedPath(page);
              }}
              subdomain={selectedSubdomain}
            />
          </Stack>
        )}
        {hasAccess ? renderPremiumButton() : renderFreemiumButton()}
      </Stack>
    </Stack>
  );
};
