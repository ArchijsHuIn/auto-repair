import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string; itemId: string }> }
) {
    try {
        const { itemId: itemIdParam } = await context.params;
        const itemId = parseInt(itemIdParam);

        if (isNaN(itemId)) {
            return NextResponse.json(
                { error: "Invalid item ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { type, description, quantity, unitPrice, total } = body;

        const item = await prisma.work_Item_Used.update({
            where: { id: itemId },
            data: {
                type,
                description,
                quantity,
                unitPrice,
                total,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Error updating work item:", error);
        return NextResponse.json(
            { error: "Failed to update work item" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string; itemId: string }> }
) {
    try {
        const { itemId: itemIdParam } = await context.params;
        const itemId = parseInt(itemIdParam);

        if (isNaN(itemId)) {
            return NextResponse.json(
                { error: "Invalid item ID" },
                { status: 400 }
            );
        }

        await prisma.work_Item_Used.delete({
            where: { id: itemId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting work item:", error);
        return NextResponse.json(
            { error: "Failed to delete work item" },
            { status: 500 }
        );
    }
}
