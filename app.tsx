import { Payments } from "#apps/payments";
import "#packages/tma";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const container = document.querySelector("#app");

if (!container) {
  throw new Error("createRoot(...): Target container is not a DOM element.");
}

createRoot(container).render(
  <StrictMode>
    <Payments />
  </StrictMode>,
);
