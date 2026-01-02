### Projekta vadlīnijas

#### 1) Pārskats
- Viena autoservisa pārvaldības sistēma automašīnām, darba uzdevumiem, precēm un PDF rēķiniem.
- Tehnoloģiju kopums: Next.js (App Router), TypeScript, Prisma + PostgreSQL, NextAuth, Tailwind CSS, React 19, date-fns.
- Galvenie domēni saskaņā ar shēmu: `Car`, `Work_Done`, `Work_Item_Used`, ar uzskaitījumiem (enums) statusiem un maksājumiem.

#### 2) Lokālā izstrāde
- Prasības: Node LTS, PostgreSQL, npm.
- Instalēšana: `npm install`
- Palaist izstrādes režīmā: `npm run dev` → http://localhost:3000
- Koda kvalitāte: ESLint + TypeScript. Pašlaik nav obligātu pre-commit āķu (hooks).

#### 3) Vide un noslēpumi
- Nepieciešamie vides mainīgie:
  - `DATABASE_URL=postgres://…`
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Prisma datu avota konfigurācija paliek tāda, kāda tā pašlaik ir iestatīta repozitorijā.
- Noslēpumu glabāšana: tiks precizēta (sākumā pietiek ar platformas vides mainīgajiem).

#### 4) Datubāze un migrācijas
- Prisma 7.x; izpildlaika klients no `@prisma/client` (ģenerēts `node_modules`).
- Lokālās shēmas izmaiņas: `npx prisma migrate dev`
- Migrāciju izvietošana (deploy): `npx prisma migrate deploy`
- Sākotnējie dati (seeding): ietver parauga automašīnas un demonstrācijas pasūtījumus (bez lietotājiem): `npx prisma db seed`

#### 5) Datu modelis (Glosārijs)
- `Car`: valsts reģistrācijas numurs (unikāls), VIN, marka/modelis, īpašnieka vārds/tālrunis, piezīmes, krāsa, nobraukums.
- `Work_Done`: statusa dzīves cikls (NEW, DIAGNOSTIC, WAITING_PARTS, IN_PROGRESS, DONE, CANCELLED), maksājumu lauki, kopsummas (`totalLabor`, `totalParts`, `totalPrice`).
- `Work_Item_Used`: LABOR/PART pozīcijas, daudzums, vienības cena, kopsumma.

#### 6) API konvencijas
- REST zem `app/api` (cars, work-orders, work-order items).
- JSON atbildes; camelCase lauki.
- Lappušu numerācija: `?page=&limit=` ar noklusējuma vērtībām `page=1`, `limit=20`.
- Kļūdu formāts: `{ error: { code, message }, details? }`.

#### 7) Autentifikācija un autorizācija
- Šajā posmā nav lomu ierobežojumu. Saglabājiet NextAuth minimālu.

#### 8) UI/UX
- Tailwind CSS. Saglabājiet formas vienkāršas; vēlāk var pievienot shēmas validāciju.

#### 9) Biznesa noteikumi
- Statusu pārejas: pagaidām pieļaujamas (nav stingras matricas).
- Maksājumi: `UNPAID` → `PARTIAL` → `PAID`. Pagaidām nav nodokļu/atlažu loģikas.
- Kopsummas tiek aprēķinātas/validētas servera pusē, lai saglabātu integritāti.

#### 10) Dokumenti (PDF)
- Nepieciešams tikai rēķina PDF.
- Failu nosaukumu formāts: `rekins-<work_order_id>_<date>.pdf`, kur datums ir `DD-MM-YYYY` (piemēram, `rekins-1234_17-12-2025.pdf`).
- Rēķinā iekļauts: informācija par servisu (pagaidām vietturītis), informācija par automašīnu, darba uzdevuma ID, pozīcijas (darbs un detaļas), kopsummas, maksājuma statuss.

#### 11) Plānošana
- Pieraksti uz laiku pašlaik nav paredzēti.

#### 12) Kļūdu apstrāde un žurnalēšana
- Kartējiet biežākās Prisma kļūdas uz 4xx; pretējā gadījumā 500.
- Minimāla servera žurnalēšana; vēlāk var pievienot Sentry/Logtail.

#### 13) Testēšanas stratēģija
- Nodrošiniet testus:
  - API integrācijas testi automašīnām, darba uzdevumiem un rēķinu ģenerēšanai.
  - Vienību testi cenu/kopsummu aprēķiniem.
- E2E nav obligāti, iespējami vēlāk.

#### 14) Izvietošana un darbība
- Visticamāk Vercel + pārvaldīts Postgres (piemēram, Neon/Supabase/RDS) ar vienu vidi sākumā.
- Pēc noklusējuma izmantojiet pakalpojumu sniedzēja rezerves kopijas; oficiālu politiku var pievienot vēlāk.

#### 15) Drošība un atbilstība
- Aizsargājiet PII (īpašnieka vārds/tālrunis). Pašlaik nav oficiālu atbilstības ierobežojumu.
- Produkcijā izmantojiet DB akreditācijas datus ar vismazākajām privilēģijām.

#### 16) Veiktspēja
- Pašreizējie indeksi ir pietiekami ~3–5 lietotājiem un līdz ~10 automašīnām dienā.
- Izmantojiet lappušu numerāciju sarakstu galapunktos, pieaugot datu apjomam.
