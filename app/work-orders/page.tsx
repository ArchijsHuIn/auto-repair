"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

type Car = {
    id: number;
    licensePlate: string;
    make: string;
    model: string;
    year: number | null;
};

type WorkOrder = {
    id: number;
    carId: number;
    status: string;
    title: string;
    customerComplaint: string | null;
    internalNotes: string | null;
    estimatedCompletion: string | null;
    paymentStatus: string;
    paymentMethod: string | null;
    totalLabor: string | null;
    totalParts: string | null;
    totalPrice: string | null;
    createdAt: string;
    completedAt: string | null;
    car: Car;
};

function WorkOrdersContent() {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

    const fetchWorkOrders = async () => {
        const res = await fetch("/api/work-orders");
        const data = await res.json();
        setWorkOrders(data);
    };

    useEffect(() => {
        fetchWorkOrders();
    }, []);

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

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Darba uzdevumi</h1>
                <p className="text-gray-600">Pārvaldiet remonta darbus un to progresu</p>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <div className="text-lg text-gray-700">
                    Kopā darba uzdevumu: <span className="font-bold text-blue-600">{workOrders.length}</span>
                </div>
                <Link
                    href="/work-orders/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
                >
                    <span className="text-xl">+</span>
                    Jauns darba uzdevums
                </Link>
            </div>

            <div className="space-y-4">
                {workOrders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">Vēl nav darba uzdevumu.</p>
                        <p className="text-gray-400 mt-2">Noklikšķiniet uz "Izveidot darba uzdevumu", lai sāktu.</p>
                    </div>
                ) : (
                    workOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Link href={`/work-orders/${order.id}`} className="text-xl font-bold text-gray-800 hover:underline">
                                        {order.title}
                                    </Link>
                                    <p className="text-gray-600 mt-1">
                                        <Link href={`/cars/${order.car.id}`} className="hover:underline">
                                            {order.car.licensePlate} - {order.car.year} {order.car.make} {order.car.model}
                                        </Link>
                                    </p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status.replace(/_/g, " ")}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                                        {order.paymentStatus}
                                    </span>
                                    <Link
                                        href={`/work-orders/${order.id}`}
                                        className="ml-2 text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
                                    >
                                        Rediģēt
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {order.customerComplaint && (
                                    <div className="bg-blue-50 p-3 rounded">
                                        <p className="text-sm font-medium text-blue-800 mb-1">Klienta sūdzība:</p>
                                        <p className="text-sm text-gray-700">{order.customerComplaint}</p>
                                    </div>
                                )}

                                {order.internalNotes && (
                                    <div className="bg-yellow-50 p-3 rounded">
                                        <p className="text-sm font-medium text-yellow-800 mb-1">Iekšējās piezīmes:</p>
                                        <p className="text-sm text-gray-700">{order.internalNotes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Inline edit removed; use the dedicated edit page */}

                            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">Uzdevuma ID:</span> #{order.id}
                                </div>
                                <div>
                                    <span className="font-medium">Izveidots:</span> {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                {order.estimatedCompletion && (
                                    <div>
                                        <span className="font-medium">Plānotais pabeigšanas laiks:</span>{" "}
                                        {new Date(order.estimatedCompletion).toLocaleString()}
                                    </div>
                                )}
                                {order.paymentMethod && (
                                    <div>
                                        <span className="font-medium">Maksājums:</span> {order.paymentMethod}
                                    </div>
                                )}
                            </div>

                            {(order.totalLabor || order.totalParts || order.totalPrice) && (
                                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-6">
                                    {order.totalLabor && (
                                        <div>
                                            <span className="text-sm text-gray-600">Darbs:</span>
                                            <span className="ml-2 font-semibold text-gray-800">€{Number(order.totalLabor).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {order.totalParts && (
                                        <div>
                                            <span className="text-sm text-gray-600">Rezerves daļas:</span>
                                            <span className="ml-2 font-semibold text-gray-800">€{Number(order.totalParts).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {order.totalPrice && (
                                        <div>
                                            <span className="text-sm text-gray-600">Kopā:</span>
                                            <span className="ml-2 font-bold text-blue-600 text-lg">€{Number(order.totalPrice).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default function WorkOrdersPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Ielādē...</div>}>
            <WorkOrdersContent />
        </Suspense>
    );
}
