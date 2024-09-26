import {
  createMessage,
  createListener,
  targetOrigin,
} from "#packages/tma";
import { useEffect } from "react";

export type NewPaymentProps = {
  setListPaymentsState: () => void;
  setConfirmPaymentState: () => void;
};

export const NewPayment = (props: NewPaymentProps) => {
  useEffect(() => {
    window.parent.postMessage(
      createMessage("web_app_setup_back_button", { is_visible: true }),
      targetOrigin,
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "message",
      createListener("back_button_pressed", () => {
        window.parent.postMessage(
          createMessage("web_app_setup_back_button", { is_visible: false }),
          targetOrigin,
        );
        props.setListPaymentsState();
      }),
    );

    return () => controller.abort();
  }, []);

  useEffect(() => {
    window.parent.postMessage(
      createMessage("web_app_open_scan_qr_popup"),
      targetOrigin,
    );

    return () => {
      window.parent.postMessage(
        createMessage("web_app_close_scan_qr_popup"),
        targetOrigin,
      );
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "message",
      createListener("qr_text_received", () => {
        props.setConfirmPaymentState();
      }),
    );

    return () => controller.abort();
  }, []);

  return null;
};
