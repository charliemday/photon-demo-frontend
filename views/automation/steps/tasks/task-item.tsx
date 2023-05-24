import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  useDeleteTaskMutation,
  useListStatusesQuery,
  useListTasksQuery,
  useListTaskTypesQuery,
  useUpdateTaskMutation,
} from "api/tasks.api";
import { Button } from "components/button";
import { ConfirmationModal } from "components/modals";
import { useActiveTeam } from "hooks";
import { FC, useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { CreateUpdateTask, Task, TaskType } from "types";
import { typeCheckError } from "utils";

interface Props extends Partial<StepWizardChildProps> {
  task: Task | null;
}

export const TaskItem: FC<Props> = ({ task, previousStep, isActive }) => {
  const activeTeam = useActiveTeam();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { data: taskTypes } = useListTaskTypesQuery();
  const { data: taskStatuses } = useListStatusesQuery();
  const { refetch: refetchTasks } = useListTasksQuery(
    {
      teamId: activeTeam?.id || 0,
    },
    {
      skip: !activeTeam,
    },
  );

  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType | null>(null);
  const [status, setStatus] = useState("");

  const toast = useToast();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setType(task.taskType);
      setStatus(task.status.name);
    }
    if (!isActive) {
      setTitle("");
      setType(null);
      setStatus("");
    }
  }, [task, isActive]);

  const handleUpdateTask = () => {
    const formValues: Partial<CreateUpdateTask> = {
      title,
      taskType: type?.id,
      status,
    };
    updateTask({
      taskId: task?.id || 0,
      body: formValues,
    })
      .then(() => {
        refetchTasks();
        toast({
          title: "Task updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((e) => {
        toast({
          title: typeCheckError(e) || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleDeleteTask = () => {
    onClose();

    if (task?.id) {
      deleteTask(task.id)
        .then(() => {
          refetchTasks();
          toast({
            title: "Task deleted successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          previousStep && previousStep();
        })
        .catch((e) => {
          toast({
            title: typeCheckError(e) || "Something went wrong",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  if (!task) return null;

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
            placeholder={task.title}
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
            defaultValue={type?.id}
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
            Status
          </FormLabel>
          <Select defaultValue={status} onChange={(e) => setStatus(e.target.value)}>
            {taskStatuses?.map(({ name, label }, key) => (
              <option key={key} value={name}>
                {label}
              </option>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <HStack justifyContent="space-between">
        <Button size="sm" onClick={previousStep}>
          Back
        </Button>
        <HStack>
          <Button size="sm" onClick={handleUpdateTask} isLoading={isUpdating}>
            Update
          </Button>
          <Button bgColor="red" size="sm" onClick={onOpen} isLoading={isDeleting}>
            Delete
          </Button>
        </HStack>
      </HStack>
      <ConfirmationModal
        title="Delete Task"
        body="Are you sure you want to delete this task?"
        handleConfirm={handleDeleteTask}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Stack>
  );
};
