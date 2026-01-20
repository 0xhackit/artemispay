import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  // This will fail the build early with a clear error instead of weird runtime issues
  throw new Error(
    "Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in environment variables."
  );
}

export const config = getDefaultConfig({
  appName: "Pay",
  projectId,
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
  ssr: true,
});