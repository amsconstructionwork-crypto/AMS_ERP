import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDb } from "@/lib/db";
import { QuotationInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = requireDb();
    const rows = await sql(
      `SELECT q.*,
              COALESCE(SUM(i.qty * i.rate), 0) AS subtotal
       FROM quotations q
       LEFT JOIN quotation_items i ON i.quotation_id = q.id
       GROUP BY q.id
       ORDER BY q.created_at DESC
       LIMIT 200`
    );
    return NextResponse.json({ quotations: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to load documents" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = requireDb();
    const body = (await req.json()) as QuotationInput;

    if (!body.doc_type || (body.doc_type !== "quotation" && body.doc_type !== "bill")) {
      return NextResponse.json({ error: "doc_type must be 'quotation' or 'bill'" }, { status: 400 });
    }

    // Generate a friendly doc number, e.g. AMS-QT-0001 / AMS-BL-0001
    const prefix = body.doc_type === "quotation" ? "QT" : "BL";
    const seqName = body.doc_type === "quotation" ? "quotation_number_seq" : "bill_number_seq";
    const seqRows = await sql(`SELECT nextval($1) AS n`, [seqName]);
    const n = Number(seqRows[0].n);
    const docNumber = `AMS-${prefix}-${String(n).padStart(4, "0")}`;

    const inserted = await sql(
      `INSERT INTO quotations
        (doc_type, doc_number, client_name, site_address, client_phone, client_email,
         project_type, doc_date, valid_until, gst_percent, discount, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id`,
      [
        body.doc_type,
        docNumber,
        body.client_name || "",
        body.site_address || "",
        body.client_phone || "",
        body.client_email || "",
        body.project_type || "",
        body.doc_date || new Date().toISOString().slice(0, 10),
        body.valid_until || null,
        body.gst_percent ?? 18,
        body.discount ?? 0,
        body.notes || "",
      ]
    );
    const quotationId = inserted[0].id as number;

    const items = (body.items || []).filter((it) => (it.description || "").trim() !== "");
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      await sql(
        `INSERT INTO quotation_items (quotation_id, position, description, unit, qty, rate)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [quotationId, i, it.description, it.unit || "", it.qty || 0, it.rate || 0]
      );
    }

    revalidatePath("/", "layout");

    return NextResponse.json({ id: quotationId, doc_number: docNumber }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to create document" }, { status: 500 });
  }
}
