import { isMethodEvent, type MethodEvent } from "./event";

type PostEvent = (eventType: string, eventData: string) => void;
type ReceiveEvent = (eventType: string, eventData: unknown) => void;

declare let window: Window & {
  TelegramWebviewProxy: {
    postEvent: PostEvent;
  };
  external: {
    notify: (data: string) => void;
  };
  TelegramGameProxy: {
    receiveEvent: ReceiveEvent;
  };
  Telegram: {
    WebView: {
      receiveEvent: ReceiveEvent;
    };
  };
  TelegramGameProxy_receiveEvent: ReceiveEvent;
};

window.addEventListener(
  "message",
  (event) => {
    if (!isMethodEvent(event)) return;

    if (self !== top) {
      return;
    }

    if (typeof window.TelegramWebviewProxy === "undefined") {
      window.external.notify(event.data);
      return;
    }

    const data = JSON.parse(event.data) as MethodEvent;

    window.TelegramWebviewProxy.postEvent(
      data.eventType.toString(),
      JSON.stringify(data.eventData),
    );
  },
  false,
);

const receiveEvent: ReceiveEvent = (eventType, eventData) => {
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
