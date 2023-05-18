import { useUserDetailsQuery } from "api/user.api";
import { SidebarLayout } from "components/layouts";
import { FC } from "react";
import { ContentStrategyView } from "views/content-strategy";

const ContentStrategy: FC = () => {
  const user = useUserDetailsQuery(undefined);

  const firstName = user.data?.firstName;
  const lastName = user.data?.lastName;
  const fullName = `${firstName} ${lastName}`;

  return (
    <SidebarLayout headerTitle="Baser | ContentStrategy" title="Under Construction 🏗️">
       
      <ContentStrategyView />
    </SidebarLayout>
  );
};

export default ContentStrategy;
