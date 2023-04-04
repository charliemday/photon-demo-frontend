import { SidebarLayout } from "components/layouts";
import React from "react";
import { PaymentCancelledView } from "views/payment";

interface Props {}

const PaymentCancelled: React.FC<Props> = () => (
  <SidebarLayout headerTitle="Baser | Payment" title="">
    <PaymentCancelledView />
  </SidebarLayout>
);

export default PaymentCancelled;
