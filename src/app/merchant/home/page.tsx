"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Shell, Topbar, Pill } from "@/components/ui";

type Invoice = {
  id: string;
  amount: string;
  status: "PENDING" | "PAID" | "EXPIRED";
  createdAt: string;
  paidAt: string | null;
};

type Stats = {
  merchant: { id: string; name: string; recipientAddress: string };
  balances: { usdc: string };
  invoices: Invoice[];
};

export default function MerchantHome() {
  const router = useRouter();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("merchantId");
    if (!id) router.push("/merchant/onboarding");
    else setMerchantId(id);
  }, [router]);

  useEffect(() => {
    if (!merchantId) return;
    fetch(`/api/merchant/${merchantId}/stats`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, [merchantId]);

  if (!merchantId) return null;

  return (
    <Shell>
      <Topbar
        title={stats?.merchant?.name ?? "Your store"}
        left={<Pill>USDC</Pill>}
        right={
          <button
            className="text-sm text-gray-600"
            onClick={() => router.push("/merchant/onboarding")}
          >
            Settings
          </button>
        }
      />

      {/* Primary action */}
      <Card className="p-5">
        <Button
          className="h-14 text-lg w-full"
          onClick={() => router.push("/merchant/new-invoice")}
        >
          💳 Collect payments
        </Button>
      </Card>

      {/* Store QR */}
      <div
        role="button"
        tabIndex={0}
        className="mt-4 cursor-pointer active:scale-[0.99]"
        onClick={() => router.push("/merchant/storefront")}
        onKeyDown={(e) => e.key === "Enter" && router.push("/merchant/storefront")}
        >
        <Card className="p-4">
            <div className="text-sm font-semibold">📱 Store QR</div>
            <div className="mt-1 text-xs text-gray-500">
            Always-on QR for in-person payments
            </div>
        </Card>
        </div>

      {/* Checkout link placeholder */}
      <Card className="p-4 mt-3">
        <div className="text-sm font-semibold">🔗 Checkout link</div>
        <div className="mt-1 text-xs text-gray-500">
          Coming soon — share a link to collect payments online.
        </div>
      </Card>

      {/* Balance */}
      <Card className="p-5 mt-4">
        <div className="text-xs text-gray-500">Wallet balance</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight">
          {stats?.balances?.usdc ?? "0.00"} USDC
        </div>
      </Card>

      {/* Recent payments */}
      <Card className="p-4 mt-4">
        <div className="text-sm font-semibold">Recent payments</div>

        <div className="mt-3 space-y-2">
          {stats?.invoices?.slice(0, 4).map((inv) => (
            <div key={inv.id} className="flex justify-between text-sm">
              <span>{inv.amount} USDC</span>
              <span className="text-gray-500">
                {inv.status === "PAID" ? "Paid" : inv.status}
              </span>
            </div>
          ))}

          {(!stats || stats.invoices.length === 0) && (
            <div className="text-sm text-gray-500">No payments yet.</div>
          )}
        </div>
      </Card>
    </Shell>
  );
}