"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
    const searchParams = useSearchParams();
    const carIdFromUrl = searchParams.get("carId");

    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        carId: carIdFromUrl || "",
        status: "NEW",
        title: "",
        customerComplaint: "",
        internalNotes: "",
        estimatedCompletion: "",
        paymentStatus: "UNPAID",
        paymentMethod: "",
        totalLabor: "",
        totalParts: "",
        totalPrice: "",
    });

    const fetchWorkOrders = async () => {
        const res = await fetch("/api/work-orders");
        const data = await res.json();
        setWorkOrders(data);
    };

    const fetchCars = async () => {
        const res = await fetch("/api/cars");
        const data = await res.json();
        setCars(data);
    };

    useEffect(() => {
        fetchWorkOrders();
        fetchCars();
    }, []);

    useEffect(() => {
        if (carIdFromUrl) {
            setForm(prev => ({ ...prev, carId: carIdFromUrl }));
            setShowForm(true);
        }
    }, [carIdFromUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/work-orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                carId: Number(form.carId),
                status: form.status,
                title: form.title,
                customerComplaint: form.customerComplaint || null,
                internalNotes: form.internalNotes || null,
                estimatedCompletion: form.estimatedCompletion || null,
                paymentStatus: form.paymentStatus,
                paymentMethod: form.paymentMethod || null,
                totalLabor: form.totalLabor ? Number(form.totalLabor) : null,
                totalParts: form.totalParts ? Number(form.totalParts) : null,
                totalPrice: form.totalPrice ? Number(form.totalPrice) : null,
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Failed to create work order:", error);
            alert(error.error || "Failed to create work order");
            return;
        }

        setForm({
            carId: "",
            status: "NEW",
            title: "",
            customerComplaint: "",
            internalNotes: "",
            estimatedCompletion: "",
            paymentStatus: "UNPAID",
            paymentMethod: "",
            totalLabor: "",
            totalParts: "",
            totalPrice: "",
        });
        setShowForm(false);
        fetchWorkOrders();
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

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Work Orders</h1>
                <p className="text-gray-600">Manage repair jobs and track progress</p>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <div className="text-lg text-gray-700">
                    Total Work Orders: <span className="font-bold text-blue-600">{workOrders.length}</span>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
                >
                    <span className="text-xl">+</span>
                    {showForm ? "Cancel" : "Create Work Order"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-blue-100">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create New Work Order</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Vehicle <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="carId"
                                value={form.carId}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Select a vehicle --</option>
                                {cars.map((car) => (
                                    <option key={car.id} value={car.id}>
                                        {car.licensePlate} - {car.year} {car.make} {car.model}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="NEW">New</option>
                                <option value="DIAGNOSTIC">Diagnostic</option>
                                <option value="WAITING_PARTS">Waiting Parts</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Brief description of work"
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Customer Complaint
                            </label>
                            <textarea
                                name="customerComplaint"
                                value={form.customerComplaint}
                                onChange={handleChange}
                                placeholder="What the customer reported..."
                                rows={3}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Internal Notes
                            </label>
                            <textarea
                                name="internalNotes"
                                value={form.internalNotes}
                                onChange={handleChange}
                                placeholder="Notes for mechanics (not visible to customer)..."
                                rows={3}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estimated Completion
                            </label>
                            <input
                                name="estimatedCompletion"
                                type="datetime-local"
                                value={form.estimatedCompletion}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="paymentStatus"
                                value={form.paymentStatus}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="UNPAID">Unpaid</option>
                                <option value="PARTIAL">Partial</option>
                                <option value="PAID">Paid</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Method
                            </label>
                            <select
                                name="paymentMethod"
                                value={form.paymentMethod}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Select method --</option>
                                <option value="CASH">Cash</option>
                                <option value="CARD">Card</option>
                                <option value="TRANSFER">Transfer</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Labor ($)
                            </label>
                            <input
                                name="totalLabor"
                                type="number"
                                step="0.01"
                                value={form.totalLabor}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Parts ($)
                            </label>
                            <input
                                name="totalParts"
                                type="number"
                                step="0.01"
                                value={form.totalParts}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Price ($)
                            </label>
                            <input
                                name="totalPrice"
                                type="number"
                                step="0.01"
                                value={form.totalPrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
                            >
                                Create Work Order
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {workOrders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">No work orders yet.</p>
                        <p className="text-gray-400 mt-2">Click "Create Work Order" to get started.</p>
                    </div>
                ) : (
                    workOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{order.title}</h3>
                                    <p className="text-gray-600 mt-1">
                                        {order.car.licensePlate} - {order.car.year} {order.car.make} {order.car.model}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {order.customerComplaint && (
                                    <div className="bg-blue-50 p-3 rounded">
                                        <p className="text-sm font-medium text-blue-800 mb-1">Customer Complaint:</p>
                                        <p className="text-sm text-gray-700">{order.customerComplaint}</p>
                                    </div>
                                )}

                                {order.internalNotes && (
                                    <div className="bg-yellow-50 p-3 rounded">
                                        <p className="text-sm font-medium text-yellow-800 mb-1">Internal Notes:</p>
                                        <p className="text-sm text-gray-700">{order.internalNotes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">Order ID:</span> #{order.id}
                                </div>
                                <div>
                                    <span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                {order.estimatedCompletion && (
                                    <div>
                                        <span className="font-medium">Est. Completion:</span>{" "}
                                        {new Date(order.estimatedCompletion).toLocaleString()}
                                    </div>
                                )}
                                {order.paymentMethod && (
                                    <div>
                                        <span className="font-medium">Payment:</span> {order.paymentMethod}
                                    </div>
                                )}
                            </div>

                            {(order.totalLabor || order.totalParts || order.totalPrice) && (
                                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-6">
                                    {order.totalLabor && (
                                        <div>
                                            <span className="text-sm text-gray-600">Labor:</span>
                                            <span className="ml-2 font-semibold text-gray-800">${Number(order.totalLabor).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {order.totalParts && (
                                        <div>
                                            <span className="text-sm text-gray-600">Parts:</span>
                                            <span className="ml-2 font-semibold text-gray-800">${Number(order.totalParts).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {order.totalPrice && (
                                        <div>
                                            <span className="text-sm text-gray-600">Total:</span>
                                            <span className="ml-2 font-bold text-blue-600 text-lg">${Number(order.totalPrice).toFixed(2)}</span>
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
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
            <WorkOrdersContent />
        </Suspense>
    );
}
