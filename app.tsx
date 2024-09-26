import { Payments } from "#apps/payments";
import "#packages/tma";
import { createEvent, targetOrigin } from "#packages/tma";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const container = document.querySelector("#app");

if (!container) {
  throw new Error("createRoot(...): Target container is not a DOM element.");
}

window.parent.postMessage(createEvent("web_app_ready"), targetOrigin);
window.parent.postMessage(createEvent("web_app_expand"), targetOrigin);

createRoot(container).render(
  <StrictMode>
    <Payments />
  </StrictMode>,
);
