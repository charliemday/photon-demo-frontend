import { useUserDetailsQuery } from "api/user.api";
import { SidebarLayout } from "components/layouts";
import React from "react";
import { DashboardView } from "views/dashboard";

interface Props {}

const Dashboard: React.FC<Props> = () => {
  const { data: user } = useUserDetailsQuery(undefined);

  const firstName = user?.firstName;
  const lastName = user?.lastName;

  const fullName = user ? `${firstName} ${lastName}` : "";

  return (
    <SidebarLayout
      headerTitle="Baser | Dashboard"
      title={`Welcome your SEO Dashboard, ${fullName}`}
    >
       
      <DashboardView />
    </SidebarLayout>
  );
};

export default Dashboard;
