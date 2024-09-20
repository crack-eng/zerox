import { randomUUID } from "crypto";

const token = "****";

type HeaderOptions = {
  requestId: string;
};

const createHeaders = (options: HeaderOptions): Headers => {
  return new Headers({
    Host: "opay.kaspi.kz",
    "X-Call": "notConnected",
    "User-Agent": "Kaspi.kz/718 CFNetwork/1498.700.2 Darwin/23.6.0",
    "X-App-Bld": "718",
    "X-Device-Model": "iPhone14,7",
    "X-Platform-Ver": "17.6.1",
    "X-Platform-Type": "IOS",
    "X-Device-Id": "A9357B28-BA06-4536-B9CC-C1F25C3DBF0A",
    "X-App-Ver": "5.52.2",
    "X-Features": "newTypPcm",
    "X-Locale": "ru-RU",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    "X-Request-Id": options.requestId,
    Accept: "*/*",
    "X-Install-Id": "092D5F25-6DA5-4C52-9A59-27A846E9C080",
    "X-Device-Brand": "Apple",
    "X-Token": token,
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  });
};

type ConfirmOptions = {
  transaction: { id: string };
  amount: number;
};

const confirm = async (options: ConfirmOptions): Promise<any> => {
  const url = `https://opay.kaspi.kz/cpp/api/v1/confirm?transactionId=${options.transaction.id}&type=Qr`;

  const headers = createHeaders({ requestId: randomUUID() });

  headers.set("Content-Type", "application/json");

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      bonusBalance: 0,
      useBonus: false,
      amount: options.amount,
      accountId: "29",
      customerComment: "",
      accountType: "Gold",
    }),
  });
  return response.json();
};

type StartOptions = {
  transport: { id: string };
};

const start = async (
  options: StartOptions,
): Promise<{ amount: number; transaction: { id: string } }> => {
  const url = `https://opay.kaspi.kz/cpp/api/v1/start?transportId=${options.transport.id}&type=Qr`;

  const response = await fetch(url, {
    method: "GET",
    headers: createHeaders({ requestId: randomUUID() }),
  });

  const json = (await response.json()) as {
    data: {
      ext: {
        amount: number;
        button: {
          launchUrl: string;
        };
      };
    };
  };

  const launchUrl = new URL(json.data.ext.button.launchUrl);

  const transactionId = launchUrl.searchParams.get("transactionId") as string;

  return {
    amount: json.data.ext.amount,
    transaction: {
      id: transactionId,
    },
  };
};

export { confirm, start };
