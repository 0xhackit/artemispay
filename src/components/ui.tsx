"use client";

import React from "react";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";


export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-5 py-6 flex justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

export function Card({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div
        className={
          "rounded-2xl border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] " +
          className
        }
      >
        {children}
      </div>
    );
  }

  type ButtonVariant = "primary" | "secondary";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  asChild?: boolean;
};

export function Button({
  className = "",
  variant = "primary",
  asChild = false,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "secondary"
      ? "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
      : "bg-emerald-500 text-white hover:bg-emerald-600";

  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={`${base} ${styles} ${className}`} {...props} />
  );
}

  export function Input({
    className = "",
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
      <input
        className={
          "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[15px] outline-none placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 " +
          className
        }
        {...props}
      />
    );
  }

export function Topbar({
  title,
  left,
  right,
}: {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="min-w-[64px]">{left}</div>
      <div className="text-[18px] font-semibold tracking-tight">{title}</div>
      <div className="min-w-[64px] flex justify-end">{right}</div>
    </div>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs text-gray-700">
        {children}
      </span>
    );
  }