import type { EventData } from "./event-data";
import { eventTypes, type EventType } from "./event-type";

export type Event<T extends EventType> = {
  eventType: T;
  eventData?: EventData[T];
};

type Listener<T extends EventType> = (data?: EventData[T]) => void;

export const createListener =
  <T extends EventType>(type: T, listener: Listener<T>) =>
  (event: MessageEvent) => {
    const data = JSON.parse(event.data) as Event<any>;

    if (!eventTypes.includes(data.eventType)) return;
    if (data.eventType !== type) return;

    listener(data.eventData as EventData[T]);
  };
