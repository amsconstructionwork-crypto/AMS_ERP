import Link from "next/link";
import { sql } from "@/lib/db";
import { formatINR } from "@/lib/types";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

async function getDocuments() {
  if (!sql) return { docs: [] as any[], notConfigured: true };
  try {
    const rows = await sql(
      `SELECT q.*, COALESCE(SUM(i.qty * i.rate), 0) AS subtotal
       FROM quotations q
       LEFT JOIN quotation_items i ON i.quotation_id = q.id
       GROUP BY q.id
       ORDER BY q.created_at DESC
       LIMIT 200`
    );
    return { docs: rows, notConfigured: false };
  } catch {
    return { docs: [] as any[], notConfigured: true };
  }
}

function fmtDate(d: string) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function DashboardPage() {
  const { docs, notConfigured } = await getDocuments();

  if (notConfigured) {
    return (
      <div className="border border-navy/15 bg-white p-8">
        <h1 className="font-display text-2xl">Database not connected yet</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-navy/70">
          Add your Neon Postgres connection string to <code className="bg-navy/5 px-1">.env.local</code> as{" "}
          <code className="bg-navy/5 px-1">DATABASE_URL</code>, then run{" "}
          <code className="bg-navy/5 px-1">npm run db:init</code> to create the tables. See{" "}
          <code className="bg-navy/5 px-1">README.md</code> for the full setup guide.
        </p>
      </div>
    );
  }

  const bills = docs.filter((d) => d.doc_type === "bill");
  const quotations = docs.filter((d) => d.doc_type === "quotation");

  const totalBillsAmount = bills.reduce((acc, b) => acc + Number(b.subtotal), 0);
  const totalQuotationsAmount = quotations.reduce((acc, q) => acc + Number(q.subtotal), 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-navy">Dashboard</h1>
          <p className="mt-1 text-sm text-navy/60">Overview of your business documents.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/quotations/new?type=quotation"
            className="flex items-center rounded-md bg-orange px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange/90 hover:shadow-md"
          >
            + New Quotation
          </Link>
          <Link
            href="/quotations/new?type=bill"
            className="flex items-center rounded-md bg-navy px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-navy/90 hover:shadow-md"
          >
            + New Bill
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Quotations" value={quotations.length.toString()} icon="📄" color="orange" />
        <Card title="Total Bills" value={bills.length.toString()} icon="🧾" color="navy" />
        <Card title="Quotations Value" value={`₹${formatINR(totalQuotationsAmount)}`} icon="₹" color="orange" />
        <Card title="Bills Value" value={`₹${formatINR(totalBillsAmount)}`} icon="₹" color="navy" />
      </div>

      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-navy/20 bg-white p-12 text-center shadow-sm">
          <div className="mb-4 rounded-full bg-navy/5 p-4 text-3xl">📭</div>
          <p className="font-display text-lg font-medium text-navy">No documents yet</p>
          <p className="mt-1 text-sm text-navy/60">Create your first quotation or bill to see it here.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/quotations/new?type=quotation"
              className="rounded-md bg-orange px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange/90"
            >
              + New Quotation
            </Link>
            <Link
              href="/quotations/new?type=bill"
              className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy/90"
            >
              + New Bill
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Quotations Section */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-navy/10 bg-[#FFF3EE] px-5 py-4">
              <h2 className="font-display text-lg font-bold text-orange">Recent Quotations</h2>
              <Link href="/quotations" className="text-sm font-medium text-orange hover:underline">
                View All →
              </Link>
            </div>
            <div className="flex-1 overflow-x-auto">
              <DocumentTable docs={quotations.slice(0, 5)} type="quotation" emptyMessage="No quotations yet." />
            </div>
          </div>

          {/* Bills Section */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-5 py-4">
              <h2 className="font-display text-lg font-bold text-white">Recent Bills</h2>
              <Link href="/bills" className="text-sm font-medium text-white/80 hover:text-white hover:underline">
                View All →
              </Link>
            </div>
            <div className="flex-1 overflow-x-auto">
              <DocumentTable docs={bills.slice(0, 5)} type="bill" emptyMessage="No bills yet." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents
function Card({ title, value, icon, color }: { title: string; value: string; icon: string; color: "orange" | "navy" }) {
  const isOrange = color === "orange";
  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-navy/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className={`mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${isOrange ? "bg-[#FFF3EE] text-orange" : "bg-navy/10 text-navy"}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-navy/60">{title}</p>
        <p className={`mt-1 font-sans text-2xl font-bold tracking-tight ${isOrange ? "text-orange" : "text-navy"}`}>{value}</p>
      </div>
    </div>
  );
}

function DocumentTable({ docs, type, emptyMessage }: { docs: any[]; type: "quotation" | "bill"; emptyMessage: string }) {
  if (docs.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-navy/50">
        {emptyMessage}
      </div>
    );
  }

  const isOrange = type === "quotation";
  const hoverClass = isOrange ? "hover:bg-[#FFF3EE]/50" : "hover:bg-navy/5";
  const linkHoverClass = isOrange ? "hover:text-orange" : "hover:text-navy";

  return (
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
          <tr key={d.id} className={`border-b border-navy/5 last:border-0 transition-colors ${hoverClass}`}>
            <td className="whitespace-nowrap px-5 py-3 font-medium text-navy">{d.doc_number}</td>
            <td className="truncate px-5 py-3 max-w-[120px]">{d.client_name || <span className="text-navy/40">—</span>}</td>
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
              <Link href={`/quotations/${d.id}`} className={`transition-colors font-medium ${isOrange ? "text-orange" : "text-navy"} ${linkHoverClass}`} title="View">
                View →
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
