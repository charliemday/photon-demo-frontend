import { Skeleton, Stack, useDisclosure } from "@chakra-ui/react";
import { useRetrieveTaskQuery } from "api/tasks.api";
import { FC } from "react";
import { Blog, TaskTypeSlugEnum } from "types";
import { GscConnectModal } from "views/word-seek";
import { BlogTask, OnboardingTask } from "./task_types";

interface Props {
  taskId: number;
}

export const TaskView: FC<Props> = ({ taskId }) => {
  const { data: task, isLoading } = useRetrieveTaskQuery(taskId, {
    skip: !taskId,
  });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const taskType = task?.taskType?.slug;

  const renderContent = () => {
    if (taskType === TaskTypeSlugEnum.blog) {
      return <BlogTask blog={task?.content as Blog} />;
    }

    if (taskType === TaskTypeSlugEnum.onboarding) {
      return <OnboardingTask />;
    }

    if (taskType === TaskTypeSlugEnum.gsc) {
      if (!isOpen) {
        onOpen();
      }
    }

    return null;
  };

  const renderSkeleton = () => {
    return (
      <Stack minW="40vw" spacing={6}>
        <Skeleton height="80px" borderRadius="md" />
        <Skeleton height="80px" borderRadius="md" />
        <Skeleton height="80px" borderRadius="md" />
      </Stack>
    );
  };

  return (
    <>
      <Stack w="full">{isLoading ? renderSkeleton() : renderContent()}</Stack>
      <GscConnectModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
