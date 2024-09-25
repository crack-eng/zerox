import { usePopup, useQRScanner } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

export const Qr = () => {
  const popup = usePopup(true);
  const scanner = useQRScanner(true);

  useEffect(() => {
    if (scanner && popup) {
      scanner.open({
        capture(payload) {
          if (payload.data) {
            popup.open({
              message: payload.data,
            });

            return true;
          }

          return false;
        },
      });
    }
  }, [scanner, popup]);

  return <></>;
};
