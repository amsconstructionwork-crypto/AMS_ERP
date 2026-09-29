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
    const { name_of_work, item, date, items } = body;

    await sql(
      `UPDATE measurements SET name_of_work=$1, item=$2, date=$3 WHERE id=$4`,
      [name_of_work, item, date, id]
    );

    await sql(`DELETE FROM measurement_items WHERE measurement_id = $1`, [id]);

    if (Array.isArray(items) && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        await sql(
          `INSERT INTO measurement_items (measurement_id, position, particulars, no_of_items, length_mm, breadth_mm, depth_mm, remarks)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            id,
            i,
            it.particulars || '',
            Number(it.no_of_items) || 1,
            Number(it.length_mm) || 0,
            Number(it.breadth_mm) || 0,
            Number(it.depth_mm) || 0,
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
