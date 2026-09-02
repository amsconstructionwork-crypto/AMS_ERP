import Link from "next/link";
import { sql } from "@/lib/db";
import { formatINR } from "@/lib/types";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

async function getBills() {
  if (!sql) return [];
  try {
    const rows = await sql(
      `SELECT q.*, COALESCE(SUM(i.qty * i.rate), 0) AS subtotal
       FROM quotations q
       LEFT JOIN quotation_items i ON i.quotation_id = q.id
       WHERE q.doc_type = 'bill'
       GROUP BY q.id
       ORDER BY q.created_at DESC`
    );
    return rows;
  } catch {
    return [];
  }
}

function fmtDate(d: string) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function BillsPage() {
  const docs = await getBills();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-navy">All Bills</h1>
          <p className="mt-1 text-sm text-navy/60">View and manage all your bills.</p>
        </div>
        <Link
          href="/quotations/new?type=bill"
          className="flex items-center justify-center sm:justify-start w-full sm:w-auto rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-navy/90 hover:shadow-md"
        >
          + New Bill
        </Link>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
        <div className="flex-1 overflow-x-auto">
          {docs.length === 0 ? (
            <div className="p-8 text-center text-sm text-navy/50">No bills yet.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-navy/10 bg-navy/5 text-navy/70">
                  <th className="px-5 py-3 font-medium">Doc No.</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="border-b border-navy/5 last:border-0 transition-colors hover:bg-navy/5">
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-navy">{d.doc_number}</td>
                    <td className="truncate px-5 py-3 max-w-[200px]">{d.client_name || <span className="text-navy/40">—</span>}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-navy/70">{fmtDate(d.doc_date)}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums font-medium">
                      &#8377;{formatINR(Number(d.subtotal))}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right space-x-3">
                      <Link href={`/quotations/new?cloneId=${d.id}`} className="text-navy/50 transition-colors hover:text-navy" title="Clone">
                        <svg className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </Link>
                      {Date.now() - new Date(d.created_at).getTime() <= 20 * 60 * 1000 ? (
                        <>
                          <Link href={`/quotations/${d.id}/edit`} className="text-navy/50 transition-colors hover:text-orange" title="Edit">
                            <svg className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Link>
                          <DeleteButton id={d.id} />
                        </>
                      ) : (
                        <>
                          <span title="Editing disabled after 20 mins" className="text-navy/20 cursor-not-allowed">
                            <svg className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </span>
                          <span title="Deleting disabled after 20 mins" className="text-navy/20 cursor-not-allowed">
                            <svg className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </span>
                        </>
                      )}
                      <Link href={`/quotations/${d.id}`} className="transition-colors font-medium text-navy hover:text-navy/80" title="View">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
