"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MeasurementSheet } from "@/lib/types";

export default function MeasurementsPage() {
  const [sheets, setSheets] = useState<MeasurementSheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/measurements")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSheets(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-navy/60">Loading measurements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Measurement Sheets</h1>
          <p className="text-sm text-navy/60">Manage your measurement records</p>
        </div>
        <Link
          href="/measurements/new"
          className="rounded-md bg-orange px-4 py-2 text-sm font-medium text-white hover:bg-orange/90 transition-colors shadow-sm"
        >
          + New Measurement
        </Link>
      </div>

      <div className="rounded-xl border border-navy/10 bg-white shadow-sm overflow-hidden">
        {sheets.length === 0 ? (
          <div className="p-8 text-center text-navy/50">
            No measurement sheets found. Create your first one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-navy">
              <thead className="bg-navy/5 text-xs uppercase text-navy/60">
                <tr>
                  <th className="px-6 py-4 font-semibold">Sheet No.</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Name of Work</th>
                  <th className="px-6 py-4 font-semibold">Item</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {sheets.map((sheet) => (
                  <tr key={sheet.id} className="hover:bg-navy/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{sheet.sheet_number}</td>
                    <td className="px-6 py-4">{new Date(sheet.date).toLocaleDateString("en-IN")}</td>
                    <td className="px-6 py-4">{sheet.name_of_work || "-"}</td>
                    <td className="px-6 py-4">{sheet.item || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/measurements/${sheet.id}`}
                        className="text-orange hover:underline font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
