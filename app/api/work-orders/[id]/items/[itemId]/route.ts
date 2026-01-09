import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Handles PUT requests to update a specific line item in a work order.
 * 
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} context - The route parameters.
 * @param {Promise<{id: string; itemId: string}>} context.params - Parameters containing work order ID and item ID.
 * @returns {Promise<NextResponse>} A JSON response with the updated item or an error message.
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string; itemId: string }> }
) {
    try {
        // Resolve parameters from context
        const { itemId: itemIdParam } = await context.params;
        // Parse item ID as integer
        const itemId = parseInt(itemIdParam);

        if (isNaN(itemId)) {
            return NextResponse.json(
                { error: "Invalid item ID" },
                { status: 400 }
            );
        }

        // Parse JSON request body
        const body = await request.json();
        // Destructure update data from the body
        const { type, description, quantity, unitPrice, total } = body;

        // Apply updates to the database for the specified item
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

/**
 * Handles DELETE requests to remove a specific line item from a work order.
 * 
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} context - The route parameters.
 * @param {Promise<{id: string; itemId: string}>} context.params - Parameters containing work order ID and item ID.
 * @returns {Promise<NextResponse>} A JSON response indicating success or failure.
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string; itemId: string }> }
) {
    try {
        // Resolve parameters from context
        const { itemId: itemIdParam } = await context.params;
        // Parse item ID as integer
        const itemId = parseInt(itemIdParam);

        if (isNaN(itemId)) {
            return NextResponse.json(
                { error: "Invalid item ID" },
                { status: 400 }
            );
        }

        // Remove the work item from the database
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
