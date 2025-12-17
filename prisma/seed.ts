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
    console.log(`Seed skipped: ${woCount} work orders already exist.`);
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
      ownerName: "Rekins Auto Service",
      ownerPhone: "+371 0000 0000",
      color: "Silver",
      notes: "Demo car 1",
    },
    {
      licensePlate: "BB-5678",
      vin: "LVV00000000000002",
      year: 2018,
      make: "Volkswagen",
      model: "Golf",
      mileage: 98000,
      ownerName: "Rekins Auto Service",
      ownerPhone: "+371 0000 0000",
      color: "Blue",
      notes: "Demo car 2",
    },
    {
      licensePlate: "CC-9012",
      vin: "LVV00000000000003",
      year: 2012,
      make: "BMW",
      model: "320d",
      mileage: 210000,
      ownerName: "Rekins Auto Service",
      ownerPhone: "+371 0000 0000",
      color: "Black",
      notes: "Demo car 3",
    },
    {
      licensePlate: "DD-3456",
      vin: "LVV00000000000004",
      year: 2020,
      make: "Skoda",
      model: "Octavia",
      mileage: 45000,
      ownerName: "Rekins Auto Service",
      ownerPhone: "+371 0000 0000",
      color: "White",
      notes: "Demo car 4",
    },
    {
      licensePlate: "EE-7890",
      vin: "LVV00000000000005",
      year: 2016,
      make: "Audi",
      model: "A4",
      mileage: 165000,
      ownerName: "Rekins Auto Service",
      ownerPhone: "+371 0000 0000",
      color: "Grey",
      notes: "Demo car 5",
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
      title: "Oil change and inspection",
      status: WorkOrderStatus.DONE,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Oil change labor", quantity: 1, unitPrice: 30 },
        { type: WorkOrderItemType.PART, description: "5W30 Oil 5L", quantity: 1, unitPrice: 40 },
        { type: WorkOrderItemType.PART, description: "Oil filter", quantity: 1, unitPrice: 10 },
      ],
      paymentStatus: PaymentStatus.PAID,
      // mark paid info
    },
    {
      carIdx: 1,
      title: "Front brake pads replacement",
      status: WorkOrderStatus.IN_PROGRESS,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Replace pads labor", quantity: 1.5, unitPrice: 35 },
        { type: WorkOrderItemType.PART, description: "Front brake pads set", quantity: 1, unitPrice: 65 },
      ],
      paymentStatus: PaymentStatus.UNPAID,
    },
    {
      carIdx: 2,
      title: "Diagnostics for engine noise",
      status: WorkOrderStatus.DIAGNOSTIC,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Engine diagnostic", quantity: 1, unitPrice: 50 },
      ],
      paymentStatus: PaymentStatus.UNPAID,
    },
    {
      carIdx: 3,
      title: "Replace battery",
      status: WorkOrderStatus.WAITING_PARTS,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Install new battery", quantity: 0.5, unitPrice: 35 },
        { type: WorkOrderItemType.PART, description: "12V 70Ah battery", quantity: 1, unitPrice: 120 },
      ],
      paymentStatus: PaymentStatus.PARTIAL,
    },
    {
      carIdx: 4,
      title: "Timing belt kit replacement",
      status: WorkOrderStatus.NEW,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Timing belt labor", quantity: 4, unitPrice: 40 },
        { type: WorkOrderItemType.PART, description: "Timing belt kit", quantity: 1, unitPrice: 180 },
        { type: WorkOrderItemType.PART, description: "Water pump", quantity: 1, unitPrice: 80 },
      ],
      paymentStatus: PaymentStatus.UNPAID,
    },
    {
      carIdx: 0,
      title: "Rear shock absorbers",
      status: WorkOrderStatus.IN_PROGRESS,
      items: [
        { type: WorkOrderItemType.LABOR, description: "Replace rear shocks", quantity: 1.2, unitPrice: 40 },
        { type: WorkOrderItemType.PART, description: "Rear shock absorber (pair)", quantity: 1, unitPrice: 150 },
      ],
      paymentStatus: PaymentStatus.PARTIAL,
    },
    {
      carIdx: 2,
      title: "AC recharge and leak test",
      status: WorkOrderStatus.DONE,
      items: [
        { type: WorkOrderItemType.LABOR, description: "AC service", quantity: 1, unitPrice: 45 },
        { type: WorkOrderItemType.PART, description: "Refrigerant R134a", quantity: 0.6, unitPrice: 50 },
        { type: WorkOrderItemType.PART, description: "UV dye", quantity: 1, unitPrice: 8 },
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

  console.log("Seed completed: created sample cars and work orders.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
