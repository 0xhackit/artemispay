"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { Button, Card, Shell, Topbar, Pill } from "@/components/ui";

type Stats = {
  merchant: { id: string; name: string; recipientAddress: string };
};

export default function StoreQRPage() {
  const router = useRouter();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [merchantName, setMerchantName] = useState<string>("");

  const [dataUrl, setDataUrl] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.localStorage.getItem("merchantId");
    if (!id) router.push("/merchant/onboarding");
    else setMerchantId(id);
  }, [router]);

  useEffect(() => {
    if (!merchantId) return;

    (async () => {
      try {
        setErr(null);

        const res = await fetch(`/api/merchant/${merchantId}/stats`, {
          cache: "no-store",
        });
        const data = (await res.json()) as Stats;

        if (!res.ok) throw new Error((data as any)?.error || "Failed to load merchant");

        setMerchantName(data?.merchant?.name ?? "");

        const base =
          process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const payUrl = `${base}/m/${merchantId}`;

        const url = await QRCode.toDataURL(payUrl, { margin: 1, width: 320 });
        setDataUrl(url);
      } catch (e: any) {
        setErr(e.message || "Failed to generate QR");
      }
    })();
  }, [merchantId]);

  const payUrl = useMemo(() => {
    if (!merchantId) return "";
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "";
    return `${base}/m/${merchantId}`;
  }, [merchantId]);

  if (!merchantId) return null;

  return (
    <Shell>
      <Topbar
        title="Store QR"
        left={<Pill>USDC</Pill>}
        right={
          <button
            className="text-sm text-gray-600"
            onClick={() => router.push("/merchant/home")}
          >
            Back
          </button>
        }
      />

      <Card className="p-5">
        <div className="text-sm text-gray-500">Customers scan to pay</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          {merchantName || "Your store"}
        </div>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <div className="mt-5 flex justify-center">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Store QR"
              className="h-[320px] w-[320px] rounded-xl border bg-white"
            />
          ) : (
            <div className="h-[320px] w-[320px] rounded-xl border flex items-center justify-center text-sm text-gray-500">
              Generating QR…
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-gray-500 break-all">
          {payUrl}
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(payUrl);
            }}
          >
            Copy link
          </Button>
          <Button onClick={() => window.print()}>Print</Button>
        </div>
      </Card>
    </Shell>
  );
}