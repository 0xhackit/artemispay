"use client";

import ClientProviders from "./ClientProviders";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
