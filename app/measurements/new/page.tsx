"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { MeasurementItem } from "@/lib/types";

export default function NewMeasurementPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [companyName, setCompanyName] = useState("");
  const [nameOfWork, setNameOfWork] = useState("");
  const [item, setItem] = useState("");
  
  const [items, setItems] = useState<MeasurementItem[]>([
    { particulars: "", no_of_items: 1, length_mm: 0, breadth_mm: 0, depth_mm: 0, remarks: "" }
  ]);

  function addItem() {
    setItems([...items, { particulars: "", no_of_items: 1, length_mm: 0, breadth_mm: 0, depth_mm: 0, remarks: "" }]);
  }

  function updateItem(index: number, field: keyof MeasurementItem, value: string | number) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          date,
          name_of_work: nameOfWork,
          item,
          items: items.filter(it => it.particulars || it.length_mm > 0)
        })
      });

      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      router.push(`/measurements/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Error saving measurement sheet");
    } finally {
      setSaving(false);
    }
  }

  // Calculate live totals
  let totalSqm = 0;
  items.forEach(it => {
    const l = Number(it.length_mm) || 0;
    const b = Number(it.breadth_mm) || 0;
    const d = Number(it.depth_mm) || 0;
    const no = Number(it.no_of_items) || 1;
    let qty = 0;
    if (d > 0) qty = l * b * d * no;
    else qty = l * b * no;
    
    if (it.is_less) {
      totalSqm -= qty;
    } else {
      totalSqm += qty;
    }
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">New Measurement Sheet</h1>
          <p className="text-sm text-navy/60">Create a new measurement record</p>
        </div>
        <div className="flex gap-2">
          <Link href="/measurements" className="rounded-md border border-navy/20 px-4 py-2 text-sm font-medium text-navy hover:bg-navy/5">
            Cancel
          </Link>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-orange px-4 py-2 text-sm font-medium text-white hover:bg-orange/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Sheet"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-navy border-b border-navy/10 pb-2">General Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/70 uppercase tracking-wider">Heading / Name</label>
            <input 
              type="text" 
              placeholder="e.g. KEDAR MANDAL"
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)} 
              className="w-full rounded-md border border-navy/20 p-2.5 text-sm outline-none focus:border-orange focus:ring-1 focus:ring-orange/50 transition-all"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/70 uppercase tracking-wider">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="w-full rounded-md border border-navy/20 p-2.5 text-sm outline-none focus:border-orange focus:ring-1 focus:ring-orange/50 transition-all"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/70 uppercase tracking-wider">Name of Work</label>
            <input 
              type="text" 
              placeholder="e.g. Renovation Work"
              value={nameOfWork} 
              onChange={e => setNameOfWork(e.target.value)} 
              className="w-full rounded-md border border-navy/20 p-2.5 text-sm outline-none focus:border-orange focus:ring-1 focus:ring-orange/50 transition-all"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-navy/70 uppercase tracking-wider">Item (Main Heading)</label>
            <input 
              type="text" 
              placeholder="e.g. Painting, Plumbing"
              value={item} 
              onChange={e => setItem(e.target.value)} 
              className="w-full rounded-md border border-navy/20 p-2.5 text-sm outline-none focus:border-orange focus:ring-1 focus:ring-orange/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-navy/10 pb-2">
          <h2 className="text-lg font-semibold text-navy">Measurement Items</h2>
          <button onClick={addItem} className="text-sm font-medium text-orange hover:underline">+ Add Row</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-navy/60 border-b border-navy/10">
              <tr>
                <th className="py-2 pr-2 font-semibold w-10">#</th>
                <th className="py-2 px-2 font-semibold w-24">Type</th>
                <th className="py-2 px-2 font-semibold">Particulars</th>
                <th className="py-2 px-2 font-semibold w-16 text-center">No</th>
                <th className="py-2 px-2 font-semibold w-24 text-center">Length</th>
                <th className="py-2 px-2 font-semibold w-24 text-center">Breadth</th>
                <th className="py-2 px-2 font-semibold w-24 text-center">Depth</th>
                <th className="py-2 px-2 font-semibold w-28 text-center bg-orange/5 rounded-t-md">Qty (Sqm)</th>
                <th className="py-2 px-2 font-semibold">Remarks</th>
                <th className="py-2 pl-2 font-semibold w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {items.map((it, idx) => {
                const l = Number(it.length_mm) || 0;
                const b = Number(it.breadth_mm) || 0;
                const d = Number(it.depth_mm) || 0;
                const no = Number(it.no_of_items) || 1;
                const qty = d > 0 ? l * b * d * no : l * b * no;

                return (
                  <tr key={idx} className="group">
                    <td className="py-2 pr-2 text-navy/40">{idx + 1}</td>
                    <td className="py-2 px-1">
                      <select 
                        value={it.is_less ? "less" : "add"} 
                        onChange={e => updateItem(idx, "is_less", e.target.value === "less")}
                        className={`w-full rounded p-1.5 outline-none font-medium text-xs uppercase ${it.is_less ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}
                      >
                        <option value="add">Add (+)</option>
                        <option value="less">Less (-)</option>
                      </select>
                    </td>
                    <td className="py-2 px-1">
                      <input type="text" placeholder="Description..." value={it.particulars} onChange={e => updateItem(idx, "particulars", e.target.value)} className="w-full rounded bg-transparent p-1.5 border border-transparent hover:border-navy/20 focus:border-orange focus:bg-white outline-none transition-all" />
                    </td>
                    <td className="py-2 px-1">
                      <input type="number" min="1" value={it.no_of_items} onChange={e => updateItem(idx, "no_of_items", e.target.value)} className="w-full rounded bg-transparent p-1.5 border border-transparent hover:border-navy/20 focus:border-orange focus:bg-white outline-none transition-all text-center" />
                    </td>
                    <td className="py-2 px-1">
                      <input type="number" min="0" value={it.length_mm || ''} onChange={e => updateItem(idx, "length_mm", e.target.value)} className="w-full rounded bg-[#FFF3EE] p-1.5 border border-transparent focus:border-orange focus:bg-white outline-none transition-all text-center" placeholder="0" />
                    </td>
                    <td className="py-2 px-1">
                      <input type="number" min="0" value={it.breadth_mm || ''} onChange={e => updateItem(idx, "breadth_mm", e.target.value)} className="w-full rounded bg-[#FFF3EE] p-1.5 border border-transparent focus:border-orange focus:bg-white outline-none transition-all text-center" placeholder="0" />
                    </td>
                    <td className="py-2 px-1">
                      <input type="number" min="0" value={it.depth_mm || ''} onChange={e => updateItem(idx, "depth_mm", e.target.value)} className="w-full rounded bg-[#FFF3EE] p-1.5 border border-transparent focus:border-orange focus:bg-white outline-none transition-all text-center" placeholder="0" />
                    </td>
                    <td className={`py-2 px-1 text-center font-mono font-medium bg-orange/5 ${it.is_less ? 'text-red-500' : 'text-orange'}`}>
                      {it.is_less && qty > 0 ? `(${qty.toFixed(4)})` : qty.toFixed(4)}
                    </td>
                    <td className="py-2 px-1">
                      <input type="text" placeholder="Notes..." value={it.remarks} onChange={e => updateItem(idx, "remarks", e.target.value)} className="w-full rounded bg-transparent p-1.5 border border-transparent hover:border-navy/20 focus:border-orange focus:bg-white outline-none transition-all" />
                    </td>
                    <td className="py-2 pl-2">
                      <button onClick={() => removeItem(idx)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded" title="Remove row">
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button onClick={addItem} className="mt-4 text-sm font-medium text-navy/60 hover:text-navy border border-dashed border-navy/20 w-full py-2 rounded-md hover:border-navy/40 transition-colors">
            + Add Another Row
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-full md:w-1/3 rounded-xl border border-navy/10 bg-navy text-white p-6 shadow-md space-y-3">
          <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4">Live Totals</h3>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/70 font-medium">Total Area / Vol (Sq.M/Cu.M):</span>
            <span className="font-mono text-lg">{totalSqm.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
            <span className="text-white/70 font-medium">Total Area / Vol (Sq.Ft/Cu.Ft):</span>
            <span className="font-mono text-lg text-orange font-bold">{(totalSqm * 10.7639).toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
