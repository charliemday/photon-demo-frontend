import { HStack, Stack } from "@chakra-ui/react";
import { useListTasksQuery } from "api/tasks.api";
import { Button } from "components/button";
import { Table } from "components/table";
import { HeaderItem } from "components/table/table.header";
import { RowItemTypes } from "components/table/table.row";
import { useActiveTeam } from "hooks";
import React, { useMemo } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { Task } from "types";

interface Props extends Partial<StepWizardChildProps> {
  setSelectedTask: (task: Task) => void;
}

const rowHeaders: HeaderItem[] = [
  {
    text: "SEO Task",
    flex: 3,
  },
  {
    text: "Type",
    flex: 2,
  },
  {
    text: "Assignee",
    flex: 1,
  },
  {
    text: "Month",
  },
  {
    text: "Status",
  },
];

export const TaskList: React.FC<Props> = ({ nextStep, setSelectedTask, goToNamedStep }) => {
  const activeTeam = useActiveTeam();

  const { data: taskData, isLoading } = useListTasksQuery(
    {
      teamId: activeTeam?.id || 0,
    },
    {
      skip: !activeTeam,
    },
  );

  const rowItems = useMemo(() => {
    return taskData?.map((task) => {
      const {
        title,
        id,
        taskType: { name },
        assignee: { firstName, lastName },
        status,
        created,
      } = task;
      const date = created ? new Date(created) : null;
      const dateString = date
        ? date.toLocaleDateString("default", {
            month: "short",
          })
        : "";

      const rowData = [
        {
          text: title,
          type: RowItemTypes.text,
          flex: 3,
        },
        {
          text: name,
          type: RowItemTypes.tag,
          flex: 2,
        },
        {
          text: `${firstName} ${lastName}`,
          type: RowItemTypes.avatar,
        },
        {
          text: dateString,
          type: RowItemTypes.tag,
        },
        {
          text: status.value,
          type: RowItemTypes.tag,
        },
      ];

      return {
        rowData,
        rowClick: () => {
          setSelectedTask(task);
          nextStep && nextStep();
        },
      };
    });
  }, [taskData, nextStep, setSelectedTask]);

  return (
    <Stack>
      <Table
        headers={rowHeaders}
        emptyText="This team has no tasks"
        isLoading={isLoading}
        rowItems={rowItems}
      />
      <HStack>
        <Button size="sm" onClick={() => goToNamedStep && goToNamedStep("Create Task")}>
          Create Task
        </Button>
      </HStack>
    </Stack>
  );
};
