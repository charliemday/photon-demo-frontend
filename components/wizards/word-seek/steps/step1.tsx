import { HStack, Stack } from "@chakra-ui/react";
import { Button } from "components/button";
import { PageSelect, SiteSelect } from "components/select";
import { Body, Heading, Label } from "components/text";
import { FC, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

interface Props extends Partial<StepWizardChildProps> {
  onChangeSite: (site: string) => void;
  onChangePage: (page: string) => void;
  runAllPages: () => void;
}

export const Step1: FC<Props> = ({
  currentStep = 0,
  totalSteps,
  nextStep,
  onChangeSite,
  onChangePage,
  runAllPages,
  lastStep,
}) => {
  const [selectedSite, setSelectedSite] = useState<string>("");

  const handleSiteChange = (site: string) => {
    setSelectedSite(site);
    onChangeSite(site);
  };

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
            <Heading>Select path</Heading>
            <Body fontSize="sm">
              Enter your target URL or URL path. For example, you can select www.website.com/blog to
              show all blog pages.
            </Body>
            <PageSelect domain={selectedSite} onChange={onChangePage} />
          </Stack>
        )}
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
      </Stack>
    </Stack>
  );
};
