import type { MethodData } from "./event-data";
import type { MethodType } from "./event-type";

export const createMessage = <T extends MethodType>(
  type: T,
  data?: MethodData[T],
) => {
  return JSON.stringify({
    eventType: type,
    eventData: data,
  });
};
