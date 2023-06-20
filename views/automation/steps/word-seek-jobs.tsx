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
import { WORD_SEEK } from "config";
import { FC, useEffect, useMemo, useState } from "react";
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

  const { data: wordSeekJobs, refetch } = useWordSeekJobsQuery();
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

  const wordSeekJobsIncomplete = useMemo(
    () => wordSeekJobs?.filter(({ progress }) => progress < 1),
    [wordSeekJobs],
  );

  return (
    <ModalStepWrapper
      {...props}
      size="6xl"
      showContentStrategy={false}
      showTeam={false}
      title={`👀 Outstanding ${WORD_SEEK} Jobs`}
    >
      <Stack>
        {wordSeekJobsIncomplete?.length ? (
          <TableContainer>
            <Table variant="simple">
              <TableCaption>All {WORD_SEEK} jobs that have are in progress.</TableCaption>
              <Thead>
                <Tr>
                  {headers.map((header, key) => (
                    <Th key={key}>{header}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {wordSeekJobsIncomplete?.map(
                  ({ progress, team, site, user, jobGroupUuid, jobCreated }, key) => {
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
                            {new Date(jobCreated).toLocaleDateString("en-GB", {
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
                  },
                )}
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
