import {
  createMessage,
  createListener,
  targetOrigin,
} from "#packages/tma";
import { useEffect } from "react";

export type ListPaymentsProps = {
  setNewPaymentState: () => void;
};

export const ListPayments = (props: ListPaymentsProps) => {
  useEffect(() => {
    window.parent.postMessage(
      createMessage("web_app_setup_main_button", {
        is_visible: true,
        is_active: true,
        text: "New Payment",
      }),
      targetOrigin,
    );

    return () => {
      window.parent.postMessage(
        createMessage("web_app_setup_main_button", {
          is_visible: false,
          is_active: false,
        }),
        targetOrigin,
      );
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "message",
      createListener("main_button_pressed", () => {
        props.setNewPaymentState();
      }),
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, []);

  return null;
};
