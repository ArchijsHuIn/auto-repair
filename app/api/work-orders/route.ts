import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const workOrders = await prisma.work_Done.findMany({
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
                createdAt: "desc",
            },
        });

        return NextResponse.json(workOrders);
    } catch (error) {
        console.error("Error fetching work orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch work orders" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            carId,
            carLicensePlate,
            status,
            title,
            customerComplaint,
            internalNotes,
            estimatedCompletion,
            paymentStatus,
            paymentMethod,
            totalLabor,
            totalParts,
            totalPrice,
        } = body;

        // Validate required fields
        if ((!carId && !carLicensePlate) || !status || !title || !paymentStatus) {
            return NextResponse.json(
                { error: "Missing required fields: (carId or carLicensePlate), status, title, paymentStatus" },
                { status: 400 }
            );
        }

        // Resolve car by id or license plate
        let resolvedCarId: number | null = null;
        if (carId) {
            const carById = await prisma.car.findUnique({ where: { id: Number(carId) } });
            if (!carById) {
                return NextResponse.json(
                    { error: "Car not found" },
                    { status: 404 }
                );
            }
            resolvedCarId = carById.id;
        } else if (typeof carLicensePlate === "string" && carLicensePlate.trim() !== "") {
            const carByLp = await prisma.car.findUnique({ where: { licensePlate: carLicensePlate.trim() } });
            if (!carByLp) {
                return NextResponse.json(
                    { error: "Car not found for provided license plate" },
                    { status: 404 }
                );
            }
            resolvedCarId = carByLp.id;
        }

        if (!resolvedCarId) {
            return NextResponse.json({ error: "Unable to resolve car" }, { status: 400 });
        }

        const workOrder = await prisma.work_Done.create({
            data: {
                carId: resolvedCarId,
                status,
                title,
                customerComplaint,
                internalNotes,
                estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion) : null,
                paymentStatus,
                paymentMethod,
                totalLabor,
                totalParts,
                totalPrice,
            },
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
        });

        return NextResponse.json(workOrder, { status: 201 });
    } catch (error) {
        console.error("Error creating work order:", error);
        return NextResponse.json(
            { error: "Failed to create work order" },
            { status: 500 }
        );
    }
}
