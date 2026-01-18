"use client";

import dynamic from "next/dynamic";

const ClientProviders = dynamic(() => import("./ClientProviders"), {
  ssr: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}