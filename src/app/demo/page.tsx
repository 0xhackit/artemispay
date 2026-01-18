"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Card, Pill, Shell, Topbar } from "@/components/ui";

const DEMO_MERCHANT_ID = "demo-store";

export default function DemoPage() {
  const [qr, setQr] = useState<string>("");

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "";

  const demoUrl = `${baseUrl}/m/${DEMO_MERCHANT_ID}`;

  useEffect(() => {
    QRCode.toDataURL(demoUrl, { width: 280, margin: 1 }).then(setQr);
  }, [demoUrl]);

  return (
    <Shell>
      <Topbar
        title="Live demo"
        left={<Pill>Store QR</Pill>}
      />

      <Card className="p-5 text-center">
        <div className="text-sm text-gray-500">
          Scan to try the checkout experience
        </div>

        <div className="mt-4 flex justify-center">
          {qr && (
            <img
              src={qr}
              alt="Demo Store QR"
              className="rounded-xl border"
            />
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500 break-all">
          {demoUrl}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          This is a demo store. No real funds required.
        </div>
      </Card>
    </Shell>
  );
}