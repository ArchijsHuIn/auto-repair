import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = parseInt(params.id);

        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Invalid work order ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { type, description, quantity, unitPrice, total } = body;

        if (!type || !description || quantity === undefined || unitPrice === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const item = await prisma.work_Item_Used.create({
            data: {
                workOrderId: orderId,
                type,
                description,
                quantity,
                unitPrice,
                total,
            },
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Error creating work item:", error);
        return NextResponse.json(
            { error: "Failed to create work item" },
            { status: 500 }
        );
    }
}
