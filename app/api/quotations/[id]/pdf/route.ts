import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { requireDb } from "@/lib/db";
import QuotationPdf from "@/components/QuotationPdf";
import type { Quotation } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let cachedLogoBase64: string | null = null;
function getLogoBase64() {
  if (cachedLogoBase64) return cachedLogoBase64;
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const buf = fs.readFileSync(logoPath);
  cachedLogoBase64 = `data:image/png;base64,${buf.toString("base64")}`;
  return cachedLogoBase64;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = requireDb();
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const qRows = await sql(`SELECT * FROM quotations WHERE id = $1`, [id]);
    if (qRows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const items = await sql(
      `SELECT description, unit, qty, rate FROM quotation_items WHERE quotation_id = $1 ORDER BY position ASC`,
      [id]
    );

    const quotation = { ...qRows[0], items } as unknown as Quotation;
    const logoBase64 = getLogoBase64();

    const buffer = await renderToBuffer(
      React.createElement(QuotationPdf, { quotation, logoBase64 }) as any
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${quotation.doc_number}.pdf"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to generate PDF" }, { status: 500 });
  }
}
