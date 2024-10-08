import type { MethodData } from "./event-data";
import { methodTypes, type MethodType } from "./event-type";

export type MethodEvent<T extends MethodType> = {
  eventType: T;
  eventData?: MethodData[T];
};

type EventPoster = (eventType: string, eventData: string) => void;
type EventReceiver = (eventType: string, eventData: unknown) => void;

declare let window: Window & {
  TelegramWebviewProxy?: {
    postEvent: EventPoster;
  };
  external?: External & {
    notify?: (message: string) => void;
  };
  TelegramGameProxy: {
    receiveEvent: EventReceiver;
  };
  Telegram: {
    WebView: {
      receiveEvent: EventReceiver;
    };
  };
  TelegramGameProxy_receiveEvent: EventReceiver;
};

window.addEventListener(
  "message",
  (event) => {
    if (self !== top) {
      return;
    }

    let data: MethodEvent<any>;

    try {
      data = JSON.parse(event.data) as MethodEvent<any>;
    } catch (error) {
      return;
    }

    if (!methodTypes.includes(data.eventType)) {
      return;
    }

    if (typeof window.TelegramWebviewProxy !== "undefined") {
      if (typeof data.eventData !== "undefined") {
        window.TelegramWebviewProxy.postEvent(
          data.eventType,
          JSON.stringify(data.eventData),
        );
      } else {
        window.TelegramWebviewProxy.postEvent(data.eventType, "");
      }

      return;
    }

    if (window.external && typeof window.external.notify === "function") {
      window.external.notify(event.data);
    }
  },
  false,
);

const receiveEvent: EventReceiver = (eventType, eventData) => {
  window.postMessage(
    JSON.stringify({
      eventType,
      eventData,
    }),
  );
};

window.TelegramGameProxy = {
  receiveEvent,
};

window.Telegram = {
  WebView: {
    receiveEvent,
  },
};

window.TelegramGameProxy_receiveEvent = receiveEvent;

export const targetOrigin =
  self !== top ? "https://web.telegram.org" : window.location.origin;

export * from "./create-message";
export * from "./create-listener";
