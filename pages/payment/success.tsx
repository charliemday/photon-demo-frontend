import { SidebarLayout } from "components/layouts";
import { WORD_SEEK } from "config";
import React from "react";

import { PaymentSuccessView } from "views/payment";

const PaymentSuccess: React.FC = () => (
  <SidebarLayout headerTitle={`${WORD_SEEK} | Payment Success`} title="">
    <PaymentSuccessView />
  </SidebarLayout>
);

export default PaymentSuccess;
