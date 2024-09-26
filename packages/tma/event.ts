import {
  eventTypes,
  methodTypes,
  type EventType,
  type MethodType,
} from "./event-type";

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

export type MethodEvent = {
  eventType: MethodType;
  eventData?: unknown;
};

export const isEvent = (
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

  if (!eventTypes.includes(data.eventType)) {
    return false;
  }

  if (!("eventData" in data)) {
    return false;
  }

  if (typeof data.eventData !== "object") {
    return false;
  }

  if (data.eventData === null) {
    return false;
  }

  return true;
};

export type Event = {
  eventType: EventType;
  eventData: unknown;
};
