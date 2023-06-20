import { FeatureWrapper, SidebarLayout } from "components/layouts";
import { FC } from "react";
import { ConstructionView } from "views/construction";

const Performance: FC = () => {
  return (
    <SidebarLayout headerTitle="Baser | Performance" title="Performance">
      <FeatureWrapper restrictedFeatures={[]}>
        <ConstructionView text="🏗️ Performance graphs coming soon!" />
      </FeatureWrapper>
       
    </SidebarLayout>
  );
};

export default Performance;
