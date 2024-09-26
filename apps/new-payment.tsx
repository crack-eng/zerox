import { createEvent, createEventListener, targetOrigin } from "#packages/tma";
import { useEffect } from "react";

export const NewPayment = () => {
  useEffect(() => {
    window.parent.postMessage(createEvent("web_app_expand"), targetOrigin);
    window.parent.postMessage(
      createEvent("web_app_open_scan_qr_popup"),
      targetOrigin,
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
          targetOrigin,
        );
      }),
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, []);

  return <></>;
};
