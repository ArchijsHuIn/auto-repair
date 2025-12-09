import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const orderId = parseInt(id);

        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Invalid work order ID" },
                { status: 400 }
            );
        }

        const workOrder = await prisma.work_Done.findUnique({
            where: { id: orderId },
            include: {
                car: {
                    select: {
                        id: true,
                        licensePlate: true,
                        make: true,
                        model: true,
                        year: true,
                        ownerName: true,
                        ownerPhone: true,
                    },
                },
                items: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!workOrder) {
            return NextResponse.json(
                { error: "Work order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(workOrder);
    } catch (error) {
        console.error("Error fetching work order:", error);
        return NextResponse.json(
            { error: "Failed to fetch work order" },
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
        const orderId = parseInt(id);

        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Invalid work order ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const updates: any = {};

        if (body.status !== undefined) {
            updates.status = body.status;
            if (body.status === "DONE") {
                updates.completedAt = new Date();
            }
        }

        if (body.paymentStatus !== undefined) {
            updates.paymentStatus = body.paymentStatus;
            if (body.paymentStatus === "PAID") {
                updates.paidAt = new Date();
            }
        }

        const workOrder = await prisma.work_Done.update({
            where: { id: orderId },
            data: updates,
            include: {
                car: true,
                items: true,
            },
        });

        return NextResponse.json(workOrder);
    } catch (error) {
        console.error("Error updating work order:", error);
        return NextResponse.json(
            { error: "Failed to update work order" },
            { status: 500 }
        );
    }
}
