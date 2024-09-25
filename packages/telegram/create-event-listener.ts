import { isEvent, type Event } from "./event";
import type { EventType } from "./event-type";

type Listener = (data?: unknown) => void;

export const createEventListener =
  (type: EventType, listener: Listener) => (event: MessageEvent) => {
    if (!isEvent(event)) return;

    const data = JSON.parse(event.data) as Event;

    if (data.eventType !== type) return;

    listener(data.eventData);
  };
