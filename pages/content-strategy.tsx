import { FeatureWrapper, SidebarLayout } from "components/layouts";
import { FC } from "react";
import { Features } from "types";

const ContentStrategy: FC = () => {
  return (
    <SidebarLayout headerTitle="Baser | Content Strategy" title="Build your Content Strategy">
      <FeatureWrapper restrictedFeatures={[Features.CONTENT_STRATEGY_WIZARD]}>
        <h1>Content Strategy Page</h1>
      </FeatureWrapper>
       
    </SidebarLayout>
  );
};

export default ContentStrategy;
