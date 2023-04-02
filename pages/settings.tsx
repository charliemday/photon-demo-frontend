import { SidebarLayout } from "components/layouts";
import React from "react";
import { SettingsView } from "views/settings";

interface Props {}

const Settings: React.FC<Props> = () => {
  return (
    <SidebarLayout headerTitle="Baser | Settings" title={`Settings`}>
      <SettingsView />
    </SidebarLayout>
  );
};

export default Settings;
