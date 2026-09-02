"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ItemsEditor from "./ItemsEditor";
import { DocType, QuotationItem } from "@/lib/types";

const todayISO = () => new Date().toISOString().slice(0, 10);
const plus30 = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
};

const DEFAULT_QUOTATION_TERMS = `1. Payment Terms: 25% on agreement, 35% on foundation completion, 30% on structural completion, 10% on handover (milestone-based).
2. Rates quoted are valid for 30 days from the date of this quotation.
3. 1-Year workmanship warranty on all construction work. Waterproofing carries a 2-year guarantee. Material warranties as per manufacturer terms.
4. Any changes to scope of work will be quoted separately and added to the final bill.
5. Carting Debris Away from Site (Client).
6. Material procurement can be handled by AMS Civil Construction or supplied by client, as mutually agreed.`;

const DEFAULT_BILL_TERMS = `1. Payment Terms: Full payment is due within 7 days from the date of this invoice.
2. Payment Methods: Payments can be made via Cheque in favor of "AMS Civil Construction" / "Kedar Mandal", or via NEFT/RTGS to the provided bank account. Please verify all details prior to transfer.
3. Warranty: We provide a 1-year workmanship warranty on all completed construction services. Materials supplied are subject to their respective manufacturer's warranty terms and conditions.
4. Jurisdiction: All disputes are subject to Mumbai Jurisdiction.
5. Thank you for choosing AMS Civil Construction!`;

export default function NewDocumentForm({ defaultValues, isEditMode = false, editId }: { defaultValues?: any, isEditMode?: boolean, editId?: number }) {
  const router = useRouter();
  const [docType, setDocType] = useState<DocType>(defaultValues?.doc_type || "quotation");
  const [clientName, setClientName] = useState(defaultValues?.client_name || "");
  const [siteAddress, setSiteAddress] = useState(defaultValues?.site_address || "");
  const [clientPhone, setClientPhone] = useState(defaultValues?.client_phone || "");
  const [clientEmail, setClientEmail] = useState(defaultValues?.client_email || "");
  const [projectType, setProjectType] = useState(defaultValues?.project_type || "");
  
  // Always use today's date for a cloned document so it doesn't get old dates
  const [docDate, setDocDate] = useState(todayISO());
  const [validUntil, setValidUntil] = useState(plus30());
  
  const [gstPercent, setGstPercent] = useState(defaultValues?.gst_percent ?? 18);
  const [discount, setDiscount] = useState(defaultValues?.discount ?? 0);

  const initialDocType = defaultValues?.doc_type || "quotation";
  const defaultNotes = initialDocType === "bill" ? DEFAULT_BILL_TERMS : DEFAULT_QUOTATION_TERMS;
  const [notes, setNotes] = useState(defaultValues?.notes || defaultNotes);
  
  const defaultItems = defaultValues?.items 
    ? defaultValues.items.map((it: any) => ({ ...it, id: undefined, quotation_id: undefined }))
    : [{ description: "", unit: "Sft.", qty: 0, rate: 0 }];
    
  const [items, setItems] = useState<QuotationItem[]>(defaultItems);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode ? `/api/quotations/${editId}` : "/api/quotations";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_type: docType,
          client_name: clientName,
          site_address: siteAddress,
          client_phone: clientPhone,
          client_email: clientEmail,
          project_type: projectType,
          doc_date: docDate,
          valid_until: docType === "quotation" ? validUntil : null,
          gst_percent: gstPercent,
          discount,
          notes,
          items,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }
      const data = await res.json();
      router.push(`/quotations/${data.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to save document");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Bill To Section */}
        <div className="rounded-2xl border border-navy/5 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-4 sm:mb-5 flex items-center gap-3 border-b border-navy/5 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange/10 text-orange shrink-0">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h2 className="font-display text-lg font-semibold text-navy">Bill To</h2>
          </div>
          <div className="space-y-4">
            <Field label="Client Name">
              <input className="input" placeholder="e.g. Acme Corp" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </Field>
            <Field label="Site Address">
              <input className="input" placeholder="e.g. 123 Main St, Mumbai" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone">
                <input className="input" placeholder="+91 XXXXX XXXXX" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
              </Field>
              <Field label="Email">
                <input className="input" type="email" placeholder="client@example.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </Field>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="rounded-2xl border border-navy/5 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-4 sm:mb-5 flex items-center gap-3 border-b border-navy/5 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/10 text-navy shrink-0">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h2 className="font-display text-lg font-semibold text-navy">
              {docType === "bill" ? "Bill Details" : "Quotation Details"}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Date">
                <input className="input" type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} />
              </Field>
              {docType === "quotation" ? (
                <Field label="Valid Until">
                  <input className="input" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                </Field>
              ) : (
                <div className="hidden sm:block" />
              )}
            </div>
            <Field label={docType === "bill" ? "Subject / Bill For" : "Subject / Quotation For"}>
              <input
                className="input"
                placeholder="e.g. Bungalow Construction / Renovation"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              />
            </Field>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-navy/50">GST</label>
                  <button
                    type="button"
                    onClick={() => setGstPercent(gstPercent > 0 ? 0 : 18)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
                      gstPercent > 0 ? "bg-orange" : "bg-navy/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        gstPercent > 0 ? "translate-x-4.5" : "translate-x-1"
                      }`}
                      style={{ transform: gstPercent > 0 ? 'translateX(18px)' : 'translateX(2px)' }}
                    />
                  </button>
                </div>
                {gstPercent > 0 ? (
                  <div className="relative mt-1">
                    <input
                      className="input pr-8"
                      type="number"
                      value={gstPercent}
                      onChange={(e) => setGstPercent(parseFloat(e.target.value) || 0)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 text-sm pointer-events-none">%</span>
                  </div>
                ) : (
                  <div className="h-[42px] mt-1 flex items-center px-3 rounded-lg bg-navy/5 border border-transparent text-sm text-navy/40">
                    No GST
                  </div>
                )}
              </div>
              <Field label="Discount">
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 text-sm pointer-events-none">₹</span>
                  <input
                    className="input pl-7"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-navy/5 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-navy/5 bg-navy/2 px-4 sm:px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange text-white shrink-0">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h2 className="font-display text-lg font-semibold text-navy">Items</h2>
        </div>
        <div className="p-4 sm:p-6">
          <ItemsEditor items={items} onChange={setItems} gstPercent={gstPercent} discount={discount} docType={docType} />
        </div>
      </div>

      <div className="rounded-2xl border border-navy/5 bg-white p-4 sm:p-6 shadow-sm">
        <label className="mb-2 block text-sm font-semibold text-navy">Terms & Conditions</label>
        <textarea
          className="input min-h-[140px] resize-y"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add terms & conditions, payment details, or any other notes here..."
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <div className="sticky bottom-4 mt-8 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-orange px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange/30 transition-all hover:bg-orange/90 hover:shadow-orange/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Save {docType === "bill" ? "Bill" : "Quotation"}
            </>
          )}
        </button>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1.5px solid rgba(15, 33, 56, 0.1);
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          background-color: #f9fafb;
          color: #0f2138;
          transition: all 0.2s ease;
        }
        .input:hover {
          border-color: rgba(15, 33, 56, 0.2);
        }
        .input:focus {
          outline: none;
          background-color: #ffffff;
          border-color: #f26430;
          box-shadow: 0 0 0 4px rgba(242, 100, 48, 0.1);
        }
        .input::placeholder {
          color: rgba(15, 33, 56, 0.3);
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-navy/50">{label}</label>
      {children}
    </div>
  );
}
