import { NextResponse } from "next/server";
import { requireDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = requireDb();
    const rows = await sql(`SELECT * FROM measurements ORDER BY created_at DESC`);
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = requireDb();
    const body = await req.json();
    
    // Generate sheet number like AMS-MS-0001
    const seq = await sql(`SELECT nextval('measurement_number_seq')`);
    const num = seq[0].nextval;
    const padded = String(num).padStart(4, "0");
    const sheet_number = `AMS-MS-${padded}`;

    const {
      company_name,
      name_of_work,
      item,
      date,
      items // Array of measurement_items
    } = body;

    const result = await sql(
      `INSERT INTO measurements (sheet_number, company_name, name_of_work, item, date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [sheet_number, company_name || 'KEDAR MANDAL', name_of_work || '', item || '', date || new Date().toISOString().split('T')[0]]
    );

    const sheetId = result[0].id;

    if (Array.isArray(items) && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        await sql(
          `INSERT INTO measurement_items (measurement_id, position, particulars, no_of_items, length_mm, breadth_mm, depth_mm, is_less, remarks)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            sheetId,
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

    return NextResponse.json({ success: true, id: sheetId });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
