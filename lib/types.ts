export type DocType = "quotation" | "bill";

export interface QuotationItem {
  id?: number;
  description: string;
  unit: string;
  qty: number;
  rate: number;
}

export interface Quotation {
  id: number;
  doc_type: DocType;
  doc_number: string;
  client_name: string;
  site_address: string;
  client_phone: string;
  client_email: string;
  project_type: string;
  doc_date: string;
  valid_until: string | null;
  gst_percent: number;
  discount: number;
  notes: string;
  created_at: string;
  items: QuotationItem[];
}

export interface QuotationInput {
  doc_type: DocType;
  client_name: string;
  site_address: string;
  client_phone: string;
  client_email: string;
  project_type: string;
  doc_date: string;
  valid_until: string | null;
  gst_percent: number;
  discount: number;
  notes: string;
  items: QuotationItem[];
}

export function computeTotals(items: QuotationItem[], gstPercent: number, discount: number) {
  const subtotal = items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);
  const gst = (subtotal * (Number(gstPercent) || 0)) / 100;
  const grandTotal = subtotal + gst - (Number(discount) || 0);
  return { subtotal, gst, grandTotal };
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(
    Number.isFinite(n) ? n : 0
  );
}

export interface MeasurementItem {
  id?: number;
  particulars: string;
  no_of_items: number;
  length_mm: number;
  breadth_mm: number;
  depth_mm: number;
  remarks: string;
}

export interface MeasurementSheet {
  id: number;
  sheet_number: string;
  name_of_work: string;
  item: string;
  date: string;
  created_at: string;
  items: MeasurementItem[];
}
