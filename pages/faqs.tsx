import { SidebarLayout } from "components/layouts";
import React from "react";
import { FaqsView } from "views/faqs";

interface Props {}

const Faqs: React.FC<Props> = () => (
  <SidebarLayout title="FAQs" headerTitle="Baser | FAQs">
    <FaqsView />
  </SidebarLayout>
);

export default Faqs;
