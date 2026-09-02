# AMS Civil Construction — Billing & Quotation App

A simple, fast web app to create Quotations and Bills for AMS Civil Construction,
and share them instantly on WhatsApp or Email as a branded PDF.

Built with **Next.js 14** (App Router) and **Neon Postgres** (serverless).

---

## What it does

- Create a **Quotation** or **Bill** with client details and line items (description, unit, qty, rate)
- Totals (Subtotal, GST, Discount, Grand Total) calculate live as you type
- Press **Enter** in the last item row to auto-add a new row
- Every document gets a friendly number automatically: `AMS-QT-0001`, `AMS-BL-0001`, ...
- **Download PDF** — a branded PDF (logo, navy & orange theme) generated on the fly
- **Share on WhatsApp** — opens WhatsApp with a pre-filled message + PDF link
- **Share via Email** — opens your email app with a pre-filled message + PDF link
- Dashboard lists every document you've created

---

## 1. Create your free Neon database

1. Go to **https://neon.tech** and sign up (free tier is enough).
2. Create a new Project (any region close to India, e.g. Singapore, works well).
3. On the project dashboard, click **Connection Details** and copy the
   **pooled connection string** (it looks like:
   `postgres://user:password@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`).

---

## 2. Run the project locally

You'll need [Node.js](https://nodejs.org) 18 or newer installed on your computer.

```bash
# 1. Unzip the project and open a terminal inside the folder
cd ams-billing-app

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.local.example .env.local
# Now open .env.local and paste your Neon connection string into DATABASE_URL

# 4. Create the database tables (run this once)
npm run db:init

# 5. Start the app
npm run dev
```

Open **http://localhost:3000** — you should see the dashboard. Click **+ New document**
to create your first quotation.

---

## 3. Deploy it live (so WhatsApp/Email links work for real)

The easiest option is **Vercel** (same company that makes Next.js, free tier is enough):

1. Push this project to a GitHub repository (create a new repo, then:
   `git init && git add . && git commit -m "AMS billing app" && git remote add origin <your-repo-url> && git push -u origin main`)
2. Go to **https://vercel.com**, sign up/log in, click **Add New → Project**, and import your GitHub repo.
3. In the project's **Environment Variables** settings, add:
   - `DATABASE_URL` → your Neon connection string
   - `NEXT_PUBLIC_APP_URL` → your Vercel URL, e.g. `https://ams-billing.vercel.app`
     (you'll know this after the first deploy — add it and redeploy)
4. Click **Deploy**. That's it — your app is now live with a public URL.
5. Run `npm run db:init` **once** locally (pointing at the same `DATABASE_URL`) to create
   the tables in your Neon database, if you haven't already.

Once deployed, the WhatsApp and Email share buttons will link to your real, working PDF URLs
that anyone (your client) can open — not just on your own computer.

---

## Project structure

```
app/
  page.tsx                     Dashboard (list of documents)
  quotations/new/page.tsx      New quotation/bill form
  quotations/[id]/page.tsx     View a single document
  api/quotations/route.ts      List & create documents
  api/quotations/[id]/route.ts         Get one document (JSON)
  api/quotations/[id]/pdf/route.ts     Generate the branded PDF
components/
  ItemsEditor.tsx      Dynamic line-item table with auto-add-row
  NewDocumentForm.tsx  The create form
  ShareButtons.tsx     WhatsApp / Email / Download buttons
  QuotationPdf.tsx     The PDF layout (react-pdf)
lib/
  db.ts        Neon database connection
  types.ts     Shared types + totals calculation
scripts/
  schema.sql     Database tables
  init-db.mjs    Script that runs schema.sql against your Neon DB
public/
  logo.png     AMS Civil Construction logo
```

---

## Customizing

- **Colors**: edit `tailwind.config.ts` (`navy` and `orange` values) — used everywhere including the PDF.
- **Company details** (phone, email, address, tagline): search for them in
  `app/layout.tsx`, `components/QuotationPdf.tsx`, and `app/quotations/[id]/page.tsx` and update.
- **GST rate default**: change the `18` default in `components/NewDocumentForm.tsx`.
- **Logo**: replace `public/logo.png` with a new file (keep the same filename).

---

## Notes

- The WhatsApp button opens `wa.me` with your client's phone number (if you entered one)
  and a pre-filled message containing the PDF link. If no phone number is entered, it opens
  WhatsApp's contact picker instead.
- The Email button opens a `mailto:` link (your own email app) pre-filled with subject,
  body, and the PDF link — since browsers can't attach files automatically, the link is
  the simplest reliable way to share the PDF.
- This app does not include login/authentication — anyone with the link can create documents.
  If you need to restrict access (e.g. only you and your team), let us know and password
  protection can be added.
