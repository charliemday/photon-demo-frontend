import { useRetrieveTaskQuery } from "api/tasks.api";
import { SidebarLayout } from "components/layouts";
import { useBuildTaskBreadcrumbs } from "hooks";
import { useRouter } from "next/router";
import { FC } from "react";
import { TaskView } from "views/task";

const Page: FC = () => {
  const router = useRouter();

  const taskId =
    typeof router.query.taskId === "string" ? parseInt(router.query.taskId) : undefined;

  const { data: task } = useRetrieveTaskQuery(taskId, {
    skip: !taskId,
  });

  const { breadcrumbs } = useBuildTaskBreadcrumbs(task);

  return (
    <SidebarLayout breadcrumbs={breadcrumbs} headerTitle="Baser | Task">
      {taskId ? <TaskView taskId={taskId} /> : <h1>Task not found</h1>}
    </SidebarLayout>
  );
};

export default Page;
