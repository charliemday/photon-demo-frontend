import { SidebarLayout } from "components/layouts";
import React from "react";
import { ReportsView } from "views/reports";

interface Props {}

const Reports: React.FC<Props> = () => (
  <SidebarLayout title="Welcome to your SEO Reports">
    <ReportsView />
  </SidebarLayout>
);

export default Reports;
