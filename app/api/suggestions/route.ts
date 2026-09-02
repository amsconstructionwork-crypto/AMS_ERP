import { NextResponse } from "next/server";
import { requireDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type || (type !== "quotation" && type !== "bill")) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const sql = requireDb();

  try {
    const rows = await sql`
      SELECT DISTINCT i.description 
      FROM quotation_items i
      JOIN quotations q ON i.quotation_id = q.id
      WHERE q.doc_type = ${type} 
        AND i.description IS NOT NULL 
        AND i.description != ''
      ORDER BY i.description ASC
    `;

    const suggestions = rows.map((r: any) => r.description);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
