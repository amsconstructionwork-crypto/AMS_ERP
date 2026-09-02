-- AMS Civil Construction — Billing & Quotation schema
-- Run this once against your Neon Postgres database.

CREATE TABLE IF NOT EXISTS quotations (
  id             SERIAL PRIMARY KEY,
  doc_type       TEXT NOT NULL DEFAULT 'quotation' CHECK (doc_type IN ('quotation', 'bill')),
  doc_number     TEXT NOT NULL UNIQUE,
  client_name    TEXT NOT NULL DEFAULT '',
  site_address   TEXT NOT NULL DEFAULT '',
  client_phone   TEXT NOT NULL DEFAULT '',
  client_email   TEXT NOT NULL DEFAULT '',
  project_type   TEXT NOT NULL DEFAULT '',
  doc_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until    DATE,
  gst_percent    NUMERIC(5,2) NOT NULL DEFAULT 18,
  discount       NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes          TEXT NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotation_items (
  id             SERIAL PRIMARY KEY,
  quotation_id   INTEGER NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  position       INTEGER NOT NULL DEFAULT 0,
  description    TEXT NOT NULL DEFAULT '',
  unit           TEXT NOT NULL DEFAULT '',
  qty            NUMERIC(12,2) NOT NULL DEFAULT 0,
  rate           NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);

-- Sequence used to generate friendly document numbers like AMS-QT-0001 / AMS-BL-0001
CREATE SEQUENCE IF NOT EXISTS quotation_number_seq START 1;
CREATE SEQUENCE IF NOT EXISTS bill_number_seq START 1;
