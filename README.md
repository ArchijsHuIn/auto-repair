### Autoservisa pārvaldība — Next.js + Prisma

Viena autoservisa pārvaldības sistēma automašīnām, darba uzdevumiem, preču pozīcijām un PDF rēķiniem.

#### Tehnoloģiju kopums
- Next.js (App Router), React 19, TypeScript
- Prisma ORM + PostgreSQL (Prisma klienta izvade `generated/prisma`)
- NextAuth (pamata autentifikācija), Tailwind CSS v4
- date-fns, react-pdf/@react-pdf/renderer

---

### Ātrā darba sākšana

1) Priekšnosacījumi
- Node.js LTS, npm
- PostgreSQL datubāze

2) Instalēšana
```bash
npm install
```

3) Vides konfigurēšana
Izveidojiet `.env` failu projekta saknes direktorijā ar vismaz šādiem mainīgajiem:
```env
DATABASE_URL=postgres://user:pass@host:5432/dbname
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-strong-secret
```
Piezīmes:
- Prisma datu avota URL tiek lasīts caur `prisma.config.ts` (nevis tieši `schema.prisma`).
- `postinstall` automātiski palaiž `prisma generate`.

4) Datubāzes migrācija
```bash
npx prisma migrate dev
```

5) Sākotnējo datu ielāde (automašīnas + demonstrācijas darba uzdevumi; bez lietotājiem)
```bash
npx prisma db seed
```
Sākotnējo datu ielāde ir idempotenta: ja darba uzdevumi jau eksistē, tā tiks izlaista (automašīnas tiek atjauninātas pēc valsts reģistrācijas numura).

6) Lietotnes palaišana
```bash
npm run dev
```
Atveriet http://localhost:3000

---

### Pieejamās komandas
- `npm run dev` — palaist Next.js izstrādes režīmā
- `npm run build` — produkcijas būvējums
- `npm run start` — palaist produkcijas serveri
- `npm run lint` — palaist ESLint
- `postinstall` — `prisma generate` (automātiski)
- `npx prisma migrate dev` — izveidot/piemērot lokālās DB migrācijas
- `npx prisma migrate deploy` — piemērot migrācijas izvietošanas vidēs
- `npx prisma db seed` — palaist sākotnējo datu ielādi (`prisma/seed.ts` caur ts-node)

---

### Datu modelis (kopsavilkums)
- `Car`: valsts reģistrācijas numurs (unikāls), VIN, marka/modelis, īpašnieka vārds/tālrunis, krāsa, nobraukums, piezīmes
- `Work_Done`: darba uzdevums ar statusu, piezīmēm, kopsummām (`totalLabor`, `totalParts`, `totalPrice`), maksājumu laukiem
- `Work_Item_Used`: pozīcijas (LABOR/PART) ar `quantity` (daudzums), `unitPrice` (vienības cena), `total` (kopā)

Pilna shēma atrodama `prisma/schema.prisma`.

---

### API konvencijas
- Maršruti zem `app/api` (piemēram, cars, work-orders, work-order items)
- JSON dati izmanto camelCase
- Lappušu numerācija: `?page=&limit=` ar noklusējuma vērtībām `page=1`, `limit=20`
- Kļūdu formāts: `{ error: { code, message }, details? }`

---

### Rēķini (PDF)
- Šajā posmā ir nepieciešams tikai rēķina PDF
- Failu nosaukumu formāts: `rekins-<work_order_id>_<date>.pdf`
  - Datuma formāts: `DD-MM-YYYY` (piemērs: `rekins-1234_17-12-2025.pdf`)
- Saturs: informācija par servisu, informācija par automašīnu, darba uzdevuma ID, pozīcijas (darbs/detaļas), kopsummas, maksājuma statuss

---

### Sākotnējo datu ielādes informācija
- Atrašanās vieta: `prisma/seed.ts`
- Izveido ~5 parauga automašīnas un 5 parauga darba uzdevumus ar reālistiskām pozīcijām
- Aprēķina kopsummas servera pusē un iestata maksājuma statusu

---

### Testēšana
- `npm run test` — palaist testus interaktīvā režīmā
- `npm run test:run` — palaist visus testus vienu reizi

Testu komplekts ietver:
- Vienību testi (Unit tests) lietotāja saskarnes komponentēm un utilītfunkcijām
- Integrācijas testi (Integration tests) API maršrutiem ar Prisma simulāciju (mocking)

---

### Problēmu novēršana
- Prisma nevar izveidot savienojumu: pārbaudiet `DATABASE_URL` un vai DB ir pieejama
- Migrācijas kļūdas: pārbaudiet migrācijas zem `prisma/migrations`; mēģiniet `npx prisma migrate reset` (izdzēsīs datus)
- Atkārtota datu ielāde: `npx prisma db seed` (ja nepieciešams, vispirms veiciet atiestatīšanu)

---

### Vairāk informācijas
Lasiet `GUIDELINES.md` par arhitektūru, konvencijām un lēmumiem.
