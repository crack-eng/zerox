import { NewPayment } from "#apps/new-payment";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "#packages/tma";

const container = document.querySelector("#app");

if (!container) {
  throw new Error("createRoot(...): Target container is not a DOM element.");
}

createRoot(container).render(
  <StrictMode>
    <NewPayment />
  </StrictMode>,
);
