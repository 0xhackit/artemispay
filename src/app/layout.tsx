import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/providers/Providers";

export const metadata: Metadata = {
  title: "Pay",
  description: "Accept stablecoin payments globally",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}