import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { requireDb } from "@/lib/db";
import MeasurementPdf from "@/components/MeasurementPdf";
import type { MeasurementSheet } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = requireDb();
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const qRows = await sql(`SELECT * FROM measurements WHERE id = $1`, [id]);
    if (qRows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const items = await sql(
      `SELECT * FROM measurement_items WHERE measurement_id = $1 ORDER BY position ASC`,
      [id]
    );

    const sheet = { ...qRows[0], items } as unknown as MeasurementSheet;

    const buffer = await renderToBuffer(
      React.createElement(MeasurementPdf, { sheet }) as any
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${sheet.sheet_number}.pdf"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to generate PDF" }, { status: 500 });
  }
}
