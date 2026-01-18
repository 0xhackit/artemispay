import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const CreateMerchantSchema = z.object({
  name: z.string().trim().max(60).optional(),
  recipientAddress: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, recipientAddress } = CreateMerchantSchema.parse(body);

    const merchant = await prisma.merchant.create({
      data: { name, recipientAddress },
    });

    return NextResponse.json({ merchant }, { status: 201 });
  } catch (err: any) {
    const message =
      err?.issues?.[0]?.message ?? err?.message ?? "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
