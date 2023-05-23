import { FeatureWrapper, SidebarLayout } from "components/layouts";
import { FC } from "react";
import { Features } from "types";

const Performance: FC = () => {
  return (
    <SidebarLayout headerTitle="Baser | Performance" title="Performance">
      <FeatureWrapper restrictedFeatures={[Features.PERFORMANCE_DASHBOARD]}>
        <h1>Performance Page</h1>
      </FeatureWrapper>
       
    </SidebarLayout>
  );
};

export default Performance;
