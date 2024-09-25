import type { MethodEvent } from "./event";
import type { MethodType } from "./event-type";

export const createEvent = (type: MethodType, data?: unknown) => {
  const value: MethodEvent = {
    eventType: type,
  };

  if (typeof data !== "undefined" && data !== null) {
    value["eventData"] = data;
  }

  return JSON.stringify(value);
};
