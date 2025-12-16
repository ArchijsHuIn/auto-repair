import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const carId = parseInt(id);

        if (isNaN(carId)) {
            return NextResponse.json(
                { error: "Invalid car ID" },
                { status: 400 }
            );
        }

        const car = await prisma.car.findUnique({
            where: { id: carId },
            include: {
                workOrders: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        status: true,
                        title: true,
                        paymentStatus: true,
                        totalPrice: true,
                        createdAt: true,
                        completedAt: true,
                    },
                },
            },
        });

        if (!car) {
            return NextResponse.json(
                { error: "Car not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(car);
    } catch (error) {
        console.error("Error fetching car:", error);
        return NextResponse.json(
            { error: "Failed to fetch car" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const carId = parseInt(id);

        if (isNaN(carId)) {
            return NextResponse.json(
                { error: "Invalid car ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const {
            licensePlate,
            vin,
            year,
            make,
            model,
            mileage,
            ownerPhone,
            notes,
            color,
            ownerName,
        } = body || {};

        // Validate required fields
        const lp = typeof licensePlate === "string" ? licensePlate.trim() : "";
        const mk = typeof make === "string" ? make.trim() : "";
        const md = typeof model === "string" ? model.trim() : "";
        const ph = typeof ownerPhone === "string" ? ownerPhone.trim() : "";

        if (!lp || !mk || !md || !ph) {
            return NextResponse.json(
                { error: "Missing required fields: licensePlate, make, model, ownerPhone" },
                { status: 400 }
            );
        }

        const updated = await prisma.car.update({
            where: { id: carId },
            data: {
                licensePlate: lp,
                vin: typeof vin === "string" && vin.trim() !== "" ? vin.trim() : null,
                year: year ? Number(year) : null,
                make: mk,
                model: md,
                mileage: mileage ? Number(mileage) : null,
                ownerPhone: ph,
                notes: typeof notes === "string" && notes.trim() !== "" ? notes.trim() : null,
                // Optional fields with Prisma defaults should be omitted when empty so defaults apply
                ...(typeof ownerName === "string" && ownerName.trim() !== "" ? { ownerName: ownerName.trim() } : {}),
                ...(typeof color === "string" && color.trim() !== "" ? { color: color.trim() } : {}),
            },
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("Error updating car:", error);
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "A car with this license plate already exists" },
                { status: 409 }
            );
        }
        if (error.code === "P2025") {
            return NextResponse.json(
                { error: "Car not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: "Failed to update car" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    // For simplicity, treat PATCH the same as PUT (full update) in this API
    return PUT(request, context);
}
