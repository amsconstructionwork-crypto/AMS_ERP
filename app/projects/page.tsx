import Link from "next/link";
import { getSites, createSite } from "@/lib/actions/projects";
import { formatINR } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const sites = await getSites();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy">Projects & Ledgers</h1>
          <p className="text-sm text-navy/60 mt-1">Manage all site balances, bills, and payments.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
        <h2 className="text-xl font-bold text-navy mb-4">Add New Project</h2>
        <form action={createSite} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Project / Site Name *"
            required
            className="rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:border-orange focus:ring-orange bg-gray-50 text-navy"
          />
          <input
            type="text"
            name="client_name"
            placeholder="Client Name (Optional)"
            className="rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:border-orange focus:ring-orange bg-gray-50 text-navy"
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="address"
              placeholder="Address (Optional)"
              className="rounded-lg border-gray-300 p-3 text-sm shadow-sm focus:border-orange focus:ring-orange bg-gray-50 text-navy flex-1"
            />
            <button
              type="submit"
              className="rounded-lg bg-orange px-6 py-3 text-sm font-semibold text-white shadow hover:bg-orange-dark transition-colors"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sites.length === 0 ? (
          <div className="col-span-full py-12 text-center text-navy/50">
            No projects found. Add one above to get started.
          </div>
        ) : (
          sites.map((site: any) => (
            <Link
              key={site.id}
              href={`/projects/${site.id}`}
              className="group block overflow-hidden rounded-2xl bg-white shadow-sm border border-navy/5 transition-all hover:shadow-md hover:border-orange/30"
            >
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-navy group-hover:text-orange transition-colors">
                  {site.name}
                </h3>
                {site.client_name && <p className="text-sm text-navy/60 mt-1">{site.client_name}</p>}
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/60">Total Billed:</span>
                    <span className="font-medium text-navy">₹{formatINR(Number(site.total_billed))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/60">Total Received:</span>
                    <span className="font-medium text-green-600">₹{formatINR(Number(site.total_received))}</span>
                  </div>
                  <div className="h-px w-full bg-navy/5 my-2"></div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-navy">Pending Balance:</span>
                    <span className={site.pending_balance > 0 ? "text-orange" : "text-navy"}>
                      ₹{formatINR(site.pending_balance)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
