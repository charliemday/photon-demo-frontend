import { useRetrieveTaskQuery } from "api/tasks.api";
import { SidebarLayout } from "components/layouts";
import { useRouter } from "next/router";
import { FC } from "react";

const Page: FC = () => {
  const router = useRouter();

  const taskId =
    typeof router.query.taskId === "string" ? parseInt(router.query.taskId) : undefined;

  const { data: task } = useRetrieveTaskQuery(taskId, {
    skip: !taskId,
  });

  return (
    <SidebarLayout headerTitle="Baser | Task" title={`${task?.title}`}>
      {/* <TaskView /> */}
    </SidebarLayout>
  );
};

export default Page;
