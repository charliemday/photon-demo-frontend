import {
  Checkbox,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  useCreateSearchConsoleReportMutation,
  useGetSearchConsoleSitesQuery,
} from "api/vendor.api";
import { Button } from "components/button";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Team } from "types";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";
import { Body, Label } from "components/text";

interface Props {
  isDisabled?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchConsoleReport: React.FC<Props> = ({ isDisabled, isOpen, onClose }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [saveReport, setSaveReport] = useState<boolean>(false);

  const toast = useToast();

  const activeTeam = useSelector((state: RootState) => state.team.activeTeam) as Team | null;

  const { isLoading: isSiteLoading, data: sites } = useGetSearchConsoleSitesQuery(
    {
      teamUid: activeTeam?.uid || "",
    },
    {
      skip: !isOpen || activeTeam?.uid === undefined,
    },
  );

  const [
    createReport,
    { isLoading: isReportLoading, isSuccess: isReportSuccess, error: reportError, isError },
  ] = useCreateSearchConsoleReportMutation();

  useEffect(() => {
    if (!isReportLoading) {
      if (isReportSuccess) {
        toast({
          title: "Success",
          description: "Report created successfully. Check your Email.",
          status: "success",
          isClosable: true,
        });
      }

      if (isError && reportError) {
        toast({
          title: "Error",
          description: typeCheckError(reportError) || "Something went wrong",
          status: "error",
          isClosable: true,
        });
      }
    }
  }, [isReportLoading, isReportSuccess, toast, isError, reportError]);

  const handleGetReport = () => {
    if (startDate && endDate && domain) {
      const body = {
        startDate,
        endDate,
        domain,
        dimensions: ["query", "page"],
        notify: "true" as const,
      } as any;

      if (saveReport) {
        body["team"] = activeTeam?.id;
      }

      createReport(body);
    }
  };

  return (
    <ModalStepWrapper isOpen={isOpen} onClose={onClose}>
      <Stack spacing={6} pointerEvents={isDisabled ? "none" : "auto"}>
        <Heading fontSize="lg">4. Google Search Console Report for {activeTeam?.name}</Heading>
        <Body opacity={0.5}>
          {isDisabled
            ? "You need to connect to Google Search Console to use this automation"
            : "Get the search console report sent to info@getbaser.com"}
        </Body>
        <Stack opacity={isDisabled ? 0.25 : 1}>
          <HStack>
            <Stack w="full">
              <Label fontWeight="semibold">Start Date:</Label>
              <Input
                type="date"
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                size="sm"
                bgColor="white"
              />
            </Stack>
            <Stack w="full">
              <Label fontWeight="semibold">End Date:</Label>
              <Input
                type="date"
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                bgColor="white"
                size="sm"
              />
            </Stack>
          </HStack>
          <Stack>
            <Label fontWeight="semibold">Domain</Label>
            <Select
              placeholder="Select Site"
              bgColor="white"
              onChange={({ target: { value } }) => setDomain(value)}
              defaultValue={
                activeTeam?.url
                  ? sites?.find((site) => activeTeam?.url && site.includes(activeTeam?.url))
                  : undefined
              }
            >
              {sites?.map((site, idx) => (
                <option key={idx} value={site}>
                  {site}
                </option>
              ))}
            </Select>
            {!isDisabled && isSiteLoading && (
              <HStack opacity={0.5}>
                <Label>Fetching the domains you have access to</Label>
                <Spinner size="xs" />
              </HStack>
            )}
          </Stack>
          <Stack pt={4} pl={2}>
            <Checkbox size="sm" onChange={(e) => setSaveReport(e.target.checked)}>
              Save Report
            </Checkbox>
            <Body opacity={0.75}>This will save the report to the Database for this Team.</Body>
          </Stack>
        </Stack>
        <Flex justifyContent="flex-end">
          <Button
            size="sm"
            onClick={handleGetReport}
            isDisabled={!startDate || !endDate || !sites}
            isLoading={isReportLoading}
          >
            Get Report
          </Button>
        </Flex>
      </Stack>
    </ModalStepWrapper>
  );
};
