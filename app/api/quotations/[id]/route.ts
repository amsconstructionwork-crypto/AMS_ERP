import { NextResponse } from "next/server";
import { requireDb } from "@/lib/db";

export const dynamic = "force-dynamic";

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
      `SELECT id, description, unit, qty, rate FROM quotation_items WHERE quotation_id = $1 ORDER BY position ASC`,
      [id]
    );

    return NextResponse.json({ ...qRows[0], items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to load document" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = requireDb();
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const qRows = await sql(`SELECT created_at FROM quotations WHERE id = $1`, [id]);
    if (qRows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const createdAt = new Date(qRows[0].created_at).getTime();
    if (Date.now() - createdAt > 20 * 60 * 1000) {
      return NextResponse.json({ error: "Editing and deleting is disabled after 20 minutes." }, { status: 403 });
    }

    await sql(`DELETE FROM quotation_items WHERE quotation_id = $1`, [id]);
    await sql(`DELETE FROM quotations WHERE id = $1`, [id]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = requireDb();
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const qRows = await sql(`SELECT created_at FROM quotations WHERE id = $1`, [id]);
    if (qRows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const createdAt = new Date(qRows[0].created_at).getTime();
    if (Date.now() - createdAt > 20 * 60 * 1000) {
      return NextResponse.json({ error: "Editing and deleting is disabled after 20 minutes." }, { status: 403 });
    }

    const body = await req.json();
    const {
      client_name,
      site_address,
      client_phone,
      client_email,
      project_type,
      doc_date,
      valid_until,
      gst_percent,
      discount,
      notes,
      items
    } = body;

    await sql(`
      UPDATE quotations
      SET client_name = $1, site_address = $2, client_phone = $3, client_email = $4,
          project_type = $5, doc_date = $6, valid_until = $7, gst_percent = $8,
          discount = $9, notes = $10
      WHERE id = $11
    `, [
      client_name, site_address, client_phone, client_email,
      project_type, doc_date, valid_until, Number(gst_percent),
      Number(discount), notes, id
    ]);

    await sql(`DELETE FROM quotation_items WHERE quotation_id = $1`, [id]);

    if (items && Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        await sql(`
          INSERT INTO quotation_items (quotation_id, position, description, unit, qty, rate)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          id, i, it.description, it.unit, Number(it.qty), Number(it.rate)
        ]);
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to update" }, { status: 500 });
  }
}
