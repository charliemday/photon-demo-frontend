import { SidebarLayout } from "components/layouts";
import React from "react";
import { KeywordsView } from "views/keywords";

interface Props {}

const Keywords: React.FC<Props> = () => (
  <SidebarLayout title="Welcome to your SEO Keywords">
    <KeywordsView />
  </SidebarLayout>
);

export default Keywords;
