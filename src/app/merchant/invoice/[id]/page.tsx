"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCodeBlock from "@/components/QRCodeBlock";
import { Button, Card, Shell, Topbar, Pill } from "@/components/ui";

type Invoice = {
  id: string;
  amount: string;
  memo?: string | null;
  recipientAddress: string;
  status: "PENDING" | "PAID" | "EXPIRED";
  txHash?: string | null;
};

export default function MerchantInvoicePage() {
  const router = useRouter();
  const { id: invoiceId } = useParams<{ id: string }>();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  }, []);

  const payUrl = useMemo(() => {
    if (!baseUrl || !invoiceId) return "";
    return `${baseUrl}/i/${invoiceId}`;
  }, [baseUrl, invoiceId]);

  // Poll invoice
  useEffect(() => {
    let alive = true;

    async function tick() {
      try {
        const res = await fetch(`/api/invoice/${invoiceId}`, { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!alive) return;

        if (!res.ok) {
          setError(data?.error || "Failed to load invoice");
          return;
        }
        setInvoice(data.invoice);
      } catch (e: any) {
        if (!alive) return;
        setError(e.message);
      }
    }

    tick();
    const t = setInterval(tick, 1200);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [invoiceId]);

  const status = invoice?.status ?? "PENDING";

  return (
    <Shell>
      <Topbar
        title="Payment"
        left={
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/merchant/home")}
          >
            ← Dashboard
          </button>
        }
        right={
          <Pill>
            {status === "PAID"
              ? "Paid"
              : status === "EXPIRED"
              ? "Expired"
              : "Waiting"}
          </Pill>
        }
      />

      {!invoice && !error && (
        <div className="text-sm text-gray-500">Loading payment…</div>
      )}

      {error && (
        <Card className="p-4">
          <div className="text-sm text-red-700">{error}</div>
        </Card>
      )}

      {invoice && (
        <>
          <Card className="p-5">
            <div className="text-xs text-gray-500">Amount</div>
            <div className="mt-1 text-4xl font-semibold tracking-tight">
              {invoice.amount} <span className="text-gray-400">USDC</span>
            </div>
            {invoice.memo ? (
              <div className="mt-2 text-sm text-gray-600">{invoice.memo}</div>
            ) : null}
          </Card>

          {/* QR + states */}
          <Card className="p-5 mt-4">
            {status === "PAID" ? (
              <div className="text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-3xl">
                  ✓
                </div>
                <div className="text-lg font-semibold">Payment received</div>
                <div className="mt-1 text-sm text-gray-600">
                  {invoice.amount} USDC confirmed on-chain
                </div>

                {invoice.txHash ? (
                  <a
                    className="mt-3 block text-sm text-gray-600 underline break-all"
                    href={`https://sepolia.arbiscan.io/tx/${invoice.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View transaction
                  </a>
                ) : null}

                <div className="mt-5 space-y-3">
                  <Button onClick={() => router.push("/merchant/new-invoice")}>
                    New charge
                  </Button>
                  <Button variant="secondary" onClick={() => router.push("/merchant/home")}>
                    Done
                  </Button>
                </div>
              </div>
            ) : status === "EXPIRED" ? (
              <div className="text-center">
                <div className="text-lg font-semibold">Payment expired</div>
                <div className="mt-1 text-sm text-gray-600">
                  Create a new charge to try again.
                </div>
                <div className="mt-5">
                  <Button onClick={() => router.push("/merchant/new-invoice")}>
                    New charge
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Scan to pay</div>
                  <Pill>Live</Pill>
                </div>

                <div className="mt-4 flex justify-center">
                  <QRCodeBlock value={payUrl} size={240} />
                </div>

                <div className="mt-4 text-center text-xs text-gray-500 break-all">
                  {payUrl}
                </div>

                <div className="mt-5">
                  <Button variant="secondary" onClick={() => router.push("/merchant/new-invoice")}>
                    Cancel & create new
                  </Button>
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </Shell>
  );
}