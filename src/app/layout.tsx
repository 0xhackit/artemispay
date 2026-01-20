
import "./globals.css";
import { Inter } from "next/font/google";
import ClientProviders from "./providers/ClientProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[var(--brand-light)] text-[var(--brand-dark)]`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}