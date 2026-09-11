import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteById, getSiteBills, getSitePayments, createSiteBill, createSitePayment, deleteSiteBill, deleteSitePayment } from "@/lib/actions/projects";
import { formatINR } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SiteDashboardPage({
  params,
  searchParams,
}: {
  params: { siteId: string };
  searchParams: { tab?: string };
}) {
  const siteId = parseInt(params.siteId);
  if (isNaN(siteId)) notFound();

  const site = await getSiteById(siteId);
  if (!site) notFound();

  const bills = await getSiteBills(siteId);
  const payments = await getSitePayments(siteId);
  
  const tab = searchParams.tab || "overview";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
        <div>
          <Link href="/projects" className="text-sm text-orange hover:underline mb-2 inline-block">
            &larr; Back to Projects
          </Link>
          <h1 className="font-display text-3xl font-bold text-navy">{site.name}</h1>
          <p className="text-sm text-navy/60 mt-1">
            {site.client_name && <span className="font-medium">{site.client_name}</span>}
            {site.client_name && site.address && " • "}
            {site.address}
          </p>
        </div>
        <div>
          <a
            href={`/api/projects/${siteId}/pdf`}
            target="_blank"
            className="flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-navy/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Balance Sheet PDF
          </a>
        </div>
      </div>

      <div className="flex space-x-1 rounded-xl bg-navy/5 p-1">
        <Link
          href={`/projects/${siteId}?tab=overview`}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium text-center transition-all ${
            tab === "overview" ? "bg-white text-navy shadow" : "text-navy/60 hover:bg-white/50 hover:text-navy"
          }`}
        >
          Balance Sheet Overview
        </Link>
        <Link
          href={`/projects/${siteId}?tab=bills`}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium text-center transition-all ${
            tab === "bills" ? "bg-white text-navy shadow" : "text-navy/60 hover:bg-white/50 hover:text-navy"
          }`}
        >
          Bills Generated
        </Link>
        <Link
          href={`/projects/${siteId}?tab=payments`}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium text-center transition-all ${
            tab === "payments" ? "bg-white text-navy shadow" : "text-navy/60 hover:bg-white/50 hover:text-navy"
          }`}
        >
          Payments Received
        </Link>
      </div>

      {tab === "overview" && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 flex flex-col justify-center text-center">
            <p className="text-sm font-medium text-navy/60 uppercase tracking-wider mb-2">Total Billed</p>
            <p className="font-display text-4xl font-bold text-navy">₹{formatINR(Number(site.total_billed))}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 flex flex-col justify-center text-center">
            <p className="text-sm font-medium text-navy/60 uppercase tracking-wider mb-2">Total Received</p>
            <p className="font-display text-4xl font-bold text-green-600">₹{formatINR(Number(site.total_received))}</p>
          </div>
          <div className="bg-navy p-6 rounded-2xl shadow-lg border border-navy flex flex-col justify-center text-center">
            <p className="text-sm font-medium text-white/70 uppercase tracking-wider mb-2">Pending Balance</p>
            <p className="font-display text-4xl font-bold text-orange">₹{formatINR(site.pending_balance)}</p>
          </div>
        </div>
      )}

      {tab === "bills" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
          <h2 className="text-xl font-bold text-navy mb-4">Add Bill / Work Done</h2>
          <form action={createSiteBill.bind(null, siteId)} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <input type="date" name="bill_date" required defaultValue={new Date().toISOString().split('T')[0]} className="rounded-lg border-gray-300 p-3 text-sm" />
            <input type="text" name="bill_number" placeholder="Bill No. (e.g. RA-01)" required className="rounded-lg border-gray-300 p-3 text-sm" />
            <input type="text" name="work_area" placeholder="Work Area (e.g. 5000 sqft)" className="rounded-lg border-gray-300 p-3 text-sm" />
            <input type="text" name="description" placeholder="Description" className="rounded-lg border-gray-300 p-3 text-sm md:col-span-2" />
            <div className="flex gap-2">
              <input type="number" step="0.01" name="amount" placeholder="Amount" required className="rounded-lg border-gray-300 p-3 text-sm flex-1 w-full" />
              <button type="submit" className="rounded-lg bg-orange px-4 py-3 text-sm font-semibold text-white shadow hover:bg-orange-dark">+</button>
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-navy">
              <thead className="bg-navy/5 text-xs uppercase text-navy/60">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Date</th>
                  <th className="px-4 py-3">Bill No.</th>
                  <th className="px-4 py-3">Work Area</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Amount (₹)</th>
                  <th className="px-4 py-3 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr><td colSpan={6} className="py-4 text-center text-navy/50">No bills generated yet.</td></tr>
                ) : (
                  bills.map((bill: any) => (
                    <tr key={bill.id} className="border-b border-navy/5 last:border-0 hover:bg-navy/5">
                      <td className="px-4 py-3">{new Date(bill.bill_date).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3 font-medium">{bill.bill_number}</td>
                      <td className="px-4 py-3">{bill.work_area || "-"}</td>
                      <td className="px-4 py-3">{bill.description}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatINR(Number(bill.amount))}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={deleteSiteBill.bind(null, bill.id, siteId)}>
                          <button type="submit" className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "payments" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
          <h2 className="text-xl font-bold text-navy mb-4">Add Payment Received</h2>
          <form action={createSitePayment.bind(null, siteId)} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <input type="date" name="payment_date" required defaultValue={new Date().toISOString().split('T')[0]} className="rounded-lg border-gray-300 p-3 text-sm" />
            <input type="text" name="reference_no" placeholder="Ref No. (Cheque / UTR)" className="rounded-lg border-gray-300 p-3 text-sm" />
            <input type="number" step="0.01" name="amount" placeholder="Amount Received" required className="rounded-lg border-gray-300 p-3 text-sm w-full" />
            <button type="submit" className="rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-green-700">Add Payment</button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-navy">
              <thead className="bg-navy/5 text-xs uppercase text-navy/60">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Date</th>
                  <th className="px-4 py-3">Reference No.</th>
                  <th className="px-4 py-3 text-right">Amount (₹)</th>
                  <th className="px-4 py-3 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center text-navy/50">No payments received yet.</td></tr>
                ) : (
                  payments.map((payment: any) => (
                    <tr key={payment.id} className="border-b border-navy/5 last:border-0 hover:bg-navy/5">
                      <td className="px-4 py-3">{new Date(payment.payment_date).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3">{payment.reference_no}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">{formatINR(Number(payment.amount))}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={deleteSitePayment.bind(null, payment.id, siteId)}>
                          <button type="submit" className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
