"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Input, Shell, Topbar, Pill } from "@/components/ui";

type Merchant = {
  id: string;
  name: string;
};

export default function StaticMerchantQRPage() {
  const { merchantId } = useParams<{ merchantId: string }>();
  const router = useRouter();

  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load merchant info
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/merchant/${merchantId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) setMerchant(data.merchant);
    })();
  }, [merchantId]);

  async function createInvoice() {
    if (!merchant) return;

    setError(null);

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: merchant.id,
          amount,
          memo: memo || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");

      router.push(`/i/${data.invoice.id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!merchant) {
    return (
      <Shell>
        <div className="text-sm text-gray-500">Loading store…</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <Topbar
        title={merchant.name}
        left={<Pill>Pay with USDC</Pill>}
      />

      <div className="mb-5">
        <h1 className="text-3xl font-semibold tracking-tight">
          Enter amount
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Pay {merchant.name} instantly on-chain
        </p>
      </div>

      <Card className="p-5">
        <div className="text-xs text-gray-500">Amount</div>
        <div className="mt-1 flex items-end justify-between">
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-5xl font-semibold tracking-tight outline-none bg-transparent"
          />
          <div className="pb-2 text-sm text-gray-500">USDC</div>
        </div>

        <div className="mt-4 text-xs text-gray-500">Note (optional)</div>
        <Input
          placeholder="Coffee, lunch, order #102"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        {error && (
          <div className="mt-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </Card>

      <div className="mt-5">
        <Button onClick={createInvoice} disabled={loading}>
          {loading ? "Preparing checkout…" : "Continue to pay"}
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        Powered by on-chain USDC • Arbitrum
      </p>
    </Shell>
  );
}