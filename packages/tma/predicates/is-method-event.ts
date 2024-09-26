import type { MethodData } from "../event-data";
import { methodTypes, type MethodType } from "../event-type";

export const isMethodEvent = (
  event: MessageEvent<unknown>,
): event is MessageEvent<string> => {
  if (typeof event.data !== "string") {
    return false;
  }

  let data;

  try {
    data = JSON.parse(event.data);
  } catch (error) {
    return false;
  }

  if (typeof data !== "object") {
    return false;
  }

  if (data === null) {
    return false;
  }

  if (!("eventType" in data)) {
    return false;
  }

  if (typeof data.eventType !== "string") {
    return false;
  }

  if (!methodTypes.includes(data.eventType)) {
    return false;
  }

  if ("eventData" in data) {
    if (typeof data.eventData !== "object") {
      return false;
    }

    if (data.eventData === null) {
      return false;
    }
  }

  return true;
};

export type MethodEvent<T extends MethodType> = {
  eventType: T;
  eventData: MethodData[T];
};
