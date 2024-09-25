import { createEvent } from "#packages/telegram/create-event";
import { createEventListener } from "#packages/telegram/create-event-listener";
import { useEffect } from "react";

export const NewPayment = () => {
  useEffect(() => {
    window.parent.postMessage(createEvent("web_app_open_scan_qr_popup"), "*");
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "message",
      createEventListener("qr_text_received", (data: any) => {
        alert(JSON.stringify(data, null, 2));
      }),
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, []);

  return <></>;
};
