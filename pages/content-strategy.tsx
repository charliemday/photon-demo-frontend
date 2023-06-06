import { FeatureWrapper, SidebarLayout } from "components/layouts";
import { FC } from "react";
import { Features } from "types";
import { ConstructionView } from "views/construction";

const ContentStrategy: FC = () => {
  return (
    <SidebarLayout headerTitle="Baser | Content Strategy" title="Build your Content Strategy">
      <FeatureWrapper restrictedFeatures={[Features.CONTENT_STRATEGY_WIZARD]}>
        <ConstructionView text="🏗️ Content Strategy coming soon!" />
      </FeatureWrapper>
       
    </SidebarLayout>
  );
};

export default ContentStrategy;
