import "./index.css";
import { abi } from "./abi";
import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <Page />
    </App>
  </StrictMode>,
);

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useWriteContract, WagmiProvider } from "wagmi";
import { config } from "./rainbow";

function App({ children }: { children?: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BrowserQRCodeReader } from "@zxing/browser";
import { useEffect } from "react";
import { erc20Abi, parseEther, toBytes, toHex } from "viem";
import { useAccount, useSendTransaction } from "wagmi";

const reader = new BrowserQRCodeReader();

const createMediaSetter =
  (mediaStream: MediaProvider) => (node: HTMLMediaElement | null) => {
    if (node) {
      node.srcObject = mediaStream;
    }
  };

function Page() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [decoding, setDecoding] = useState(false);
  const [transportId, setTransportId] = useState("");
  const { sendTransactionAsync } = useSendTransaction();
  const { data: hash, writeContractAsync } = useWriteContract();

  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (openConnectModal) {
      openConnectModal();
    }
  }, []);

  useEffect(() => {
    setDecoding(true);
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          frameRate: 60,
          width: 1920,
          height: 1080,
        },
      })
      .then(setStream);
  }, []);

  useEffect(() => {
    if (stream && decoding) {
      reader
        .decodeOnceFromStream(stream)
        .then((result) => {
          console.log({
            getText: result.getText(),
            getRawBytes: result.getRawBytes(),
            getNumBits: result.getNumBits(),
            getResultPoints: result.getResultPoints(),
            getBarcodeFormat: result.getBarcodeFormat(),
            getResultMetadata: result.getResultMetadata(),
            getTimestamp: result.getTimestamp(),
            toString: result.toString(),
          });

          return result;
        })
        .then((result) => result.getText())
        .then(setTransportId);
    }
  }, [stream, decoding]);

  useEffect(() => {
    if (transportId !== "") {
      setDecoding(false);

      fetch("/api/txs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transport: { id: transportId },
        }),
      })
        .then(async (res) => {
          const js = await res.json();

          return js as {
            id: string;
            amount: string;
          };
        })
        .then(({ amount, id }) => {
          writeContractAsync({
            address: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
            abi: erc20Abi,
            functionName: "approve",
            args: [
              "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
              BigInt(amount),
            ],
          });
          writeContractAsync({
            address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
            abi,
            functionName: "transferSwap",
            args: [toHex(id)],
          }).finally(() => {
            setDecoding(true);
          });
        });
    }
  }, [transportId]);

  return (
    <>
      {hash}
      {stream && (
        <video
          ref={createMediaSetter(stream)}
          autoPlay
          muted
          className="w-dvw h-dvh object-cover -scale-x-100"
          style={{
            width: "100dvw",
            height: "100dvh",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
        />
      )}
    </>
  );
}
