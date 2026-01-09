import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Handles POST requests to add a new line item to a specific work order.
 * Validates required fields and creates the item in the database.
 * 
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} context - The route parameters.
 * @param {Promise<{id: string}>} context.params - The work order ID.
 * @returns {Promise<NextResponse>} A JSON response with the created item or an error message.
 */
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // Resolve parameters from context
        const { id } = await context.params;
        // Parse work order ID as integer
        const orderId = parseInt(id);

        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Invalid work order ID" },
                { status: 400 }
            );
        }

        // Parse JSON request body
        const body = await request.json();
        // Destructure item data from the body
        const { type, description, quantity, unitPrice, total } = body;

        // Basic validation for required item fields
        if (!type || !description || quantity === undefined || unitPrice === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create the new work item in the database
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
