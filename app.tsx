import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Payments } from "#apps/payments";
import "#packages/tma";

const container = document.querySelector("#app");

if (!container) {
  throw new Error("Container is not a DOM element.");
}

createRoot(container).render(
  <StrictMode>
    <Payments />
  </StrictMode>,
);
