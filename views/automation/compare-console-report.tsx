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
} from "@chakra-ui/react";
import { Button } from "components/button";
import {
  useGetSearchConsoleSitesQuery,
  useCompareSearchConsoleReportMutation,
} from "api/vendor.api";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Team } from "types";

interface Props {
  isDisabled?: boolean;
}

export const CompareConsoleReport: React.FC<Props> = ({ isDisabled }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [page, setPage] = useState<string | null>(null);

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const toast = useToast();

  const { data: sites } = useGetSearchConsoleSitesQuery(undefined);

  const [
    compareReport,
    { isLoading: isComparing, isSuccess: hasComparedSuccessfully, error },
  ] = useCompareSearchConsoleReportMutation();

  useEffect(() => {
    if (!isComparing && hasComparedSuccessfully) {
      toast({
        title: "Success",
        description: "Report created successfully. Check your Email.",
        status: "success",
        isClosable: true,
      });
    }

    if (!isComparing && error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        isClosable: true,
      });
    }
  }, [isComparing, hasComparedSuccessfully, toast, error]);

  const handleGetReport = () => {
    if (page && startDate && endDate && domain && activeTeam) {
      compareReport({
        startDate,
        endDate,
        domain,
        payload: {
          page,
          team: activeTeam.id,
        },
      });
    }
  };

  return (
    <Stack spacing={6} pointerEvents={isDisabled ? "none" : "auto"}>
      <Heading fontSize="lg">
        5. Compare Console Report for {activeTeam?.name}
      </Heading>
      <Text fontSize="xs" opacity={0.5}>
        Compare the Search Console Results whether the keywords exist on a
        specific page. The output will be an email sent to info@getbaser.com
      </Text>
      <Stack spacing={6}>
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
            onChange={({ target: { value } }) => {
              setDomain(value);
              if (!page || page.length < 1) {
                setPage(value);
              }
            }}
          >
            {sites?.map((site, idx) => (
              <option key={idx} value={site}>
                {site}
              </option>
            ))}
          </Select>
        </Stack>
        <Stack>
          <Text fontSize="sm" fontWeight="semibold">
            Page
          </Text>
          <Input
            bgColor="white"
            value={page || ""}
            onChange={({ target: { value } }) => setPage(value)}
            placeholder="https://yoursite.com/your-page"
          />
        </Stack>
      </Stack>
      <Flex justifyContent="flex-end">
        <Button
          size="sm"
          onClick={handleGetReport}
          isDisabled={
            !startDate || !endDate || !sites || !page || page.length < 1
          }
          isLoading={isComparing}
        >
          Compare Report
        </Button>
      </Flex>
    </Stack>
  );
};
