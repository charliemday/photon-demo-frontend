import { useUserDetailsQuery } from "api/user.api";
import { FeatureWrapper, SidebarLayout } from "components/layouts";
import { FC } from "react";
import { Features } from "types";
import { DashboardView } from "views/dashboard";

const Dashboard: FC = () => {
  const user = useUserDetailsQuery(undefined);

  const firstName = user.data?.firstName;
  const lastName = user.data?.lastName;
  const fullName = `${firstName} ${lastName}`;

  let title = `Welcome, ${fullName} 👋!`;

  if (!firstName && !lastName) {
    title = "Welcome to Baser 👋!";
  }

  return (
    <SidebarLayout headerTitle="Baser | Dashboard" title={title}>
      <FeatureWrapper restrictedFeatures={[Features.CONTENT_STRATEGY_WIZARD]}>
        <DashboardView />
      </FeatureWrapper>
    </SidebarLayout>
  );
};

export default Dashboard;
