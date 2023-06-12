import {
  Box,
  Progress,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useReRunWordSeekJobMutation, useWordSeekJobsQuery } from "api/engine.api";
import { Button } from "components/button";
import { Body } from "components/text";
import { FC, useEffect, useState } from "react";
import { ellipsizeText, typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const headers = ["Site", "Job Progress", "Team/Workspace", "User", "Job Started"];

export const WordSeekJobs: FC<Props> = (props) => {
  const toast = useToast();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const { data: wordSeekJobs, isLoading, isError, error, refetch } = useWordSeekJobsQuery();
  const [triggerJob, { isLoading: isTriggering, error: triggeredError }] =
    useReRunWordSeekJobMutation();

  useEffect(() => {
    if (props.isOpen) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const handleTriggerJob = (jobGroupUuid: string) => {
    setSelectedJob(jobGroupUuid);
    triggerJob({ jobGroupUuid }).then((res) => {
      if ("error" in res) {
        toast({
          title: typeCheckError(triggeredError) || "An error occurred.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Job triggered successfully",
          status: "success",
          duration: 9000,
        });
      }
    });
  };

  const renderStatus = (status: string) => {
    if (status === "in_progress") {
      return (
        <Tooltip
          label="This job is currently in progress and may not have been completed."
          hasArrow
        >
          <Text color="blue.500">⌛ In Progress</Text>
        </Tooltip>
      );
    }

    if (status === "incomplete") {
      return (
        <Tooltip label="This job is incomplete and may not have been completed.">
          <Text color="red.500">⛔ Incomplete</Text>
        </Tooltip>
      );
    }
  };

  return (
    <ModalStepWrapper
      {...props}
      size="6xl"
      showContentStrategy={false}
      showTeam={false}
      title="👀 Outstanding Word Seek Jobs"
    >
      <Stack>
        {wordSeekJobs?.length ? (
          <TableContainer>
            <Table variant="simple">
              <TableCaption>All Word Seek jobs that have are in progress.</TableCaption>
              <Thead>
                <Tr>
                  {headers.map((header, key) => (
                    <Th key={key}>{header}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {wordSeekJobs?.map(({ progress, jobsRemaining, site }, key) => {
                  const user = jobsRemaining[0].user;
                  const team = jobsRemaining[0].team;
                  const jobGroupUuid = jobsRemaining[0].jobGroupUuid;
                  const dateStarted = jobsRemaining[0].created;

                  return (
                    <Tr key={key}>
                      <Td>
                        <Tooltip label={site} hasArrow>
                          <Box>
                            <Body isTruncated>{ellipsizeText(site, 30)}</Body>
                          </Box>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip label={`Job is ${progress * 100}% complete`} hasArrow>
                          <Progress value={progress * 100} borderRadius="sm" />
                        </Tooltip>
                      </Td>
                      <Td>
                        <Body>{team.name}</Body>
                      </Td>
                      <Td>
                        <Body>{`${user.firstName} ${user.firstName}`}</Body>
                      </Td>
                      <Td>
                        <Body>
                          {new Date(dateStarted).toLocaleDateString("en-GB", {
                            hour: "numeric",
                            minute: "numeric",

                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour12: true,
                          })}
                        </Body>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          onClick={() => handleTriggerJob(jobGroupUuid)}
                          isLoading={isTriggering && selectedJob === jobGroupUuid}
                        >
                          Resume Job
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Text textAlign="center" fontSize="lg" fontWeight="bold" py={12}>
            🥳 No outstanding jobs
          </Text>
        )}
      </Stack>
    </ModalStepWrapper>
  );
};
