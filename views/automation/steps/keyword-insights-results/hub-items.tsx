import React, { useMemo } from "react";
import { StepWizardChildProps } from "react-step-wizard";

import { CSVLink } from "react-csv";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Select,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { Legend } from "components/legend";
import { BsDownload } from "react-icons/bs";

import { useEffect, useState } from "react";

import { Team } from "types";

import {
  KeywordItem,
  useKeywordInsightsOrderQuery,
  useKeywordInsightsResultsQuery,
} from "api/engine.api";
import { useActiveContentStrategy, useActiveTeam } from "hooks";
import { useRef } from "react";

interface Props extends Partial<StepWizardChildProps> {
  isOpen: boolean;
  onClick: (hub: string, spoke: string, theme: string, keywordItems: KeywordItem[]) => void;
}

export const HubItems: React.FC<Props> = (props) => {
  const [orderId, setOrderId] = useState<number | null>(null);
  const [selectedHubName, setSelectedHubName] = useState<string | null>(null);

  const csvData = useRef<any>([]);

  const activeTeam: Team = useActiveTeam();
  const activeContentStrategy = useActiveContentStrategy();

  const { data: output } = useKeywordInsightsOrderQuery(activeContentStrategy?.id, {
    skip: !activeContentStrategy?.id,
  });

  useEffect(() => {
    if (output && output.length) {
      setOrderId(output[0].id);
    }
  }, [output]);

  const { data: results, refetch: refetchResults } = useKeywordInsightsResultsQuery(
    {
      // @ts-ignore
      orderId,
    },
    {
      skip: orderId === null || !activeTeam?.id,
    },
  );

  useEffect(() => {
    if (orderId) {
      refetchResults();
    }
  }, [orderId, refetchResults]);

  const buildExportData = () => {
    const csvData: string[][] = [["Hub", "Spoke", "Theme"]];

    results?.forEach(({ hub, hub_data }) => {
      Object.keys(hub_data).forEach((key) => {
        Object.keys(hub_data[key]).forEach((k) => {
          csvData.push([hub, key, k]);
        });
      });
    });

    return csvData;
  };

  const resultCount = useMemo(() => {
    const hubCount = results?.length;
    let spokeCount = 0;
    let themeCount = 0;
    let keywordCount = 0;

    if (results?.length) {
      results.forEach((result) => {
        spokeCount += Object.keys(result.hub_data).length;
        Object.keys(result.hub_data).forEach((key) => {
          themeCount += Object.keys(result.hub_data[key]).length;
          Object.keys(result.hub_data[key]).forEach((k) => {
            keywordCount += result.hub_data[key][k].length;
          });
        });
      });
    }

    return {
      hubCount,
      spokeCount,
      themeCount,
      keywordCount,
    };
  }, [results]);

  const legendData = useMemo(
    () => [
      {
        label: `Hub (${resultCount?.hubCount || ""})`,
        color: "#C6F6D5",
      },
      {
        label: `Spoke (${resultCount?.spokeCount || ""})`,
        color: "#BEE3F8",
      },
      {
        label: `Theme (${resultCount?.themeCount || ""})`,
        color: "#FEEBC8",
      },
    ],
    [resultCount],
  );

  return (
    <Stack>
      <HStack justifyContent="space-between">
        <Flex>
          <Select
            placeholder="Select an output"
            size="sm"
            onChange={(e) => {
              setOrderId(parseInt(e.target.value));
              setSelectedHubName(
                output?.find((d) => d.id === parseInt(e.target.value))?.orderId || null,
              );
            }}
          >
            {output?.map((d, key) => {
              return (
                <option key={key} value={d.id}>
                  {d.orderId}
                </option>
              );
            })}
          </Select>
        </Flex>
        <Flex>
          <CSVLink
            data={buildExportData()}
            filename="word-seek-results.csv"
            ref={(r: any) => (csvData.current = r)}
          />
          <Button
            onClick={() => {
              csvData.current.link.click();
            }}
            size="sm"
          >
            Export
            <Box ml={2}>
              <BsDownload />
            </Box>
          </Button>
        </Flex>
      </HStack>

      <Box py={4}>
        <Legend data={legendData} />
      </Box>

      <Text fontSize="sm" fontWeight="semibold" pb={4}>
        {resultCount?.keywordCount > 0
          ? `${resultCount.keywordCount} keyword${
              resultCount.keywordCount > 1 ? "s" : ""
            } classified`
          : "No keywords found"}
      </Text>

      <Stack maxW="auto">
        {results?.length ? (
          <Accordion>
            {results?.map(({ hub, hub_data }, key) => (
              <AccordionItem key={key}>
                <AccordionButton>
                  <HStack justifyContent="space-between" w="full">
                    <Tag
                      key={key}
                      maxW="auto"
                      cursor="pointer"
                      title={hub}
                      colorScheme="green"
                      size="lg"
                    >
                      {hub}
                    </Tag>
                    <AccordionIcon />
                  </HStack>
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Stack w="auto">
                    <Accordion>
                      {Object.keys(hub_data).map((key, index) => (
                        <AccordionItem key={index}>
                          <AccordionButton>
                            <HStack justifyContent="space-between" w="full">
                              <Tag colorScheme="blue">{key}</Tag>
                              <AccordionIcon />
                            </HStack>
                          </AccordionButton>

                          <AccordionPanel pb={4}>
                            <Stack>
                              {Object.keys(hub_data[key]).map((themeKey, index) => (
                                <HStack key={index} alignItems="center">
                                  <Tag
                                    colorScheme="orange"
                                    cursor="pointer"
                                    _hover={{
                                      boxShadow: "0 0 0 2px #68D391",
                                    }}
                                    onClick={() => {
                                      props.onClick(hub, key, themeKey, hub_data[key][themeKey]);
                                      props.nextStep?.();
                                    }}
                                  >
                                    {themeKey}
                                  </Tag>
                                </HStack>
                              ))}
                            </Stack>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Stack py={6}>
            <Text>No results found {selectedHubName ? `for ${selectedHubName}` : ""}</Text>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
