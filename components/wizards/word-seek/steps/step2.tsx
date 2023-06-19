import { HStack, Stack } from "@chakra-ui/react";
import { useGetSearchConsolePagesQuery } from "api/vendor.api";
import { Button } from "components/button";
import { RecursiveChecklist } from "components/checklist";
import { Body, Heading, Label } from "components/text";
import { useActiveTeam } from "hooks";
import parsePath from "parse-path";
import { FC, useEffect, useMemo, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { nestUrls, recursiveCount } from "utils";

interface Props extends Partial<StepWizardChildProps> {
  selectedPath: string | null;
  onComplete: (pages: string[]) => void;
  isLoading?: boolean;
}

export const Step2: FC<Props> = ({
  currentStep = 0,
  totalSteps,
  selectedPath,
  nextStep,
  previousStep,
  onComplete,
  isLoading,
  isActive,
}) => {
  const activeTeam = useActiveTeam();
  const selectedSite = activeTeam?.gscUrl || "";
  const [pagesChecked, setPagesChecked] = useState<string[]>([]);

  const { data: pagesData } = useGetSearchConsolePagesQuery(
    {
      domain: selectedSite || "",
      teamUid: activeTeam?.uid || "",
    },
    {
      skip: !selectedSite || !activeTeam,
    },
  );

  const handleItemChange = (item: string[], checked: boolean) => {
    if (checked) {
      setPagesChecked([...pagesChecked, ...item]);
    } else {
      setPagesChecked(pagesChecked.filter((page) => !item.includes(page)));
    }
  };

  useEffect(() => {
    // Reset the pages checked when the step changes
    setPagesChecked([]);
  }, [currentStep]);

  const handleNextStep = () => {
    if (onComplete && pagesChecked.length > 0) {
      onComplete(pagesChecked);
    }

    if (nextStep) {
      nextStep();
    }
  };

  const pathUrls = useMemo(() => {
    return nestUrls(pagesData?.pages.filter((page) => page.includes(selectedPath || "")) || []);
  }, [pagesData?.pages, selectedPath]);

  const formattedSelectedSite = useMemo(() => {
    if (!selectedSite) return "";
    const parsedPath = parsePath(selectedSite);
    if ((parsedPath.protocol as string) === "sc-domain") {
      /**
       * If the protocol is sc-domain, then we need to add a trailing slash
       */
      let pathname = parsedPath.pathname;
      if (pathname[pathname.length - 1] !== "/") {
        pathname = `${pathname}/`;
      }
      return `https://${pathname}`;
    }

    // Ensure the last character is a slash
    let host = parsedPath.host;
    if (host[host.length - 1] !== "/") {
      host = `${host}/`;
    }
    return `${parsedPath.protocol}://${host}`;
  }, [selectedSite]);

  const pageCount = useMemo(() => recursiveCount(pathUrls), [pathUrls]);

  const renderHeader = () => {
    if (pagesChecked.length === 0) {
      return "Select Pages";
    }

    if (pagesChecked.length === 1) {
      return `Select Pages (${pagesChecked.length} page selected)`;
    }

    return `Select Pages (${pagesChecked.length} pages selected)`;
  };

  const renderEmptyPage = () => (
    <Stack py={12} alignItems="center" justifyContent="center">
      <Body fontSize="sm">No pages found for the path {selectedPath}</Body>
    </Stack>
  );

  if (!isActive) {
    return null;
  }

  return (
    <Stack>
      <Stack pb={6}>
        <Body fontSize="xl">WordSeek</Body>
        <Label color="gray.500">
          Step {currentStep} of {totalSteps}
        </Label>
      </Stack>

      <Stack spacing={12}>
        <Stack spacing={6}>
          <Stack>
            <Heading>{renderHeader()}</Heading>
            {pageCount === 0 ? null : (
              <Body>
                {pageCount} page{pageCount === 1 ? "" : "s"} found
              </Body>
            )}
          </Stack>
          <Stack overflow="auto" maxH="60vh" pl={2}>
            {pageCount === 0 ? (
              renderEmptyPage()
            ) : (
              <RecursiveChecklist
                recursiveObject={pathUrls}
                keys={Object.keys(pathUrls)}
                parentString={formattedSelectedSite}
                depth={0}
                onChange={handleItemChange}
              />
            )}
          </Stack>
        </Stack>
        <HStack w="full">
          <Button onClick={previousStep} flex={1}>
            Back
          </Button>
          <Button
            onClick={handleNextStep}
            isLoading={isLoading}
            isDisabled={pagesChecked.length === 0}
            flex={1}
          >
            Run WordSeek
          </Button>
        </HStack>
      </Stack>
    </Stack>
  );
};
