import { useUserDetailsQuery } from "api/user.api";
import { SidebarLayout } from "components/layouts";
import { FC } from "react";
import { DashboardView } from "views/dashboard";

const Dashboard: FC = () => {
  const user = useUserDetailsQuery(undefined);

  const firstName = user.data?.firstName;
  const lastName = user.data?.lastName;
  const fullName = `${firstName} ${lastName}`;

  return (
    <SidebarLayout headerTitle="Baser | Dashboard" title={`Welcome, ${fullName} 👋!`}>
      <DashboardView />
    </SidebarLayout>
  );
};

export default Dashboard;
