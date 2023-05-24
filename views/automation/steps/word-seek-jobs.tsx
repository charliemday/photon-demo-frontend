import {
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
import { FC, useEffect, useState } from "react";
import { ellipsizeText, typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const headers = ["Page", "Job Type", "Job Status", "Team/Workspace", "User"];

export const WordSeekJobs: FC<Props> = (props) => {
  const toast = useToast();
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const { data: wordSeekJobs, isLoading, isError, error, refetch } = useWordSeekJobsQuery();
  const [triggerJob, { isLoading: isTriggering, error: triggeredError }] =
    useReRunWordSeekJobMutation();

  useEffect(() => {
    if (props.isOpen) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    if (!isLoading) {
      if (isError && error) {
        toast({
          title: typeCheckError(error) || "An error occurred.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [isLoading, error, toast, isError]);

  const handleTriggerJob = (jobId: number) => {
    setSelectedJob(jobId);
    triggerJob({ jobId }).then((res) => {
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

  const renderJobType = (jobType: string) => {
    if (jobType === "single_page") {
      return <Text>Single Page</Text>;
    }

    if (jobType === "full_site") {
      return <Text>Full Site</Text>;
    }
  };

  return (
    <ModalStepWrapper {...props} size="6xl" showContentStrategy={false}>
      <Stack>
        {wordSeekJobs?.length ? (
          <TableContainer>
            <Table variant="simple">
              <TableCaption>All Word Seek jobs that have not completed</TableCaption>
              <Thead>
                <Tr>
                  {headers.map((header, key) => (
                    <Th key={key}>{header}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {wordSeekJobs?.map((job, key) => (
                  <Tr key={key}>
                    <Td>
                      <Tooltip label={job.page} hasArrow>
                        <Text isTruncated>{ellipsizeText(job.page, 30)}</Text>
                      </Tooltip>
                    </Td>
                    <Td>{renderJobType(job.jobType)}</Td>
                    <Td>{renderStatus(job.jobStatus)}</Td>
                    <Td>{job.team.name}</Td>
                    <Td>{`${job.user.firstName} ${job.user.firstName}`}</Td>
                    <Td>
                      <Button
                        size="sm"
                        onClick={() => handleTriggerJob(job.id)}
                        isLoading={isTriggering && selectedJob === job.id}
                      >
                        Re-run Job
                      </Button>
                    </Td>
                  </Tr>
                ))}
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
