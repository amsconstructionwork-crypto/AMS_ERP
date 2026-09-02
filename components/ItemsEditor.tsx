"use client";

import { useState, useEffect } from "react";
import { QuotationItem, computeTotals, formatINR, DocType } from "@/lib/types";

const UNITS = ["Sft.", "Rft.", "Sq.m", "Nos", "Kg", "Bag", "Cum", "Lump sum", "Labour", "Mason"];

export default function ItemsEditor({
  items,
  onChange,
  gstPercent,
  discount,
  docType,
}: {
  items: QuotationItem[];
  onChange: (items: QuotationItem[]) => void;
  gstPercent: number;
  discount: number;
  docType: DocType;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionRow, setActiveSuggestionRow] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/suggestions?type=${docType}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
      })
      .catch((err) => console.error("Failed to load suggestions:", err));
  }, [docType]);

  function updateItem(idx: number, patch: Partial<QuotationItem>) {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    onChange(next);
  }

  function addRow() {
    onChange([...items, { description: "", unit: "Sft.", qty: 0, rate: 0 }]);
  }

  function removeRow(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  function handleDescKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === "Enter" && idx === items.length - 1) {
      e.preventDefault();
      addRow();
    }
  }

  const { subtotal, gst, grandTotal } = computeTotals(items, gstPercent, discount);

  return (
    <div>
      <div className="border border-navy/15 bg-white overflow-x-auto min-h-[400px] relative">
        <table className="w-full text-left text-sm min-w-[700px]">
          <thead>
            <tr className="bg-navy text-white">
              <th className="w-10 px-2 py-2 text-xs font-medium">Sr.</th>
              <th className="px-2 py-2 text-xs font-medium">Description of Work / Item</th>
              <th className="w-28 px-2 py-2 text-xs font-medium">Unit</th>
              <th className="w-20 px-2 py-2 text-xs font-medium">Qty</th>
              <th className="w-24 px-2 py-2 text-xs font-medium">Rate (₹)</th>
              <th className="w-28 px-2 py-2 text-right text-xs font-medium">Amount (₹)</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className={idx % 2 === 1 ? "bg-[#F3F6FA]" : ""}>
                <td className="px-2 py-1.5 text-center text-navy/60">{idx + 1}</td>
                <td className="p-2 border-b border-navy/5 relative">
                  <input
                    className="w-full rounded-md border border-navy/10 bg-navy/2 p-2 text-sm outline-none transition-all focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/20"
                    placeholder="e.g. Excavation & Foundation"
                    value={it.description}
                    onChange={(e) => updateItem(idx, { description: e.target.value })}
                    onKeyDown={(e) => handleDescKeyDown(e, idx)}
                    onFocus={() => setActiveSuggestionRow(idx)}
                    onBlur={() => setActiveSuggestionRow(null)}
                  />
                  {activeSuggestionRow === idx && suggestions.filter(s => s.toLowerCase().includes((it.description||'').toLowerCase())).length > 0 && (
                    <ul className="absolute left-2 right-2 top-[calc(100%-8px)] z-50 mt-1 max-h-56 overflow-y-auto rounded-md border border-navy/10 bg-white py-1 shadow-xl">
                      {suggestions
                        .filter(s => s.toLowerCase().includes((it.description||'').toLowerCase()))
                        .map((s, sIdx) => (
                          <li
                            key={sIdx}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              updateItem(idx, { description: s });
                              setActiveSuggestionRow(null);
                            }}
                            className="cursor-pointer px-3 py-2 text-sm text-navy hover:bg-navy/5"
                          >
                            {s}
                          </li>
                        ))}
                    </ul>
                  )}
                </td>
                <td className="p-2 border-b border-navy/5">
                  <select
                    className="w-full rounded-md border border-navy/10 bg-navy/2 p-2 text-sm outline-none transition-all focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/20"
                    value={it.unit}
                    onChange={(e) => updateItem(idx, { unit: e.target.value })}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border-b border-navy/5">
                  <input
                    type="number"
                    className="w-full rounded-md border border-navy/10 bg-navy/2 p-2 text-sm outline-none transition-all focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/20"
                    value={it.qty || ""}
                    onChange={(e) => updateItem(idx, { qty: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </td>
                <td className="p-2 border-b border-navy/5">
                  <input
                    type="number"
                    className="w-full rounded-md border border-navy/10 bg-navy/2 p-2 text-sm outline-none transition-all focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/20"
                    value={it.rate || ""}
                    onChange={(e) => updateItem(idx, { rate: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {formatINR((Number(it.qty) || 0) * (Number(it.rate) || 0))}
                </td>
                <td className="px-1 py-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="text-navy/30 hover:text-orange"
                    aria-label="Remove row"
                    title="Remove row"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-2 border border-dashed border-navy/25 px-3 py-1.5 text-sm text-navy/70 hover:border-orange hover:text-orange"
      >
        + Add row
      </button>

      <p className="mt-1 text-xs text-navy/40">
        Tip: press Enter in the last row&apos;s description to add a new row automatically.
      </p>

      <div className="ml-auto mt-4 w-full max-w-xs border border-navy/15">
        <div className="flex justify-between bg-cream px-3 py-1.5 text-sm">
          <span>Subtotal</span>
          <span className="tabular-nums">₹{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between border-t border-navy/15 px-3 py-1.5 text-sm">
          <span>GST @ {gstPercent}%</span>
          <span className="tabular-nums">₹{formatINR(gst)}</span>
        </div>
        <div className="flex justify-between border-t border-navy/15 px-3 py-1.5 text-sm">
          <span>Discount</span>
          <span className="tabular-nums">₹{formatINR(discount)}</span>
        </div>
        <div className="flex justify-between bg-navy px-3 py-2 text-sm font-semibold text-white">
          <span>Grand Total</span>
          <span className="tabular-nums text-orange">₹{formatINR(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
