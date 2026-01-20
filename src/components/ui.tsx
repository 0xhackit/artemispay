import * as React from "react";

function cx(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  asChild?: boolean; // accepted but not forwarded
};

export function Button({
  className,
  variant = "primary",
  asChild: _asChild, // ✅ prevent leaking to DOM
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none";
  const styles =
    variant === "secondary"
      ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
      : variant === "ghost"
      ? "bg-transparent text-gray-900 hover:bg-gray-100"
      : "bg-[#10B981] text-white hover:brightness-95";

  return (
    <button className={cx(base, styles, className)} {...props} />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none",
        "placeholder:text-gray-400 focus:border-[#5B3FFF] focus:ring-2 focus:ring-[#5B3FFF]/20",
        className
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-gray-200 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function Pill({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700",
        className
      )}
      {...props}
    />
  );
}

export function Shell({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "min-h-screen bg-[#F3F4F6] text-[#111827] px-4 py-6",
        className
      )}
      {...props}
    />
  );
}

export function Topbar({
  title,
  left,
  right,
}: {
  title: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {left}
          <div className="text-sm font-semibold">{title}</div>
        </div>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </div>
  );
}