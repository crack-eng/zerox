import { useState } from "react";
import { ListPayments } from "./payments/list-payments";
import { NewPayment } from "./payments/new-payment";

type State = "LIST_PAYMENTS" | "NEW_PAYMENT" | "CONFIRM_PAYMENT";

export const Payments = () => {
  const [state, setState] = useState<State>("LIST_PAYMENTS");

  return {
    LIST_PAYMENTS: (
      <ListPayments setNewPaymentState={() => setState("NEW_PAYMENT")} />
    ),
    NEW_PAYMENT: (
      <NewPayment
        setListPaymentsState={() => setState("LIST_PAYMENTS")}
        setConfirmPaymentState={() => setState("CONFIRM_PAYMENT")}
      />
    ),
    CONFIRM_PAYMENT: null,
  }[state];
};
