import { NextResponse } from "next/server";
import { requireDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const sql = requireDb();
    const sheets = await sql(`SELECT * FROM measurements WHERE id = $1`, [id]);
    if (sheets.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const items = await sql(
      `SELECT * FROM measurement_items WHERE measurement_id = $1 ORDER BY position ASC`,
      [id]
    );

    return NextResponse.json({ ...sheets[0], items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const sql = requireDb();
    await sql(`DELETE FROM measurements WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const sql = requireDb();
    const body = await req.json();
    const { company_name, name_of_work, item, date, items, summary_items } = body;

    await sql(
      `UPDATE measurements SET company_name=$1, name_of_work=$2, item=$3, date=$4, summary_items=$5 WHERE id=$6`,
      [company_name || 'KEDAR MANDAL', name_of_work, item, date, JSON.stringify(summary_items || []), id]
    );

    await sql(`DELETE FROM measurement_items WHERE measurement_id = $1`, [id]);

    if (Array.isArray(items) && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        await sql(
          `INSERT INTO measurement_items (measurement_id, position, particulars, no_of_items, length_mm, breadth_mm, depth_mm, is_less, remarks)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            id,
            i,
            it.particulars || '',
            Number(it.no_of_items) || 1,
            Number(it.length_mm) || 0,
            Number(it.breadth_mm) || 0,
            Number(it.depth_mm) || 0,
            Boolean(it.is_less),
            it.remarks || ''
          ]
        );
      }
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
