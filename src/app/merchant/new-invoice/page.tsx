"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Keypad from "@/components/Keypad";
import { Button, Card, Input, Shell, Topbar, Pill } from "@/components/ui";

export default function NewInvoicePage() {
  const router = useRouter();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("merchantId");
    if (!id) router.push("/merchant/onboarding");
    else setMerchantId(id);
  }, [router]);

  const displayAmount = useMemo(() => {
    if (!amount) return "0.00";
    const n = Number(amount);
    if (!Number.isFinite(n)) return "0.00";
    return n.toFixed(2);
  }, [amount]);

  async function createInvoice() {
    if (!merchantId) return;
    setError(null);

    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId,
          amount: n.toFixed(2),
          memo: memo.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to create invoice");

      router.push(`/merchant/invoice/${data.invoice.id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!merchantId) return null;

  return (
    <Shell>
      <Topbar
        title="New charge"
        left={
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/merchant/home")}
          >
            ← Dashboard
          </button>
        }
        right={<Pill>USDC</Pill>}
      />

      <Card className="p-5">
        <div className="text-xs text-gray-500">Amount</div>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-5xl font-semibold tracking-tight">
            {displayAmount}
          </div>
          <div className="pb-2 text-sm text-gray-500">USDC</div>
        </div>

        <div className="mt-4 text-xs text-gray-500">Note (optional)</div>
        <Input
          placeholder="Coffee, order #102"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        {error && (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </Card>

      <div className="mt-4">
        <Keypad value={amount} onChange={setAmount} />
      </div>

      <div className="mt-5">
        <Button onClick={createInvoice} disabled={loading}>
          {loading ? "Creating…" : "Create payment"}
        </Button>
      </div>

      <div className="mt-3 text-center text-xs text-gray-500">
        Customer will scan to pay
      </div>
    </Shell>
  );
}