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
import ReactSelect from "react-select";
import {
  useGetSearchConsoleSitesQuery,
  useCompareSearchConsoleReportMutation,
  useGetSearchConsolePagesQuery,
} from "api/vendor.api";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Team } from "types";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isDisabled?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchConsoleCompare: React.FC<Props> = ({
  isDisabled,
  isOpen,
  onClose,
}) => {
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
    {
      isLoading: isComparing,
      isSuccess: hasComparedSuccessfully,
      error,
      isError,
    },
  ] = useCompareSearchConsoleReportMutation();
  const {
    data: pageData,
    refetch: refetchPages,
    isLoading: isFetchingPages,
  } = useGetSearchConsolePagesQuery(
    {
      domain: domain || "",
    },
    {
      skip: !domain,
    }
  );

  useEffect(() => {
    if (!isComparing && hasComparedSuccessfully) {
      toast({
        title: "Success",
        description: "Report created successfully. Check your Email.",
        status: "success",
        isClosable: true,
      });
    }

    if (!isComparing && isError && error) {
      toast({
        title: "Error",
        description: typeCheckError(error) || "Something went wrong.",
        status: "error",
        isClosable: true,
      });
    }
  }, [isComparing, hasComparedSuccessfully, toast, error, isError]);

  useEffect(() => {
    if (domain) {
      refetchPages();
    }
  }, [domain, refetchPages]);

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

  const renderPageSelect = () => {
    const pages = pageData?.pages;

    if (pages && pages?.length) {
      return (
        <ReactSelect
          className="basic-single"
          classNamePrefix="select"
          isSearchable
          name="color"
          onChange={(e: any) => {
            setPage(e.value);
          }}
          options={pages.map((page) => ({
            value: page,
            label: page,
          }))}
        />
      );
    }

    return (
      <Text fontWeight="semibold" opacity={0.25}>
        Select a Domain First
      </Text>
    );
  };

  return (
    <ModalStepWrapper isOpen={isOpen} onClose={onClose}>
      <Stack spacing={6} pointerEvents={isDisabled ? "none" : "auto"}>
        <Heading fontSize="lg">
          5. Compare Console Report for {activeTeam?.name}
        </Heading>
        <Text fontSize="xs" opacity={0.5}>
          {isDisabled
            ? `You need to connect to Google Search Console to use this automation`
            : `Compare the Search Console Results whether the keywords exist on a
        specific page. The output will be an email sent to info@getbaser.com`}
        </Text>
        <Stack spacing={6} opacity={isDisabled ? 0.25 : 1}>
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
              Select a domain
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
              Select a page within the domain
            </Text>
            {renderPageSelect()}
            {isFetchingPages && (
              <HStack opacity={0.5}>
                <Text fontSize="sm">Fetching the pages for {domain}</Text>
                <Spinner size="xs" />
              </HStack>
            )}
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
    </ModalStepWrapper>
  );
};
