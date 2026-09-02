import { notFound } from "next/navigation";
import Link from "next/link";
import { requireDb } from "@/lib/db";
import { computeTotals, formatINR, Quotation } from "@/lib/types";
import ShareButtons from "@/components/ShareButtons";

export const dynamic = "force-dynamic";

async function getQuotation(id: number): Promise<Quotation | null> {
  const sql = requireDb();
  const qRows = await sql(`SELECT * FROM quotations WHERE id = $1`, [id]);
  if (qRows.length === 0) return null;
  const items = await sql(
    `SELECT id, description, unit, qty, rate FROM quotation_items WHERE quotation_id = $1 ORDER BY position ASC`,
    [id]
  );
  return { ...(qRows[0] as any), items } as Quotation;
}

function fmtDate(d: string | null) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function QuotationDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const quotation = await getQuotation(id);
  if (!quotation) notFound();

  const { subtotal, gst, grandTotal } = computeTotals(quotation.items, quotation.gst_percent, quotation.discount);
  const isBill = quotation.doc_type === "bill";

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy/15 pb-4">
        <div>
          <h1 className="font-display text-2xl">{quotation.doc_number}</h1>
          <p className="text-sm text-navy/60">
            {isBill ? "Bill" : "Quotation"} &middot; {fmtDate(quotation.doc_date)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full md:w-auto">
          <Link
            href={`/quotations/new?cloneId=${quotation.id}`}
            className="flex h-[38px] items-center justify-center rounded-md border border-navy/20 bg-white px-4 text-sm font-medium text-navy hover:bg-navy/5 w-full sm:w-auto transition-colors"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Clone
          </Link>
          <ShareButtons
            id={quotation.id}
            docNumber={quotation.doc_number}
            docType={quotation.doc_type}
            clientName={quotation.client_name}
            clientPhone={quotation.client_phone}
            clientEmail={quotation.client_email}
            grandTotal={formatINR(grandTotal)}
          />
        </div>
      </div>

      {/* Document preview */}
      <div className="border border-navy/15 bg-white overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center bg-navy px-4 sm:px-6 py-4 text-white gap-4">
          <div className="flex items-center">
            <div className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center bg-white rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="AMS" className="h-8 w-8" />
            </div>
            <div>
              <div className="font-display text-lg sm:text-xl leading-tight">AMS CIVIL CONSTRUCTION</div>
              <div className="text-[10px] sm:text-xs text-orange mt-0.5">Mumbai&apos;s Trusted Construction Partner | Since 2001</div>
            </div>
          </div>
          <div className="sm:ml-auto text-left sm:text-right border-t border-white/10 sm:border-t-0 pt-3 sm:pt-0">
            <div className="text-lg font-bold text-orange tracking-wider">{isBill ? "BILL" : "QUOTATION"}</div>
            <div className="text-xs text-white/80">{quotation.doc_number}</div>
          </div>
        </div>
        <div className="h-1 bg-orange" />

        <div className="p-4 sm:p-6">
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 bg-navy-light px-2 py-1 text-xs font-semibold text-white w-fit rounded-sm">Bill To</h3>
              <dl className="space-y-1.5 text-sm">
                <Row label="Client" value={quotation.client_name} />
                <Row label="Site Address" value={quotation.site_address} />
                <Row label="Phone" value={quotation.client_phone} />
                <Row label="Email" value={quotation.client_email} />
              </dl>
            </div>
            <div>
              <h3 className="mb-3 bg-navy-light px-2 py-1 text-xs font-semibold text-white w-fit rounded-sm">
                {isBill ? "Bill Details" : "Quotation Details"}
              </h3>
              <dl className="space-y-1.5 text-sm">
                <Row label="Doc No." value={quotation.doc_number} />
                <Row label="Date" value={fmtDate(quotation.doc_date)} />
                {!isBill && <Row label="Valid Until" value={fmtDate(quotation.valid_until)} />}
                <Row label={isBill ? "Subject / Bill For" : "Subject / Quotation For"} value={quotation.project_type} />
              </dl>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-navy/15 text-left text-sm min-w-[500px]">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-2 py-2 text-xs font-medium">Sr.</th>
                  <th className="px-2 py-2 text-xs font-medium">Description</th>
                  <th className="px-2 py-2 text-xs font-medium">Unit</th>
                  <th className="px-2 py-2 text-xs font-medium">Qty</th>
                  <th className="px-2 py-2 text-right text-xs font-medium">Rate</th>
                  <th className="px-2 py-2 text-right text-xs font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((it, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? "bg-[#F3F6FA]" : ""}>
                    <td className="px-2 py-1.5">{idx + 1}</td>
                    <td className="px-2 py-1.5">{it.description}</td>
                    <td className="px-2 py-1.5">{it.unit}</td>
                    <td className="px-2 py-1.5">{it.qty}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{formatINR(Number(it.rate))}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {formatINR(Number(it.qty) * Number(it.rate))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ml-auto mt-4 w-full sm:max-w-xs border border-navy/15">
            <div className="flex justify-between bg-cream px-3 py-1.5 text-sm">
              <span>Subtotal</span>
              <span className="tabular-nums">₹{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-navy/15 px-3 py-1.5 text-sm">
              <span>GST @ {quotation.gst_percent}%</span>
              <span className="tabular-nums">₹{formatINR(gst)}</span>
            </div>
            <div className="flex justify-between border-t border-navy/15 px-3 py-1.5 text-sm">
              <span>Discount</span>
              <span className="tabular-nums">₹{formatINR(Number(quotation.discount))}</span>
            </div>
            <div className="flex justify-between bg-navy px-3 py-2 text-sm font-semibold text-white">
              <span>Grand Total</span>
              <span className="tabular-nums text-orange">₹{formatINR(grandTotal)}</span>
            </div>
          </div>

          {quotation.notes && (
            <div className="mt-8">
              <h3 className="mb-3 bg-navy-light px-2 py-1 text-xs font-semibold text-white w-fit rounded-sm">Terms & Conditions</h3>
              <div className="text-sm text-navy/80 space-y-1">
                {quotation.notes.split(/\r?\n/).map((note, idx) => (
                  <p key={idx}>{note}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex">
      <dt className="w-24 sm:w-28 shrink-0 font-medium text-navy-light">{label}:</dt>
      <dd className="text-navy font-medium break-all pr-2">{value || "-"}</dd>
    </div>
  );
}
