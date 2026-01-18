import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    // pathname: /api/invoice/<id>/status
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 2]; // second last is invoice id

    if (!id) {
      return NextResponse.json({ error: "Missing invoice id" }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // auto-expire
    const now = new Date();
    if (invoice.status === "PENDING" && invoice.expiresAt <= now) {
      const updated = await prisma.invoice.update({
        where: { id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json(
        { status: updated.status, expiresAt: updated.expiresAt, txHash: updated.txHash },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: invoice.status, expiresAt: invoice.expiresAt, txHash: invoice.txHash },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/invoice/[id]/status failed", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
