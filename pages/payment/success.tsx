import { SidebarLayout } from "components/layouts";
import React from "react";

import { PaymentSuccessView } from "views/payment";

interface Props {}

const PaymentSuccess: React.FC<Props> = () => (
  <SidebarLayout headerTitle="Baser | Payment Success" title="">
    <PaymentSuccessView />
  </SidebarLayout>
);

export default PaymentSuccess;
