import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import NewDocumentForm from "@/components/NewDocumentForm";

export const dynamic = "force-dynamic";

export default async function EditQuotationPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  if (!sql) notFound();

  const qRows = await sql(`SELECT * FROM quotations WHERE id = $1`, [id]);
  if (qRows.length === 0) notFound();

  const quotation = qRows[0];
  const createdAt = new Date(quotation.created_at).getTime();

  if (Date.now() - createdAt > 20 * 60 * 1000) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold text-red-500">Editing Disabled</h1>
        <p className="mt-4 text-navy/70">You can only edit documents within 20 minutes of their creation.</p>
        <a href="/" className="mt-6 text-orange hover:underline">← Back to Dashboard</a>
      </div>
    );
  }

  const items = await sql(
    `SELECT id, description, unit, qty, rate FROM quotation_items WHERE quotation_id = $1 ORDER BY position ASC`,
    [id]
  );

  const defaultValues = { ...quotation, items };

  return (
    <div className="mx-auto max-w-4xl pt-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-navy">
          Edit {quotation.doc_type === "bill" ? "Bill" : "Quotation"}
        </h1>
        <span className="text-navy/60 font-medium">#{quotation.doc_number}</span>
      </div>
      <NewDocumentForm defaultValues={defaultValues} isEditMode={true} editId={id} />
    </div>
  );
}
