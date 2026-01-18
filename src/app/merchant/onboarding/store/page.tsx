"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Shell, Topbar, Pill } from "@/components/ui";

export default function OnboardingStorePage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const existing = localStorage.getItem("onboard_store_name");
    if (existing) setName(existing);
  }, []);

  function next() {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("onboard_store_name", trimmed);
    router.push("/merchant/onboarding/wallet");
  }

  return (
    <Shell>
      <Topbar
        title="Create store"
        left={
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/merchant/onboarding")}
          >
            ← Back
          </button>
        }
        right={<Pill>Step 1 of 2</Pill>}
      />

      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Store details</h1>
        <p className="mt-1 text-sm text-gray-600">
          This is what customers will see at checkout.
        </p>
      </div>

      <Card className="p-5 space-y-3">
        <div className="text-xs text-gray-500">Store name</div>
        <Input
          placeholder="Acme Coffee"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Card>

      <div className="mt-5">
        <Button onClick={next} disabled={!name.trim()}>
          Continue
        </Button>
      </div>
    </Shell>
  );
}
