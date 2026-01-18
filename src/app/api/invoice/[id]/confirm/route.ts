// ✅ What this does:
// 	•	takes txHash
// 	•	fetches receipt from default Arbitrum Sepolia RPC
// 	•	verifies a USDC Transfer occurred to the merchant address with exact amount
// 	•	marks invoice PAID + stores txHash, payerAddress, paidAt

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { arbitrumSepolia } from "viem/chains";
import {
  createPublicClient,
  http,
  decodeEventLog,
  parseUnits,
  type Hex,
} from "viem";

const USDC_SEPOLIA_ARBITRUM = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as const;

// Minimal ABI for Transfer event
const erc20TransferAbi = [
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
  },
] as const;

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(), // default RPCs for the chain
});

export async function POST(req: Request) {
  try {
    // Parse invoiceId from URL: /api/invoice/<id>/confirm
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const invoiceId = parts[parts.length - 2]; // second-to-last is [id]

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoice id" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const txHash = body?.txHash as Hex | undefined;
    const payerAddress = body?.payerAddress as `0x${string}` | undefined;

    if (!txHash) {
      return NextResponse.json({ error: "Missing txHash" }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Idempotent: already paid
    if (invoice.status === "PAID") {
      return NextResponse.json({ ok: true, status: invoice.status, invoice }, { status: 200 });
    }

    // Optional: enforce testnet token+chain on the invoice
    // (Adjust if you store these differently)
    // if (invoice.chain !== "arbitrum" || invoice.token !== "USDC") { ... }

    // Fetch tx receipt and verify it succeeded
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    if (receipt.status !== "success") {
      return NextResponse.json({ error: "Transaction failed" }, { status: 400 });
    }

    const expectedTo = invoice.recipientAddress.toLowerCase();
    const expectedValue = parseUnits(invoice.amount, 6); // USDC = 6 decimals

    let matched = false;
    let matchedFrom: string | null = null;

    for (const log of receipt.logs) {
      // Only look at logs from USDC contract
      if (log.address.toLowerCase() !== USDC_SEPOLIA_ARBITRUM.toLowerCase()) continue;

      try {
        const decoded = decodeEventLog({
          abi: erc20TransferAbi,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName !== "Transfer") continue;

        const to = (decoded.args as any).to as string;
        const from = (decoded.args as any).from as string;
        const value = (decoded.args as any).value as bigint;

        if (to.toLowerCase() === expectedTo && value === expectedValue) {
          matched = true;
          matchedFrom = from;
          break;
        }
      } catch {
        // ignore non-matching logs
      }
    }

    if (!matched) {
      return NextResponse.json(
        { error: "No matching USDC transfer found for this invoice" },
        { status: 400 }
      );
    }

    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        txHash,
        payerAddress: payerAddress ?? matchedFrom,
        paidAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, status: updated.status, invoice: updated }, { status: 200 });
  } catch (e) {
    console.error("POST /api/invoice/[id]/confirm failed:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}