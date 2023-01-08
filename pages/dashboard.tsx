import React from "react";
import { SidebarLayout } from "components/layouts";
import { DashboardView } from "views/dashboard";

interface Props {}

const Dashboard: React.FC<Props> = () => (
  <SidebarLayout title="Welcome your SEO Dashboard">
    <DashboardView />
  </SidebarLayout>
);

export default Dashboard;
