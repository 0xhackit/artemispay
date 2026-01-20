"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Shell, Topbar, Pill } from "@/components/ui";
import QRCodeBlock from "@/components/QRCodeBlock";

export default function OnboardingDonePage() {
  const router = useRouter();
  const [merchantId, setMerchantId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.localStorage.getItem("merchantId");
    if (!id) router.replace("/merchant/onboarding");
    else setMerchantId(id);
  }, [router]);

  const baseUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  }, []);

  const storePayUrl = useMemo(() => {
    if (!merchantId || !baseUrl) return "";
    return `${baseUrl}/m/${merchantId}`;
  }, [merchantId, baseUrl]);

  if (!merchantId) return null;

  return (
    <Shell>
      <Topbar title="Setup complete" left={<Pill>Live</Pill>} />

      <Card className="p-5 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl">
          ✓
        </div>
        <div className="text-sm text-gray-500">Your checkout is ready</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          Start accepting USDC
        </div>

        <div className="mt-5 flex justify-center">
          <QRCodeBlock value={storePayUrl} size={220} />
        </div>

        <div className="mt-4 text-xs text-gray-500 break-all">{storePayUrl}</div>

        <div className="mt-4 space-y-3">
          <Button onClick={() => router.push("/merchant/home")}>Open cashier</Button>
          <Button variant="secondary" onClick={() => router.push("/merchant/static-qr")}>
            View storefront QR
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(storePayUrl)}
          >
            Copy checkout link
          </Button>
        </div>
      </Card>
    </Shell>
  );
}
