import fs from "node:fs";
import fastify from "fastify";
import {
  createWalletClient,
  getContract,
  Hex,
  publicActions,
  toBytes,
  toHex,
  webSocket,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy } from "viem/chains";
import { start } from "./pkg/kaspi/opay/cpp.js";
import { rate } from "./pkg/rates.js";
import { abi } from "./abi.js";
import { randomUUID } from "crypto";
import { readFile, writeFile } from "fs/promises";

const client = createWalletClient({
  chain: polygonAmoy,
  transport: webSocket(),
  account: privateKeyToAccount(process.env.PRIVATE_KEY as Hex),
}).extend(publicActions);

const contract = getContract({
  abi,
  address: "0x8C2D49928452893eBC5F3f28d027ef0a98E5E613",
  client,
});

const app = fastify();

type PostTxsBody = {
  transport: {
    id: string;
  };
};

app.post<{ Body: PostTxsBody }>(
  "/txs",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          transport: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
            },
            required: ["id"],
          },
        },
        required: ["transport"],
      },
    },
  },
  async (req) => {
    const { amount, transaction } = await start(req.body);

    const id = randomUUID();

    const idHex = toHex(toBytes(id, { size: 32 }));

    const rateVal = await rate("usd", "kzt");

    const usdAmount = amount / rateVal;

    const usdcAmount = BigInt(Math.ceil(usdAmount * 1_000_000));

    await contract.write.initiateSwap([idHex, usdcAmount]);

    await writeTransaction(id, {
      transaction: {
        id: transaction.id,
        amount: {
          kzt: amount,
        },
      },
    });

    return {
      id: idHex,
      amount: usdcAmount.toString(),
    };
  },
);

const checkFileExists = async (path: fs.PathLike) => {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const writeTransaction = async (
  id: string,
  data: {
    transaction: {
      id: string;
      amount: {
        kzt: number;
      };
    };
  },
) => {
  if (await checkFileExists("transactions.json")) {
    await writeFile("transactions.json", JSON.stringify({}));
  }

  const transactions = (await JSON.parse(
    await readFile("transactions.json", "utf-8"),
  )) as Record<
    string,
    {
      transaction: {
        id: string;
        amount: {
          kzt: number;
        };
      };
    }
  >;

  transactions[id] = data;

  await writeFile("transactions.json", JSON.stringify(transactions));
};

app.listen({ port: 8081 });
