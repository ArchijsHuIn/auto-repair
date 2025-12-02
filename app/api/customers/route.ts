import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const cars = await prisma.car.findMany({
            include: {
                _count: {
                    select: { workOrders: true },
                },
            },
            orderBy: {
                ownerName: "asc",
            },
        });

        // Group cars by customer (ownerPhone)
        const customerMap = new Map<string, any>();

        cars.forEach((car) => {
            const key = car.ownerPhone;
            if (!customerMap.has(key)) {
                customerMap.set(key, {
                    ownerName: car.ownerName,
                    ownerPhone: car.ownerPhone,
                    cars: [],
                    totalWorkOrders: 0,
                });
            }
            const customer = customerMap.get(key);
            customer.cars.push(car);
            customer.totalWorkOrders += car._count.workOrders;
        });

        const customers = Array.from(customerMap.values());

        return NextResponse.json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json(
            { error: "Failed to fetch customers" },
            { status: 500 }
        );
    }
}
