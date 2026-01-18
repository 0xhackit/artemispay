"use client";

type Props = {
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELED" | string;
};

export default function InvoiceStatusPill({ status }: Props) {
  const map: Record<string, string> = {
    PENDING: "Waiting for payment…",
    PAID: "Paid ✅",
    EXPIRED: "Expired",
    CANCELED: "Canceled",
  };

  const label = map[status] ?? status;

  return (
    <div className="px-4 py-2 rounded-full border text-lg">
      {label}
    </div>
  );
}