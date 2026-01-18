import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const CreateInvoiceSchema = z.object({
  merchantId: z.string().min(1),
  amount: z.string().min(1),
  memo: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { merchantId, amount, memo } = CreateInvoiceSchema.parse(body);

    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 1) Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        merchantId,
        amount,
        token: "USDC",
        chain: "arbitrum",
        recipientAddress: merchant.recipientAddress,
        memo: memo ?? null,
        expiresAt,
        status: "PENDING",
      },
    });

    // 2) Update merchant pointer (THIS MUST BE OUTSIDE invoice.create)
    await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        lastInvoiceId: invoice.id,
        lastInvoiceAt: new Date(),
      },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (e: any) {
    const message = e?.message || "Unknown error";
    console.error("POST /api/invoice failed:", e);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}