### Auto Repair Shop — Next.js + Prisma

Single-shop auto-repair manager for cars, work orders, item lines, and PDF invoices.

#### Tech Stack
- Next.js (App Router), React 19, TypeScript
- Prisma ORM + PostgreSQL (Prisma client output at `generated/prisma`)
- NextAuth (basic auth), Tailwind CSS v4
- date-fns, react-pdf/@react-pdf/renderer

---

### Quick Start

1) Prerequisites
- Node.js LTS, npm
- PostgreSQL database

2) Install
```bash
npm install
```

3) Configure environment
Create `.env` in project root with at least:
```env
DATABASE_URL=postgres://user:pass@host:5432/dbname
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-strong-secret
```
Notes:
- Prisma datasource URL is read via `prisma.config.ts` (not inline in `schema.prisma`).
- `postinstall` runs `prisma generate` automatically.

4) Database migrate
```bash
npx prisma migrate dev
```

5) Seed sample data (cars + demo work orders; no users)
```bash
npx prisma db seed
```
The seed is idempotent: if work orders already exist, it will skip (cars are upserted by license plate).

6) Run the app
```bash
npm run dev
```
Open http://localhost:3000

---

### Available Scripts
- `npm run dev` — start Next.js in development
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `postinstall` — `prisma generate` (auto)
- `npx prisma migrate dev` — create/apply local DB migrations
- `npx prisma migrate deploy` — apply migrations in deploy environments
- `npx prisma db seed` — run the seed (`prisma/seed.ts` via ts-node)

---

### Data Model (summary)
- `Car`: license plate (unique), VIN, make/model, owner name/phone, color, mileage, notes
- `Work_Done`: work order with status, notes, totals (`totalLabor`, `totalParts`, `totalPrice`), payment fields
- `Work_Item_Used`: items (LABOR/PART) with `quantity`, `unitPrice`, `total`

See full schema in `prisma/schema.prisma`.

---

### API Conventions
- Routes under `app/api` (e.g., cars, work-orders, work-order items)
- JSON payloads use camelCase
- Pagination: `?page=&limit=` with defaults `page=1`, `limit=20`
- Error shape: `{ error: { code, message }, details? }`

---

### Invoices (PDF)
- Only invoice PDF is required at this stage
- Filename format: `rekins-<work_order_id>_<date>.pdf`
  - Date format: `DD-MM-YYYY` (example: `rekins-1234_17-12-2025.pdf`)
- Contents: shop info, car details, work order ID, items (labor/parts), totals, payment status

---

### Seeding Details
- Location: `prisma/seed.ts`
- Creates ~5 demo cars and 5 demo work orders with realistic items
- Computes totals server-side and sets payment status

---

### Testing
A baseline test suite will include:
- Integration tests for core API endpoints (cars, work-orders, invoice generation)
- Unit tests for pricing/total calculations

Run tests: TBD (once tests are added). For now, focus on API and totals logic per `GUIDELINES.md`.

---

### Troubleshooting
- Prisma cannot connect: verify `DATABASE_URL` and that the DB is reachable
- Migration errors: inspect migrations under `prisma/migrations`; try `npx prisma migrate reset` (will wipe data)
- Reseed: `npx prisma db seed` (if needed, reset first)

---

### More
Read `GUIDELINES.md` for architecture, conventions, and decisions.
