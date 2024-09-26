import { isMethodEvent, type MethodEvent } from "./predicates/is-method-event";

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

    if (!isMethodEvent(event)) return;

    if (typeof window.TelegramWebviewProxy !== "undefined") {
      const data = JSON.parse(event.data) as MethodEvent<any>;

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

export * from "./create-event";
export * from "./create-event-listener";
