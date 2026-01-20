"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type QRCodeBlockProps = {
  value: string;
  size?: number; // px
};

export default function QRCodeBlock({ value, size = 320 }: QRCodeBlockProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      const url = await QRCode.toDataURL(value, {
        margin: 1,
        width: size,
      });
      if (mounted) setDataUrl(url);
    })();

    return () => {
      mounted = false;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border bg-white text-sm text-gray-600"
        style={{ width: size, height: size }}
      >
        Generating QR…
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt="QR Code"
      className="rounded-xl border bg-white"
      style={{ width: size, height: size }}
    />
  );
}