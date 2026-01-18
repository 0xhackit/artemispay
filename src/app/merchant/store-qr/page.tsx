"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QRCodeBlock from "@/components/QRCodeBlock";
import { Button, Card, Shell, Topbar, Pill } from "@/components/ui";

export default function StoreQRPage() {
  const router = useRouter();
  const [merchantId, setMerchantId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("merchantId");
    if (!id) router.push("/merchant/onboarding");
    else setMerchantId(id);
  }, [router]);

  const baseUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  }, []);

  const storeUrl = useMemo(() => {
    if (!merchantId || !baseUrl) return "";
    return `${baseUrl}/m/${merchantId}`;
  }, [merchantId, baseUrl]);

  if (!merchantId) return null;

  return (
    <Shell>
      <Topbar
        title="Store QR"
        left={
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/merchant/home")}
          >
            ← Home
          </button>
        }
        right={<Pill>Pay anytime</Pill>}
      />

      <Card className="p-5">
        <div className="text-sm text-gray-500">Customers scan to pay</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
        {merchantName || "Your store"}
        </div>

        <div className="mt-5 flex justify-center">
          <QRCodeBlock value={storeUrl} size={260} />
        </div>

        <div className="mt-4 text-center text-xs text-gray-500 break-all">
          {storeUrl}
        </div>

        <div className="mt-4 space-y-3">
          <Button
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(storeUrl);
              alert("Store link copied");
            }}
          >
            Copy store link
          </Button>

          
        </div>
      </Card>

      <Card className="p-4 mt-4">
        <div className="text-sm font-semibold">🔗 Checkout link</div>
        <div className="mt-1 text-xs text-gray-500">
          Coming soon — generate payment links with fixed amount and metadata.
        </div>
      </Card>
    </Shell>
  );
}