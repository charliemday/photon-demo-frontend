import { Skeleton, Stack, useDisclosure } from "@chakra-ui/react";
import { useRetrieveTaskQuery } from "api/tasks.api";
import { ROUTES } from "config";
import { useRouter } from "next/router";
import { FC } from "react";
import { Blog, TaskTypeSlugEnum } from "types";
import { GscConnectModal } from "views/word-seek/modals";
import { BlogTask } from "./task_types";

interface Props {
  taskId: number;
}

export const TaskView: FC<Props> = ({ taskId }) => {
  const { data: task, isLoading } = useRetrieveTaskQuery(taskId, {
    skip: !taskId,
  });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();
  const taskType = task?.taskType?.slug;

  const renderContent = () => {
    if (taskType === TaskTypeSlugEnum.blog) {
      return <BlogTask blog={task?.content as Blog} />;
    }

    if (taskType === TaskTypeSlugEnum.onboarding) {
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
      <GscConnectModal
        isOpen={isOpen}
        onClose={onClose}
        onComplete={() => router.push(ROUTES.DASHBOARD)}
      />
    </>
  );
};
