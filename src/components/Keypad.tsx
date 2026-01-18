"use client";

import React from "react";

type Props = {
  value: string;                 // "12.34"
  onChange: (v: string) => void; // next value
};

function sanitize(next: string) {
  // Allow only digits + one decimal point, max 2 decimals
  next = next.replace(/[^\d.]/g, "");
  const parts = next.split(".");
  if (parts.length > 2) next = parts[0] + "." + parts.slice(1).join("");
  const [i, d] = next.split(".");
  if (d && d.length > 2) next = i + "." + d.slice(0, 2);
  // avoid leading zeros like "00"
  if (i.length > 1 && i.startsWith("0") && !i.startsWith("0.")) {
    next = String(Number(i)) + (d !== undefined ? "." + d : "");
  }
  return next;
}

export default function Keypad({ value, onChange }: Props) {
  const press = (k: string) => {
    if (k === "C") return onChange("");
    if (k === "⌫") return onChange(value.slice(0, -1));
    const next = sanitize(value + k);
    onChange(next);
  };

  const keys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => press(k)}
          className="h-14 rounded-2xl border border-gray-200 bg-white text-lg font-semibold shadow-[0_6px_16px_rgba(0,0,0,0.05)] active:scale-[0.99]"
        >
          {k}
        </button>
      ))}

      <button
        onClick={() => press("C")}
        className="col-span-3 h-12 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 active:scale-[0.99]"
      >
        Clear
      </button>
    </div>
  );
}