"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Shell } from "@/components/ui";

export default function OnboardingWelcomePage() {
  const router = useRouter();

  // If already onboarded, go straight to home
  useEffect(() => {
    if (typeof window === "undefined") return;
    const merchantId = window.localStorage.getItem("merchantId");
    if (merchantId) router.replace("/merchant/home");
  }, [router]);

  return (
    <Shell>
      <div className="mb-6">
        <div className="text-sm text-gray-500">Crypto checkout</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Accept USDC payments in minutes
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          No SDK. No custody. Instant settlement to your wallet.
        </p>
      </div>

      <Card className="p-5 space-y-3">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-900">No-code setup</div>
          <div className="mt-1 text-sm text-gray-600">
            Create a store, connect a wallet, start charging.
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-900">Works online + offline</div>
          <div className="mt-1 text-sm text-gray-600">
            Share a checkout link or show a QR at the counter.
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-900">Non-custodial</div>
          <div className="mt-1 text-sm text-gray-600">
            Funds go directly to your wallet. You stay in control.
          </div>
        </div>
      </Card>

      <div className="mt-5 space-y-3">
        <Button onClick={() => router.push("/merchant/onboarding/store")}>
          Create your store
        </Button>

        <button
          className="w-full text-sm text-gray-600 hover:text-gray-900"
          onClick={() => router.push("/merchant/home")}
        >
          I already have a store →
        </button>
      </div>
    </Shell>
  );
}
