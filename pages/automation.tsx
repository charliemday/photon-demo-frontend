import { AdminWrapper, MainLayout } from "components/layouts";
import { FC } from "react";
import { AutomationView } from "views/automation";

const Automation: FC = () => (
  <MainLayout>
    <AdminWrapper>
      <AutomationView />
    </AdminWrapper>
  </MainLayout>
);

export default Automation;
