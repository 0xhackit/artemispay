"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Button, Card, Input, Shell, Topbar, Pill } from "@/components/ui";

function isAddressLike(v: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(v.trim());
}

export default function OnboardingWalletPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [storeName, setStoreName] = useState<string>("");
  const [manualAddress, setManualAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const name = window.localStorage.getItem("onboard_store_name");
    if (!name) router.replace("/merchant/onboarding/store");
    else setStoreName(name);
  }, [router]);

  const recipientAddress = useMemo(() => {
    if (isConnected && address) return address;
    if (isAddressLike(manualAddress)) return manualAddress.trim();
    return "";
  }, [isConnected, address, manualAddress]);

  async function finish() {
    setError(null);

    if (!storeName.trim()) {
      setError("Missing store name. Please go back and enter it.");
      return;
    }

    if (!recipientAddress) {
      setError("Connect a wallet or paste a valid address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/merchant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: storeName.trim(),
          recipientAddress,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to create store");

      if (typeof window !== "undefined") {
        window.localStorage.setItem("merchantId", data.merchant.id);
        window.localStorage.removeItem("onboard_store_name");
      }

      router.push("/merchant/onboarding/done");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <Topbar
        title="Connect wallet"
        left={
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/merchant/onboarding/store")}
          >
            ← Back
          </button>
        }
        right={<Pill>Step 2 of 2</Pill>}
      />

      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Where should we send your money?
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Funds settle directly to your wallet (non-custodial).
        </p>
      </div>

      <Card className="p-5 space-y-4">
        <div>
          <div className="text-xs text-gray-500 mb-2">Recommended</div>
          <ConnectButton />
          <div className="mt-2 text-xs text-gray-500">
            Network: Arbitrum Sepolia (for testing)
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="text-xs text-gray-500">Or paste a payout address</div>
          <div className="mt-2">
            <Input
              placeholder="0x…"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Use this if you’re not connecting a wallet right now.
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </Card>

      <div className="mt-5">
        <Button onClick={finish} disabled={loading || !recipientAddress}>
          {loading ? "Creating store…" : "Finish setup"}
        </Button>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Never share your seed phrase. We will never ask for it.
        </div>
      </div>
    </Shell>
  );
}
