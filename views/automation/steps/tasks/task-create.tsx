import { FormControl, FormLabel, HStack, Input, Select, Stack, useToast } from "@chakra-ui/react";
import {
  useCreateTaskMutation,
  useListStatusesQuery,
  useListTasksQuery,
  useListTaskTypesQuery,
} from "api/tasks.api";
import { useTeamMembersQuery } from "api/team.api";
import { Button } from "components/button";
import { useActiveTeam } from "hooks";
import { FC, useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { TaskType } from "types";
import { typeCheckError } from "utils";

interface Props extends Partial<StepWizardChildProps> {}

export const TaskCreate: FC<Props> = ({ goToNamedStep }) => {
  const activeTeam = useActiveTeam();
  const toast = useToast();

  const { data: taskTypes } = useListTaskTypesQuery();
  const { data: taskStatuses } = useListStatusesQuery();
  const { data: teamMembers } = useTeamMembersQuery(
    {
      teamId: activeTeam?.id || 0,
    },
    {
      skip: !activeTeam,
    },
  );
  const { refetch: refetchTasks } = useListTasksQuery(
    {
      teamId: activeTeam?.id || 0,
    },
    {
      skip: !activeTeam,
    },
  );

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType | null>(null);
  const [status, setStatus] = useState<string | null>("");
  const [assignee, setAssignee] = useState<number | null>(null);

  useEffect(() => {
    if (teamMembers && teamMembers?.length) {
      setAssignee(teamMembers[0].user.id);
    }

    if (taskStatuses && taskStatuses?.length) {
      setStatus(taskStatuses[0].name);
    }

    if (taskTypes && taskTypes?.length) {
      setType(taskTypes[0]);
    }
  }, [teamMembers, taskStatuses, taskTypes]);

  const handleCreateTask = () => {
    if (!assignee || !status || !type) return;

    const formValues = {
      title,
      taskType: type?.id,
      status,
      team: activeTeam?.id,
      assignee,
    };

    createTask({
      body: formValues,
      teamId: activeTeam?.id || 0,
    })
      .then((res) => {
        if ("error" in res) {
          toast({
            title: typeCheckError(res.error) || "Something went wrong.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Task created.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          refetchTasks();
          goToNamedStep && goToNamedStep("Task List");
        }
      })
      .catch((e) => {
        toast({
          title: typeCheckError(e) || "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  if (teamMembers?.length == 0) {
    return null;
  }

  return (
    <Stack w="75%" m="auto">
      <Stack
        background="white"
        width="100%"
        p="20px"
        borderRadius="8px"
        borderColor="#ECECEC"
        borderWidth="1px"
        justify="space-between"
        spacing="20px"
        m="auto"
      >
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="semibold">
            Title
          </FormLabel>
          <Input
            placeholder="e.g. Your first blog post"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="semibold">
            Type
          </FormLabel>
          <Select
            onChange={({ target: { value } }) =>
              setType(taskTypes?.find((taskType) => taskType.id === Number(value)) || null)
            }
          >
            {taskTypes?.map((taskType) => (
              <option key={taskType.id} value={taskType.id}>
                {taskType.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="semibold">
            Assignee
          </FormLabel>
          <Select
            onChange={(e) => {
              setAssignee(Number(e.target.value));
            }}
            defaultValue={assignee || 0}
          >
            {teamMembers?.map(({ user: { id, name } }, key) => (
              <option key={key} value={id}>
                {name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="semibold">
            Status
          </FormLabel>
          <Select defaultValue={status || ""} onChange={(e) => setStatus(e.target.value)}>
            {taskStatuses?.map(({ name, label }, key) => (
              <option key={key} value={name}>
                {label}
              </option>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <HStack justifyContent="space-between">
        <Button size="sm" onClick={() => goToNamedStep && goToNamedStep("Task List")}>
          Back
        </Button>
        <HStack>
          <Button size="sm" onClick={handleCreateTask} isLoading={isCreating}>
            Create
          </Button>
        </HStack>
      </HStack>
    </Stack>
  );
};
