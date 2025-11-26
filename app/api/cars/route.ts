import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const cars = await prisma.car.findMany({
        orderBy: { id: "desc" },
    });

    return NextResponse.json(cars);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { licensePlate, year, make, model } = body;

    if (!licensePlate || !year || !make || !model) {
        return new NextResponse("Missing fields", { status: 400 });
    }

    try {
        const car = await prisma.car.create({
            data: {
                licensePlate,
                year,
                make,
                model,
            },
        });

        return NextResponse.json(car, { status: 201 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Error creating car", { status: 500 });
    }
}
