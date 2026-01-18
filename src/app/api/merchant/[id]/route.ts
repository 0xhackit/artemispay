import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1]; // last segment after /api/merchant/

    if (!id) {
      return NextResponse.json({ error: "Missing merchant id" }, { status: 400 });
    }

    const merchant = await prisma.merchant.findUnique({ where: { id } });

    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    return NextResponse.json({ merchant }, { status: 200 });
  } catch (e) {
    console.error("GET /api/merchant/[id] failed:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
