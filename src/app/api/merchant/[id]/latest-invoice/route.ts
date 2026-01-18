import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } // 👈 important
) {
  try {
    const { id: merchantId } = await ctx.params; // 👈 important

    if (!merchantId) {
      return NextResponse.json({ error: "Missing merchant id" }, { status: 400 });
    }

    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
        name: true,
        recipientAddress: true,
        lastInvoiceId: true,
        lastInvoiceAt: true,
      },
    });

    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    if (!merchant.lastInvoiceId) {
      return NextResponse.json({ merchant, invoice: null }, { status: 200 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: merchant.lastInvoiceId },
    });

    return NextResponse.json({ merchant, invoice }, { status: 200 });
  } catch (e) {
    console.error("GET /api/merchant/[id]/latest-invoice failed:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}