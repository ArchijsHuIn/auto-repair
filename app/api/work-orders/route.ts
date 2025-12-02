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
        if (!carId || !status || !title || !paymentStatus) {
            return NextResponse.json(
                { error: "Missing required fields: carId, status, title, paymentStatus" },
                { status: 400 }
            );
        }

        // Validate that car exists
        const car = await prisma.car.findUnique({
            where: { id: carId },
        });

        if (!car) {
            return NextResponse.json(
                { error: "Car not found" },
                { status: 404 }
            );
        }

        const workOrder = await prisma.work_Done.create({
            data: {
                carId,
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
