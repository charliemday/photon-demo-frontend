import { FC, useState } from "react";
import StepWizard from "react-step-wizard";
import { Task } from "types";
import { TaskCreate, TaskItem, TaskList } from "views/automation/steps/tasks";
import { ModalStepWrapper } from "../modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: FC<Props> = (props) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  return (
    <ModalStepWrapper
      {...props}
      size="6xl"
      contentProps={{
        overflow: "hidden",
      }}
    >
      <StepWizard>
        <TaskList setSelectedTask={setSelectedTask} stepName="Task List" />
        <TaskItem task={selectedTask} stepName="Edit Task" />
        <TaskCreate stepName="Create Task" />
      </StepWizard>
    </ModalStepWrapper>
  );
};
