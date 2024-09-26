import {
  createEvent,
  createEventListener,
  createTargetOrigin,
} from "#packages/tma";
import { useEffect } from "react";

export const NewPayment = () => {
  useEffect(() => {
    window.parent.postMessage(
      createEvent("web_app_expand"),
      createTargetOrigin(),
    );
    window.parent.postMessage(
      createEvent("web_app_open_scan_qr_popup"),
      createTargetOrigin(),
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "message",
      createEventListener("qr_text_received", () => {
        window.parent.postMessage(
          createEvent("web_app_open_popup", {
            title: "",
            message: "QR code not recognized",
            buttons: [
              {
                id: "close",
                type: "default",
                text: "Scan again",
              },
            ],
          }),
          createTargetOrigin(),
        );
      }),
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, []);

  return <></>;
};
