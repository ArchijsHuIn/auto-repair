"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
    vin: string | null;
    year: number | null;
    make: string;
    model: string;
    mileage: number | null;
    color: string;
    ownerName: string;
    ownerPhone: string;
    notes: string | null;
    createdAt: string;
    workOrders: WorkOrder[];
};

export default function CarDetailPage() {
    const params = useParams();
    const router = useRouter();
    const carId = params.id as string;
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCarDetails();
    }, [carId]);

    const fetchCarDetails = async () => {
        try {
            const res = await fetch(`/api/cars/${carId}`);
            if (!res.ok) {
                throw new Error("Car not found");
            }
            const data = await res.json();
            setCar(data);
        } catch (error) {
            console.error("Error fetching car details:", error);
            alert("Car not found");
            router.push("/cars");
        } finally {
            setLoading(false);
        }
    };

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
                <div className="text-center">Loading car details...</div>
            </div>
        );
    }

    if (!car) {
        return null;
    }

    const totalSpent = car.workOrders
        .filter(wo => wo.totalPrice)
        .reduce((sum, wo) => sum + Number(wo.totalPrice), 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-6">
                <Link href="/cars" className="text-blue-600 hover:text-blue-800">
                    ← Back to Cars
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">{car.licensePlate}</h1>
                        <p className="text-2xl text-gray-700">
                            {car.year} {car.make} {car.model}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/cars/${car.id}/edit`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-3 rounded-lg shadow-sm border border-gray-300 transition-colors"
                        >
                            Edit Vehicle
                        </Link>
                        <Link
                            href={`/work-orders/new?carId=${car.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
                        >
                            + New Work Order
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Owner</div>
                        <div className="text-lg font-semibold text-gray-800">{car.ownerName}</div>
                        <div className="text-sm text-gray-600">{car.ownerPhone}</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Color</div>
                        <div className="text-lg font-semibold text-gray-800">{car.color}</div>
                    </div>

                    {car.mileage && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Mileage</div>
                            <div className="text-lg font-semibold text-gray-800">
                                {car.mileage.toLocaleString()} miles
                            </div>
                        </div>
                    )}

                    {car.vin && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">VIN</div>
                            <div className="text-sm font-mono font-semibold text-gray-800">{car.vin}</div>
                        </div>
                    )}

                    <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Total Work Orders</div>
                        <div className="text-2xl font-bold text-gray-800">{car.workOrders.length}</div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Total Spent</div>
                        <div className="text-2xl font-bold text-gray-800">€{totalSpent.toFixed(2)}</div>
                    </div>
                </div>

                {car.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">Notes:</div>
                        <p className="text-gray-800">{car.notes}</p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Work Order History</h2>
                    <Link
                        href={`/cars/${car.id}/history`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        View full history →
                    </Link>
                </div>

                {car.workOrders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">No work orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {car.workOrders.slice(0, 3).map((order) => (
                            <Link
                                key={order.id}
                                href={`/work-orders/${order.id}`}
                                className="block bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200 transition-colors"
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
                                            €{Number(order.totalPrice).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
