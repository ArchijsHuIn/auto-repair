import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Handles GET requests to retrieve a list of customers.
 * Customers are derived by grouping cars by the owner's phone number.
 * 
 * @returns {Promise<NextResponse>} A JSON response containing the list of customers and their cars.
 */
export async function GET() {
    try {
        // Fetch all cars and include the count of work orders for each
        const cars = await prisma.car.findMany({
            include: {
                _count: {
                    select: { workOrders: true },
                },
            },
            orderBy: {
                ownerName: "asc",
            },
        });

        // Map to group cars by customer (using ownerPhone as a unique key)
        const customerMap = new Map<string, any>();

        cars.forEach((car) => {
            const key = car.ownerPhone;
            // Initialize customer entry if it doesn't exist
            if (!customerMap.has(key)) {
                customerMap.set(key, {
                    ownerName: car.ownerName,
                    ownerPhone: car.ownerPhone,
                    cars: [],
                    totalWorkOrders: 0,
                });
            }
            // Append car to customer's list and update the total work order count
            const customer = customerMap.get(key);
            customer.cars.push(car);
            customer.totalWorkOrders += car._count.workOrders;
        });

        // Convert the map values to a flat array for the response
        const customers = Array.from(customerMap.values());

        return NextResponse.json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json(
            { error: "Failed to fetch customers" },
            { status: 500 }
        );
    }
}
