import NewDocumentForm from "@/components/NewDocumentForm";
import { requireDb } from "@/lib/db";
import { Quotation } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getCloneData(id: string): Promise<Partial<Quotation> | undefined> {
  const cloneId = Number(id);
  if (!Number.isFinite(cloneId)) return undefined;

  const sql = requireDb();
  const qRows = await sql(`SELECT * FROM quotations WHERE id = $1`, [cloneId]);
  if (qRows.length === 0) return undefined;
  
  const items = await sql(
    `SELECT description, unit, qty, rate FROM quotation_items WHERE quotation_id = $1 ORDER BY position ASC`,
    [cloneId]
  );
  
  const original = qRows[0] as any;
  // Exclude ID-specific fields
  const { id: _, doc_number, created_at, updated_at, doc_date, valid_until, ...rest } = original;
  
  return { ...rest, items };
}

export default async function NewQuotationPage({ searchParams }: { searchParams: { cloneId?: string, type?: string } }) {
  let defaultValues;
  if (searchParams.cloneId) {
    defaultValues = await getCloneData(searchParams.cloneId);
  } else if (searchParams.type) {
    defaultValues = { doc_type: searchParams.type };
  }

  return (
    <div>
      <div className="mb-6 border-b border-navy/15 pb-4">
        <h1 className="font-display text-2xl">New Quotation / Bill {defaultValues ? "(Cloned)" : ""}</h1>
        <p className="text-sm text-navy/60">Fill in the details below — totals calculate automatically.</p>
      </div>
      <NewDocumentForm defaultValues={defaultValues} />
    </div>
  );
}
