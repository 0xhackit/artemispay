"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  value: string;
};

export default function QRCodeBlock({ value }: Props) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const url = await QRCode.toDataURL(value, { margin: 1, width: 320 });
      if (mounted) setDataUrl(url);
    })();
    return () => {
      mounted = false;
    };
  }, [value]);

  if (!dataUrl) {
    return (
      <div className="w-[320px] h-[320px] flex items-center justify-center border rounded-xl">
        Generating QR…
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt="QR Code"
      className="w-[320px] h-[320px] rounded-xl border"
    />
  );
}