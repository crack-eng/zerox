import type { MethodEvent } from "./event";
import type { MethodData } from "./event-data";
import type { MethodType } from "./event-type";

export const createEvent = <T extends MethodType>(
  type: T,
  data?: MethodData[T],
) => {
  const value: MethodEvent = {
    eventType: type,
  };

  if (typeof data !== "undefined" && data !== null) {
    value["eventData"] = data;
  }

  return JSON.stringify(value);
};
