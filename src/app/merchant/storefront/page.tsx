"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { Button, Card, Shell, Topbar, Pill } from "@/components/ui";

type Invoice = {
  id: string;
  amount: string;
  status: "PENDING" | "PAID" | "EXPIRED";
  txHash: string | null;
};

type LatestInvoiceResponse = {
  merchant: { id: string; name: string; recipientAddress: string };
  invoice: Invoice | null;
};

export default function StorefrontPage() {
  const router = useRouter();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [data, setData] = useState<LatestInvoiceResponse | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const baseUrl =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.localStorage.getItem("merchantId");
    if (!id) router.push("/merchant/onboarding");
    else setMerchantId(id);
  }, [router]);

  const storeUrl = useMemo(() => {
    if (!merchantId) return "";
    return `${baseUrl}/m/${merchantId}`;
  }, [baseUrl, merchantId]);

  useEffect(() => {
    if (!storeUrl) return;
    QRCode.toDataURL(storeUrl, { margin: 1, width: 320 }).then(setQrDataUrl);
  }, [storeUrl]);

  // Poll latest invoice pointer
  useEffect(() => {
    if (!merchantId) return;

    let alive = true;

    const tick = async () => {
      try {
        const res = await fetch(`/api/merchant/${merchantId}/latest-invoice`, {
          cache: "no-store",
        });
        const json = (await res.json()) as LatestInvoiceResponse;
        if (alive) setData(json);
      } catch {
        // ignore
      }
    };

    tick();
    const t = setInterval(tick, 1000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [merchantId]);

  const invoice = data?.invoice;

  const statusLabel =
    invoice?.status === "PAID"
      ? "Paid ✅"
      : invoice?.status === "EXPIRED"
      ? "Expired"
      : invoice
      ? "Waiting for payment…"
      : "No active payment";

  return (
    <Shell>
      <Topbar
        title={data?.merchant?.name ?? "Storefront"}
        left={<Pill>Always-on</Pill>}
        right={
          <button
            className="text-sm text-gray-600"
            onClick={() => router.push("/merchant/home")}
          >
            Exit
          </button>
        }
      />

      <Card className="p-5 text-center">
        <div className="text-sm text-gray-500">Customer scan to pay</div>

        <div className="mt-3 flex justify-center">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="Store QR"
              className="rounded-2xl border border-black/10"
              width={320}
              height={320}
            />
          ) : (
            <div className="text-sm text-gray-500">Generating QR…</div>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-500 break-all">{storeUrl}</div>
      </Card>

      <Card className="p-5 mt-4">
        <div className="text-sm font-semibold">Live payment status</div>

        <div className="mt-2 text-2xl font-semibold">{statusLabel}</div>

        {invoice && (
          <div className="mt-2 text-sm text-gray-500">
            Invoice: <span className="font-mono">{invoice.id}</span>
            <div className="mt-1">
              Amount: <span className="font-semibold">{invoice.amount} USDC</span>
            </div>
          </div>
        )}

        {invoice?.status === "PAID" && (
          <div className="mt-4">
            <Button onClick={() => setData((d) => (d ? { ...d, invoice: null } : d))}>
              Next customer
            </Button>
          </div>
        )}
      </Card>
    </Shell>
  );
}