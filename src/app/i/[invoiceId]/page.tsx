// ✅ What this gives you:
// 	•	one tap pay
// 	•	no tx hash copy/paste
// 	•	receipt wait + server confirmation
// 	•	invoice becomes PAID in DB

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { parseUnits, type Hex } from "viem";
import { Button, Card, Shell, Topbar, Pill } from "@/components/ui";
import { usePublicClient } from "wagmi";

const USDC_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as const;

const erc20Abi = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

type Invoice = {
  id: string;
  amount: string;
  recipientAddress: string;
  status: "PENDING" | "PAID" | "EXPIRED";
  txHash: string | null;
};

export default function PayerPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const { address, chainId, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const publicClient = usePublicClient({ chainId: arbitrumSepolia.id });
  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load invoice
  useEffect(() => {
    (async () => {
      setError(null);
      const res = await fetch(`/api/invoice/${invoiceId}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "Failed to load invoice");
        return;
      }
      setInvoice(data.invoice);
    })();
  }, [invoiceId]);

  // Wait for tx confirmation
  const receipt = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    chainId: arbitrumSepolia.id,
  });

  // After receipt, confirm server-side and mark PAID
  useEffect(() => {
    if (!txHash) return;
    if (!receipt.isSuccess) return;
    if (!address) return;
    if (confirming) return;

    (async () => {
      setConfirming(true);
      setError(null);
      try {
        const res = await fetch(`/api/invoice/${invoiceId}/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ txHash, payerAddress: address }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error || "Failed to confirm payment");

        setInvoice(data.invoice);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setConfirming(false);
      }
    })();
  }, [txHash, receipt.isSuccess, address, invoiceId, confirming]);

  const canPay = useMemo(() => {
    return (
      invoice &&
      invoice.status === "PENDING" &&
      isConnected &&
      !!address
    );
  }, [invoice, isConnected, address]);

  async function pay() {
    if (!invoice || !publicClient) return;
  
    setError(null);
  
    if (chainId !== arbitrumSepolia.id) {
      await switchChainAsync({ chainId: arbitrumSepolia.id });
    }
  
    const amount = parseUnits(invoice.amount, 6);
  
    const fees = await publicClient.estimateFeesPerGas();
  
    const bump = (x: bigint) => (x * 12n) / 10n;
  
    const hash = await writeContractAsync({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "transfer",
      args: [invoice.recipientAddress, amount],
      maxFeePerGas: fees.maxFeePerGas ? bump(fees.maxFeePerGas) : undefined,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas
        ? bump(fees.maxPriorityFeePerGas)
        : undefined,
    });
  
    setTxHash(hash);
  }

  return (
    <Shell>
      <Topbar title="Checkout" left={<Pill>USDC • Arbitrum Sepolia</Pill>} />

      {!invoice && <div className="text-sm text-gray-500">Loading invoice…</div>}

      {invoice && (
        <>
          <Card className="p-5">
            <div className="text-sm text-gray-500">You’re paying</div>
            <div className="mt-1 text-4xl font-semibold tracking-tight">
              {invoice.amount} USDC
            </div>

            <div className="mt-3 text-xs text-gray-500 break-all">
              To: {invoice.recipientAddress}
            </div>

            <div className="mt-4">
              <ConnectButton />
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </Card>

          <div className="mt-4 space-y-3">
            {invoice.status === "PAID" ? (
                <Card className="p-5 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl">
                    ✓
                </div>

                <div className="text-sm text-gray-500">Payment complete</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight">
                    {invoice.amount} USDC
                </div>

                {invoice.txHash ? (
                    <a
                    className="mt-4 block text-sm text-gray-600 underline break-all"
                    href={`https://sepolia.arbiscan.io/tx/${invoice.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    >
                    View on Arbiscan
                    </a>
                ) : null}

                <div className="mt-5">
                    <Button onClick={() => (window.location.href = "/")}>Done</Button>
                </div>
                </Card>
            ) : (
                <Button
                onClick={pay}
                disabled={!canPay || isWriting || receipt.isLoading || confirming}
                >
                {isWriting
                    ? "Confirm in wallet…"
                    : receipt.isLoading
                    ? "Waiting for confirmation…"
                    : confirming
                    ? "Finalizing…"
                    : "Pay now"}
                </Button>
            )}
            </div>
        </>
      )}
    </Shell>
  );
}