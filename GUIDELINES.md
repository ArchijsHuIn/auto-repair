### Project Guidelines

#### 1) Overview
- Single-shop auto-repair management for cars, work orders, items, and PDF invoices.
- Stack: Next.js (App Router), TypeScript, Prisma + PostgreSQL, NextAuth, Tailwind CSS, React 19, date-fns.
- Core domains per schema: `Car`, `Work_Done`, `Work_Item_Used`, with enums for statuses and payments.

#### 2) Local Development
- Requirements: Node LTS, PostgreSQL, npm.
- Install: `npm install`
- Run dev: `npm run dev` → http://localhost:3000
- Code quality: ESLint + TypeScript. No mandatory pre-commit hooks for now.

#### 3) Environment & Secrets
- Required env vars:
  - `DATABASE_URL=postgres://…`
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Prisma datasource configuration remains as currently set in the repo.
- Secret storage: TBD (platform envs initially are fine).

#### 4) Database & Migrations
- Prisma 7.x; runtime client from `@prisma/client` (generated into `node_modules`).
- Local schema changes: `npx prisma migrate dev`
- Deploy migrations: `npx prisma migrate deploy`
- Seeding: includes sample cars and demo orders (no users): `npx prisma db seed`

#### 5) Data Model (Glossary)
- `Car`: license plate (unique), VIN, make/model, owner name/phone, notes, color, mileage.
- `Work_Done`: status lifecycle (NEW, DIAGNOSTIC, WAITING_PARTS, IN_PROGRESS, DONE, CANCELLED), payment fields, totals (`totalLabor`, `totalParts`, `totalPrice`).
- `Work_Item_Used`: LABOR/PART items, qty, unit price, total.

#### 6) API Conventions
- REST under `app/api` (cars, work-orders, work-order items).
- JSON responses; camelCase fields.
- Pagination: `?page=&limit=` with defaults `page=1`, `limit=20`.
- Error shape: `{ error: { code, message }, details? }`.

#### 7) Authentication & Authorization
- No role-based restrictions at this stage. Keep NextAuth minimal.

#### 8) UI/UX
- Tailwind CSS. Keep forms simple; may add schema validation later.

#### 9) Business Rules
- Status transitions: permissive for now (no strict matrix).
- Payments: `UNPAID` → `PARTIAL` → `PAID`. No taxes/discounts logic yet.
- Totals are computed/validated server-side to maintain integrity.

#### 10) Documents (PDF)
- Only Invoice PDF is required.
- Filename format: `rekins-<work_order_id>_<date>.pdf` where date is `DD-MM-YYYY` (e.g., `rekins-1234_17-12-2025.pdf`).
- Invoice includes: shop info (placeholder for now), car details, work order ID, items (labor and parts), totals, payment status.

#### 11) Scheduling
- Appointments are out of scope for now.

#### 12) Error Handling & Logging
- Map common Prisma errors to 4xx; otherwise 500.
- Minimal server logging; can add Sentry/Logtail later.

#### 13) Testing Strategy
- Provide tests:
  - API integration tests for cars, work orders, and invoice generation.
  - Unit tests for pricing/total calculations.
- E2E optional later.

#### 14) Deployment & Operations
- Likely Vercel + managed Postgres (e.g., Neon/Supabase/RDS) with a single environment initially.
- Use provider backups by default; formal policy can be added later.

#### 15) Security & Compliance
- Protect PII (owner name/phone). No formal compliance constraints now.
- Use least-privilege DB credentials in production.

#### 16) Performance
- Current indexes are adequate for ~3–5 users and up to ~10 cars/day.
- Use pagination on list endpoints as data grows.
