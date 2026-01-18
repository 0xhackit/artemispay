import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPublicClient, formatUnits, http } from "viem";
import { arbitrumSepolia } from "viem/chains";

const USDC = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as const;

const erc20BalanceOfAbi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
] as const;

const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const merchantId = parts[parts.length - 2]; // /api/merchant/<id>/stats

    if (!merchantId) {
      return NextResponse.json({ error: "Missing merchant id" }, { status: 400 });
    }

    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    // On-chain USDC balance for merchant payout address
    const balanceRaw = await client.readContract({
      address: USDC,
      abi: erc20BalanceOfAbi,
      functionName: "balanceOf",
      args: [merchant.recipientAddress as `0x${string}`],
    });

    const usdcBalance = formatUnits(balanceRaw, 6);

    // “Transaction history” from your DB (what your app knows is paid)
    const invoices = await prisma.invoice.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        paidAt: true,
        txHash: true,
        payerAddress: true,
        memo: true,
      },
    });

    return NextResponse.json(
      { merchant, balances: { usdc: usdcBalance }, invoices },
      { status: 200 }
    );
  } catch (e) {
    console.error("GET /api/merchant/[id]/stats failed:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}