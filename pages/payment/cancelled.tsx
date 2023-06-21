import { SidebarLayout } from "components/layouts";
import { WORD_SEEK } from "config";
import React from "react";
import { PaymentCancelledView } from "views/payment";

const PaymentCancelled: React.FC = () => (
  <SidebarLayout headerTitle={`${WORD_SEEK} | Payment Cancelled`} title="">
    <PaymentCancelledView />
  </SidebarLayout>
);

export default PaymentCancelled;
