import type { EventData } from "../event-data";
import { eventTypes, type EventType } from "../event-type";

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

export type Event<T extends EventType> = {
  eventType: T;
  eventData: EventData[T];
};
