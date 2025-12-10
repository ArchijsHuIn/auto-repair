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

export async function PATCH(
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

        // Only allow specific fields to be updated
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

        // Build update data with proper trimming and null handling
        const data: any = {};

        if (typeof licensePlate !== "undefined") {
            const lp = typeof licensePlate === "string" ? licensePlate.trim() : "";
            if (!lp) {
                return NextResponse.json(
                    { error: "licensePlate cannot be empty" },
                    { status: 400 }
                );
            }
            data.licensePlate = lp;
        }

        if (typeof vin !== "undefined") {
            data.vin = typeof vin === "string" && vin.trim() !== "" ? vin.trim() : null;
        }

        if (typeof year !== "undefined") {
            data.year = year === null || year === "" ? null : Number(year);
        }

        if (typeof make !== "undefined") {
            const mk = typeof make === "string" ? make.trim() : "";
            if (!mk) {
                return NextResponse.json(
                    { error: "make cannot be empty" },
                    { status: 400 }
                );
            }
            data.make = mk;
        }

        if (typeof model !== "undefined") {
            const md = typeof model === "string" ? model.trim() : "";
            if (!md) {
                return NextResponse.json(
                    { error: "model cannot be empty" },
                    { status: 400 }
                );
            }
            data.model = md;
        }

        if (typeof mileage !== "undefined") {
            data.mileage = mileage === null || mileage === "" ? null : Number(mileage);
        }

        if (typeof ownerPhone !== "undefined") {
            const ph = typeof ownerPhone === "string" ? ownerPhone.trim() : "";
            if (!ph) {
                return NextResponse.json(
                    { error: "ownerPhone cannot be empty" },
                    { status: 400 }
                );
            }
            data.ownerPhone = ph;
        }

        if (typeof notes !== "undefined") {
            data.notes = typeof notes === "string" && notes.trim() !== "" ? notes.trim() : null;
        }

        if (typeof color !== "undefined") {
            data.color = typeof color === "string" && color.trim() !== "" ? color.trim() : undefined;
        }

        if (typeof ownerName !== "undefined") {
            data.ownerName = typeof ownerName === "string" && ownerName.trim() !== "" ? ownerName.trim() : undefined;
        }

        if (Object.keys(data).length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const updated = await prisma.car.update({
            where: { id: carId },
            data,
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
