"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type WorkOrder = {
    id: number;
    status: string;
    title: string;
    paymentStatus: string;
    totalPrice: string | null;
    createdAt: string;
    completedAt: string | null;
};

type Car = {
    id: number;
    licensePlate: string;
    year: number | null;
    make: string;
    model: string;
    workOrders: WorkOrder[];
};

export default function CarFullHistoryPage() {
    const params = useParams();
    const carId = params.id as string;

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const res = await fetch(`/api/cars/${carId}`);
                if (!res.ok) throw new Error("Car not found");
                const data = await res.json();
                setCar(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchCarDetails();
    }, [carId]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            NEW: "bg-blue-100 text-blue-800",
            DIAGNOSTIC: "bg-purple-100 text-purple-800",
            WAITING_PARTS: "bg-yellow-100 text-yellow-800",
            IN_PROGRESS: "bg-orange-100 text-orange-800",
            DONE: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getPaymentStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            UNPAID: "bg-red-100 text-red-800",
            PARTIAL: "bg-yellow-100 text-yellow-800",
            PAID: "bg-green-100 text-green-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading history...</div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Link href="/cars" className="text-blue-600 hover:text-blue-800">← Back to Cars</Link>
                <div className="mt-6 text-center">Car not found.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href={`/cars/${car.id}`} className="text-blue-600 hover:text-blue-800">
                        ← Back to Car
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 mt-2">
                        {car.licensePlate} — Full Work Order History
                    </h1>
                    <p className="text-gray-600">{car.year} {car.make} {car.model}</p>
                </div>
                <Link
                    href={`/work-orders/new?carId=${car.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
                >
                    + New Work Order
                </Link>
            </div>

            {car.workOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No work orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {car.workOrders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/work-orders/${order.id}`}
                            className="block bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{order.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        Created: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status.replace(/_/g, " ")}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                            {order.totalPrice && (
                                <div className="text-right">
                                    <span className="text-lg font-bold text-blue-600">
                                        ${Number(order.totalPrice).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
