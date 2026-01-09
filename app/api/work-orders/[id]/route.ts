import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Handles GET requests to fetch details for a specific work order.
 * Includes information about the associated car and all line items.
 * 
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} context - The route parameters.
 * @param {Promise<{id: string}>} context.params - The work order ID.
 * @returns {Promise<NextResponse>} A JSON response with work order details or an error message.
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // Resolve parameters from context
        const { id } = await context.params;
        // Parse ID as integer
        const orderId = parseInt(id);

        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Invalid work order ID" },
                { status: 400 }
            );
        }

        // Fetch work order from database with car and items
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

/**
 * Handles PATCH requests to partially update a work order.
 * Manages status changes, payment updates, and timestamps (completedAt, paidAt).
 * 
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} context - The route parameters.
 * @param {Promise<{id: string}>} context.params - The work order ID.
 * @returns {Promise<NextResponse>} A JSON response with the updated work order or an error message.
 */
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // Resolve parameters from context
        const { id } = await context.params;
        // Parse ID as integer
        const orderId = parseInt(id);

        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Invalid work order ID" },
                { status: 400 }
            );
        }

        // Parse JSON request body
        const body = await request.json();
        // Object to hold fields to be updated
        const updates: any = {};

        // Handle status update and completion timestamp
        if (body.status !== undefined) {
            updates.status = body.status;
            if (body.status === "DONE") {
                updates.completedAt = new Date();
            }
        }

        // Handle payment status update and payment timestamp
        if (body.paymentStatus !== undefined) {
            updates.paymentStatus = body.paymentStatus;
            if (body.paymentStatus === "PAID") {
                updates.paidAt = new Date();
            }
        }

        // Handle customer complaint update (with trimming)
        if (body.customerComplaint !== undefined) {
            const v = body.customerComplaint;
            updates.customerComplaint = typeof v === "string" ? (v.trim() === "" ? null : v) : null;
        }

        // Handle internal notes update (with trimming)
        if (body.internalNotes !== undefined) {
            const v = body.internalNotes;
            updates.internalNotes = typeof v === "string" ? (v.trim() === "" ? null : v) : null;
        }

        // Handle title update
        if (body.title !== undefined) {
            updates.title = body.title;
        }

        // Apply updates to the database
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
