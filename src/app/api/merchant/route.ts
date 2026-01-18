import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<{
      name: string;
      recipientAddress: string;
    }>;

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const recipientAddress =
      typeof body.recipientAddress === "string" ? body.recipientAddress.trim() : "";

    if (!name || !recipientAddress) {
      return NextResponse.json(
        { error: "Missing required fields: name, recipientAddress" },
        { status: 400 }
      );
    }

    const merchant = await prisma.merchant.create({
      data: { name, recipientAddress },
    });

    return NextResponse.json({ merchant }, { status: 201 });
  } catch (e) {
    console.error("POST /api/merchant failed:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}