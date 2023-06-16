import { HStack, Stack } from "@chakra-ui/react";
import { useListTasksQuery } from "api/tasks.api";
import { Button } from "components/button";
import { RowItemTypes, Table } from "components/table";
import { HeaderItem } from "components/table/table.header";
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
        taskType: { name, slug },
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
          value: title,
          type: RowItemTypes.text,
          flex: 3,
        },
        {
          value: name,
          type: RowItemTypes.tag,
          flex: 2,
        },
        {
          value: `${firstName} ${lastName}`,
          type: RowItemTypes.avatar,
        },
        {
          value: dateString,
          type: RowItemTypes.tag,
        },
        {
          value: status.value,
          type: RowItemTypes.tag,
        },
      ];

      return {
        rowData,
        rowType: slug,
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
