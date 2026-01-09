import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Handles GET requests to retrieve a list of cars.
 * Supports filtering by "hasOpenWork" query parameter.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} A JSON response containing the list of cars.
 */
export async function GET(request: Request) {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    // Check if "hasOpenWork" filter is applied
    const hasOpenWork = searchParams.get("hasOpenWork");

    if (hasOpenWork === "true") {
        // Return only cars that have at least one open (not DONE/CANCELLED) work order
        const carsWithOpenWork = await prisma.car.findMany({
            where: {
                workOrders: {
                    some: {
                        status: { notIn: ["DONE", "CANCELLED"] },
                    },
                },
            },
            orderBy: { id: "desc" },
        });
        return NextResponse.json(carsWithOpenWork);
    }

    // Default: Return all cars ordered by the most recently created
    const cars = await prisma.car.findMany({
        orderBy: { id: "desc" },
    });

    return NextResponse.json(cars);
}

/**
 * Handles POST requests to register a new car.
 * Validates required fields and handles duplicate license plate errors.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} A JSON response with the created car or an error message.
 */
export async function POST(request: Request) {
    try {
        // Parse the JSON request body
        const body = await request.json();
        // Destructure car data from the body
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
        } = body;

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

        const car = await prisma.car.create({
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

        return NextResponse.json(car, { status: 201 });
    } catch (error: any) {
        console.error("Error creating car:", error);

        // Handle unique constraint violation
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "A car with this license plate already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create car" },
            { status: 500 }
        );
    }
}


