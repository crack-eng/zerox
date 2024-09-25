import { isEvent, type Event } from "./event";
import type { EventData } from "./event-data";
import type { EventType } from "./event-type";

type Listener<T extends EventType> = (data?: EventData[T]) => void;

export const createEventListener =
  <T extends EventType>(type: T, listener: Listener<T>) =>
  (event: MessageEvent) => {
    if (!isEvent(event)) return;

    const data = JSON.parse(event.data) as Event;

    if (data.eventType !== type) return;

    listener(data.eventData as EventData[T]);
  };
