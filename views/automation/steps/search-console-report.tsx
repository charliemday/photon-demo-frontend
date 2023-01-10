import React, { useState, useEffect } from "react";
import {
  Stack,
  Heading,
  Text,
  HStack,
  Input,
  Select,
  Flex,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Button } from "components/button";
import {
  useGetSearchConsoleSitesQuery,
  useCreateSearchConsoleReportMutation,
} from "api/vendor.api";
import { RootState } from "store";
import { useSelector } from "react-redux";
import { Team } from "types";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isDisabled?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchConsoleReport: React.FC<Props> = ({
  isDisabled,
  isOpen,
  onClose,
}) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);

  const toast = useToast();

  const activeTeam = useSelector(
    (state: RootState) => state.team.activeTeam
  ) as Team | null;

  const { isLoading: isSiteLoading, data: sites } =
    useGetSearchConsoleSitesQuery(undefined);

  const [
    createReport,
    {
      isLoading: isReportLoading,
      isSuccess: isReportSuccess,
      error: reportError,
      isError,
    },
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
      createReport({
        startDate,
        endDate,
        domain,
        dimensions: ["query", "page"],
        notify: "true",
      });
    }
  };

  return (
    <ModalStepWrapper isOpen={isOpen} onClose={onClose}>
      <Stack spacing={6} pointerEvents={isDisabled ? "none" : "auto"}>
        <Heading fontSize="lg">
          4. Google Search Console Report for {activeTeam?.name}
        </Heading>
        <Text fontSize="xs" opacity={0.5}>
          {isDisabled
            ? "You need to connect to Google Search Console to use this automation"
            : "Get the search console report sent to info@getbaser.com"}
        </Text>
        <Stack opacity={isDisabled ? 0.25 : 1}>
          <HStack>
            <Stack w="full">
              <Text fontSize="sm" fontWeight="semibold">
                Start Date:
              </Text>
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
              <Text fontSize="sm" fontWeight="semibold">
                End Date:
              </Text>
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
            <Text fontSize="sm" fontWeight="semibold">
              Domain
            </Text>
            <Select
              placeholder="Select Site"
              bgColor="white"
              onChange={({ target: { value } }) => setDomain(value)}
              defaultValue={
                activeTeam?.url
                  ? sites?.find(
                      (site) =>
                        activeTeam?.url && site.includes(activeTeam?.url)
                    )
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
                <Text fontSize="sm">
                  Fetching the domainsyou have access to
                </Text>
                <Spinner size="xs" />
              </HStack>
            )}
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
