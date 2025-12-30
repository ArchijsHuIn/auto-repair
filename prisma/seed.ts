import "dotenv/config";
import {
  PrismaClient,
  WorkOrderStatus,
  WorkOrderItemType,
  PaymentStatus,
  PaymentMethod,
} from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma Client (v7) requires a constructor option. Use the official pg adapter.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Basic idempotency: if there are already work orders, skip to avoid duplicates
  const woCount = await prisma.work_Done.count();
  if (woCount > 0) {
    console.log(`Sēkošana izlaista: ${woCount} darba pasūtījumi jau eksistē.`);
    return;
  }

  // Sample cars
  const carsData = [
    {
      licensePlate: "AA-1234",
      vin: "LVV00000000000001",
      year: 2015,
      make: "Toyota",
      model: "Corolla",
      mileage: 150000,
      ownerName: "Rēķins Auto Serviss",
      ownerPhone: "+371 2000 0000",
      color: "Sudraba",
      notes: "Demo auto 1",
    },
    {
      licensePlate: "BB-5678",
      vin: "LVV00000000000002",
      year: 2018,
      make: "Volkswagen",
      model: "Golf",
      mileage: 98000,
      ownerName: "Rēķins Auto Serviss",
      ownerPhone: "+371 2000 0001",
      color: "Zila",
      notes: "Demo auto 2",
    },
    {
      licensePlate: "CC-9012",
      vin: "LVV00000000000003",
      year: 2012,
      make: "BMW",
      model: "320d",
      mileage: 210000,
      ownerName: "Rēķins Auto Serviss",
      ownerPhone: "+371 2000 0002",
      color: "Melna",
      notes: "Demo auto 3",
    },
    {
      licensePlate: "DD-3456",
      vin: "LVV00000000000004",
      year: 2020,
      make: "Skoda",
      model: "Octavia",
      mileage: 45000,
      ownerName: "Rēķins Auto Serviss",
      ownerPhone: "+371 2000 0003",
      color: "Balta",
      notes: "Demo auto 4",
    },
    {
      licensePlate: "EE-7890",
      vin: "LVV00000000000005",
      year: 2016,
      make: "Audi",
      model: "A4",
      mileage: 165000,
      ownerName: "Rēķins Auto Serviss",
      ownerPhone: "+371 2000 0004",
      color: "Pelēka",
      notes: "Demo auto 5",
    },
  ];

  const cars = [] as { id: number; licensePlate: string }[];
  for (const data of carsData) {
    // Upsert on unique licensePlate so reseeding doesn't duplicate
    const car = await prisma.car.upsert({
      where: { licensePlate: data.licensePlate },
      update: data,
      create: data,
    });
    cars.push({ id: car.id, licensePlate: car.licensePlate });
  }

  // Helper to compute totals
  const money = (n: number) => Number(n.toFixed(2));

  // Small helpers
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

  // Create demo work orders (5–10) with items
  const workOrdersToCreate = [
    {
      carIdx: 0,
      title: "Eļļas maiņa un apkope",
      status: WorkOrderStatus.DONE,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Eļļas maiņas darbs", quantity: 1, unitPrice: 30 },
        { type: WorkOrderItemType.PART, description: "Eļļa 5W30 5L", quantity: 1, unitPrice: 40 },
        { type: WorkOrderItemType.PART, description: "Eļļas filtrs", quantity: 1, unitPrice: 10 },
      ],
      paymentStatus: PaymentStatus.PAID,
      // mark paid info
    },
    {
      carIdx: 1,
      title: "Priekšējo bremžu kluču maiņa",
      status: WorkOrderStatus.IN_PROGRESS,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Kluču maiņas darbs", quantity: 1.5, unitPrice: 35 },
        { type: WorkOrderItemType.PART, description: "Priekšējo bremžu kluču komplekts", quantity: 1, unitPrice: 65 },
      ],
      paymentStatus: PaymentStatus.UNPAID,
    },
    {
      carIdx: 2,
      title: "Dzinēja trokšņa diagnostika",
      status: WorkOrderStatus.DIAGNOSTIC,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Dzinēja diagnostika", quantity: 1, unitPrice: 50 },
      ],
      paymentStatus: PaymentStatus.UNPAID,
    },
    {
      carIdx: 3,
      title: "Akumulatora maiņa",
      status: WorkOrderStatus.WAITING_PARTS,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Akumulatora uzstādīšana", quantity: 0.5, unitPrice: 35 },
        { type: WorkOrderItemType.PART, description: "Akumulators 12V 70Ah", quantity: 1, unitPrice: 120 },
      ],
      paymentStatus: PaymentStatus.PARTIAL,
    },
    {
      carIdx: 4,
      title: "Zobsiksnas komplekta maiņa",
      status: WorkOrderStatus.NEW,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Zobsiksnas maiņas darbs", quantity: 4, unitPrice: 40 },
        { type: WorkOrderItemType.PART, description: "Zobsiksnas komplekts", quantity: 1, unitPrice: 180 },
        { type: WorkOrderItemType.PART, description: "Ūdens sūknis", quantity: 1, unitPrice: 80 },
      ],
      paymentStatus: PaymentStatus.UNPAID,
    },
    {
      carIdx: 0,
      title: "Aizmugurējo amortizatoru maiņa",
      status: WorkOrderStatus.IN_PROGRESS,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Amortizatoru maiņas darbs", quantity: 1.2, unitPrice: 40 },
        { type: WorkOrderItemType.PART, description: "Aizmugurējie amortizatori (pāris)", quantity: 1, unitPrice: 150 },
      ],
      paymentStatus: PaymentStatus.PARTIAL,
    },
    {
      carIdx: 2,
      title: "Kondicioniera uzpilde un noplūdes pārbaude",
      status: WorkOrderStatus.DONE,
      items: [
        { type: WorkOrderItemType.LABOR, description: "AC apkope", quantity: 1, unitPrice: 45 },
        { type: WorkOrderItemType.PART, description: "Freons R134a", quantity: 0.6, unitPrice: 50 },
        { type: WorkOrderItemType.PART, description: "UV krāsviela", quantity: 1, unitPrice: 8 },
      ],
      paymentStatus: PaymentStatus.PAID,
    },
  ];

  for (const wo of workOrdersToCreate) {
    const car = cars[wo.carIdx];
    if (!car) continue;

    let totalLabor = 0;
    let totalParts = 0;
    for (const it of wo.items) {
      const total = money(it.quantity * it.unitPrice);
      if (it.type === WorkOrderItemType.LABOR) totalLabor = money(totalLabor + total);
      else totalParts = money(totalParts + total);
    }
    const totalPrice = money(totalLabor + totalParts);

    const createdAt = daysAgo(Math.floor(Math.random() * 20) + 1);
    const maybeCompleted =
      wo.status === WorkOrderStatus.DONE ? daysAgo(Math.floor(Math.random() * 10) + 1) : null;
    const maybePaidAt =
      wo.paymentStatus === PaymentStatus.PAID
        ? maybeCompleted ?? daysAgo(Math.floor(Math.random() * 5) + 1)
        : wo.paymentStatus === PaymentStatus.PARTIAL
        ? null
        : null;

    await prisma.work_Done.create({
      data: {
        carId: car.id,
        title: wo.title,
        status: wo.status,
        paymentStatus: wo.paymentStatus,
        paymentMethod:
          wo.paymentStatus === PaymentStatus.UNPAID
            ? null
            : pick([PaymentMethod.CASH, PaymentMethod.CARD, PaymentMethod.TRANSFER]),
        paidAt: maybePaidAt ?? undefined,
        createdAt: createdAt,
        completedAt: maybeCompleted ?? undefined,
        totalLabor: totalLabor,
        totalParts: totalParts,
        totalPrice: totalPrice,
        items: {
          create: wo.items.map((i) => ({
            type: i.type,
            description: i.description,
            quantity: i.quantity as unknown as any, // Decimal handled by Prisma, number is acceptable input
            unitPrice: i.unitPrice as unknown as any,
            total: money(i.quantity * i.unitPrice) as unknown as any,
          })),
        },
      },
    });
  }

  console.log("Sēkošana pabeigta: izveidoti demo auto un darba pasūtījumi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
