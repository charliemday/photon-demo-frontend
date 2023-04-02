import React from "react";
import { PaymentCancelledModal } from "./payment-cancelled.modal";

interface Props {}

export const PaymentCancelledView: React.FC<Props> = () => {
  return (
    <>
      <PaymentCancelledModal />
    </>
  );
};
