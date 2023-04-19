import { FC, useEffect, useState } from "react";
import { ModalStepWrapper } from "../modal-step-wrapper";

import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";
import { RootState, Team } from "types";

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
} from "@chakra-ui/react";
import {
  useKeywordInsightsOutputQuery,
  useKeywordInsightsResultsQuery,
} from "api/engine.api";
import { Button } from "components/button";
import { Legend } from "components/legend";
import { useRef } from "react";
import { BsDownload } from "react-icons/bs";
import StepWizard from "react-step-wizard";
import { HubItems } from "./hub-items";
import { KeywordItems } from "./keyword-items";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LEGEND_DATA = [
  {
    label: "Hub",
    color: "#C6F6D5",
  },
  {
    label: "Spoke",
    color: "#BEE3F8",
  },
  {
    label: "Theme",
    color: "#FEEBC8",
  },
];

export const KeywordInsightsResults: FC<Props> = (props) => {
  const [parentId, setParentId] = useState<number | null>(null);

  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [selectedSpoke, setSelectedSpoke] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const csvData = useRef<any>([]);

  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  const { data: output, refetch } = useKeywordInsightsOutputQuery(
    activeTeam?.id,
    {
      skip: !activeTeam?.id,
    }
  );

  useEffect(() => {
    if (output && output.length) {
      setParentId(output[0].id);
    }
  }, [output]);

  useEffect(() => {
    if (props.isOpen) {
      refetch();
    }
  }, [props.isOpen, refetch]);

  const { data: results } = useKeywordInsightsResultsQuery(
    {
      // @ts-ignore
      parentId,
      teamId: activeTeam?.id,
    },
    {
      skip: parentId === null || !activeTeam?.id,
    }
  );

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

  const renderHubs = () => (
    <Stack>
      <HStack justifyContent="space-between">
        <Flex>
          <Select placeholder="Select an output" size="sm">
            {output?.map((d, key) => {
              const date = new Date(d.created);
              const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <option key={key} value={d.id}>
                  Keyword Insights Output on {formattedDate}
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
        <Legend data={LEGEND_DATA} />
      </Box>

      <Stack maxW="auto">
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
                            {Object.keys(hub_data[key]).map((key, index) => (
                              <HStack key={index} alignItems="center">
                                <Tag
                                  colorScheme="orange"
                                  cursor="pointer"
                                  _hover={{
                                    boxShadow: "0 0 0 2px #68D391",
                                  }}
                                >
                                  {key}
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
      </Stack>
    </Stack>
  );

  if (!parentId) return null;

  return (
    <ModalStepWrapper
      {...props}
      contentProps={{
        overflow: "hidden",
      }}
    >
      <StepWizard>
        {/* {renderHubs()}
        {renderKeywords()} */}
        <HubItems
          isOpen={props.isOpen}
          onClick={(hub, spoke, theme, keywords) => {
            setSelectedHub(hub);
            setSelectedSpoke(spoke);
            setSelectedTheme(theme);
            setSelectedKeywords(keywords);
          }}
        />
        <KeywordItems
          parentId={parentId}
          keywords={selectedKeywords}
          hub={selectedHub}
          theme={selectedTheme}
          spoke={selectedSpoke}
        />
      </StepWizard>
    </ModalStepWrapper>
  );
};
