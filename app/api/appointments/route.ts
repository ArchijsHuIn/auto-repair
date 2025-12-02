import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                car: {
                    select: {
                        id: true,
                        licensePlate: true,
                        make: true,
                        model: true,
                        year: true,
                    },
                },
            },
            orderBy: {
                startTime: "asc",
            },
        });

        return NextResponse.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json(
            { error: "Failed to fetch appointments" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { carId, carLicensePlate, title, description, startTime, endTime } = body;

        if ((!carId && !carLicensePlate) || !title || !startTime || !endTime) {
            return NextResponse.json(
                { error: "Missing required fields: (carId or carLicensePlate), title, startTime, endTime" },
                { status: 400 }
            );
        }

        // Resolve car
        let resolvedCarId: number | null = null;
        if (carId) {
            const carById = await prisma.car.findUnique({ where: { id: Number(carId) } });
            if (!carById) {
                return NextResponse.json({ error: "Car not found" }, { status: 404 });
            }
            resolvedCarId = carById.id;
        } else if (typeof carLicensePlate === "string" && carLicensePlate.trim() !== "") {
            const carByLp = await prisma.car.findUnique({ where: { licensePlate: carLicensePlate.trim() } });
            if (!carByLp) {
                return NextResponse.json({ error: "Car not found for provided license plate" }, { status: 404 });
            }
            resolvedCarId = carByLp.id;
        }

        if (!resolvedCarId) {
            return NextResponse.json({ error: "Unable to resolve car" }, { status: 400 });
        }

        const appointment = await prisma.appointment.create({
            data: {
                carId: resolvedCarId,
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
            },
            include: {
                car: true,
            },
        });

        return NextResponse.json(appointment, { status: 201 });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return NextResponse.json(
            { error: "Failed to create appointment" },
            { status: 500 }
        );
    }
}
