"use client";

import dynamic from "next/dynamic";

const WagmiConfig = dynamic(() => import("./WagmiConfig"), { ssr: false });

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WagmiConfig>{children}</WagmiConfig>;
}