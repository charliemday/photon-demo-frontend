import { AdminWrapper, MainLayout } from "components/layouts";
import React from "react";
import { AutomationView } from "views/automation";

const Automation: React.FC = () => (
  <MainLayout>
    <AdminWrapper>
      <AutomationView />
    </AdminWrapper>
  </MainLayout>
);

export default Automation;
