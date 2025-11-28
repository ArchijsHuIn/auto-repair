import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const cars = await prisma.car.findMany({
        orderBy: { id: "desc" },
    });

    return NextResponse.json(cars);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { licensePlate, vin, year, make, model, mileage, ownerPhone, notes } = body;

        // Validate required fields
        if (!licensePlate || !make || !model || !ownerPhone) {
            return NextResponse.json(
                { error: "Missing required fields: licensePlate, make, model, ownerPhone" },
                { status: 400 }
            );
        }

        const car = await prisma.car.create({
            data: {
                licensePlate,
                vin: vin || null,
                year: year ? Number(year) : null,
                make,
                model,
                mileage: mileage ? Number(mileage) : null,
                ownerPhone,
                notes: notes || null,
            },
        });

        return NextResponse.json(car, { status: 201 });
    } catch (error: any) {
        console.error("Error creating car:", error);

        // Handle unique constraint violation
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "A car with this license plate already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create car" },
            { status: 500 }
        );
    }
}


