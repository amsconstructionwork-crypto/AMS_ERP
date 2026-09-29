"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { MeasurementSheet } from "@/lib/types";

export default function MeasurementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [sheet, setSheet] = useState<MeasurementSheet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/measurements/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSheet(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="p-8 text-navy/60">Loading...</div>;
  if (!sheet) return <div className="p-8 text-red-500">Measurement sheet not found</div>;

  let totalAdd = 0;
  let totalLess = 0;
  sheet.items.forEach(it => {
    const l = Number(it.length_mm) || 0;
    const b = Number(it.breadth_mm) || 0;
    const d = Number(it.depth_mm) || 0;
    const no = Number(it.no_of_items) || 1;
    let qty = 0;
    if (d > 0) qty = l * b * d * no;
    else qty = l * b * no;
    
    if (it.is_less) totalLess += qty;
    else totalAdd += qty;
  });

  const totalSqm = totalAdd - totalLess;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this sheet?")) return;
    try {
      await fetch(`/api/measurements/${sheet?.id}`, { method: "DELETE" });
      router.push("/measurements");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  }

  function downloadPdf() {
    window.open(`/api/measurements/${sheet?.id}/pdf`, "_blank");
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Measurement Sheet {sheet.sheet_number}</h1>
          <p className="text-sm text-navy/60">
            {sheet.name_of_work} • {sheet.item} • {new Date(sheet.date).toLocaleDateString("en-IN")}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDelete}
            className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
          <button 
            onClick={downloadPdf}
            className="rounded-md bg-orange px-4 py-2 text-sm font-medium text-white hover:bg-orange/90 transition-colors"
          >
            ⬇ Download PDF
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-navy/10 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy/5 text-xs uppercase text-navy/60 border-b border-navy/10">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Particulars</th>
                <th className="px-4 py-3 font-semibold text-center">No</th>
                <th className="px-4 py-3 font-semibold text-center">Length</th>
                <th className="px-4 py-3 font-semibold text-center">Breadth</th>
                <th className="px-4 py-3 font-semibold text-center">Depth</th>
                <th className="px-4 py-3 font-semibold text-center bg-orange/5">Qty (Sqm)</th>
                <th className="px-4 py-3 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {sheet.items.map((it, idx) => {
                const l = Number(it.length_mm) || 0;
                const b = Number(it.breadth_mm) || 0;
                const d = Number(it.depth_mm) || 0;
                const no = Number(it.no_of_items) || 1;
                const qty = d > 0 ? l * b * d * no : l * b * no;

                const formatVal = (val: any) => val ? Number(val).toFixed(3) : '-';

                return (
                  <tr key={idx} className="hover:bg-navy/5">
                    <td className="px-4 py-3 text-navy/50">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">
                      {it.particulars}
                      {it.is_less && <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">LESS</span>}
                    </td>
                    <td className="px-4 py-3 text-center">{it.no_of_items}</td>
                    <td className="px-4 py-3 text-center text-navy/70">{formatVal(it.length_mm)}</td>
                    <td className="px-4 py-3 text-center text-navy/70">{formatVal(it.breadth_mm)}</td>
                    <td className="px-4 py-3 text-center text-navy/70">{formatVal(it.depth_mm)}</td>
                    <td className={`px-4 py-3 text-center font-mono font-medium bg-orange/5 ${it.is_less ? 'text-red-500' : 'text-orange'}`}>
                      {it.is_less && qty > 0 ? `(${qty.toFixed(4)})` : qty.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-navy/70">{it.remarks || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-full md:w-1/3 rounded-xl border border-navy/10 bg-navy text-white p-6 shadow-md space-y-3">
          <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4">Total Measurements</h3>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/70 font-medium">Gross Area:</span>
            <span className="font-mono text-lg">{totalAdd.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-red-300">
            <span className="font-medium">Total Deductions:</span>
            <span className="font-mono text-lg">- {totalLess.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
            <span className="text-white/70 font-medium">Net Area (Sq.M):</span>
            <span className="font-mono text-lg font-bold">{totalSqm.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
            <span className="text-white/70 font-medium">Net Area (Sq.Ft):</span>
            <span className="font-mono text-lg text-orange font-bold">{(totalSqm * 10.7639).toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
