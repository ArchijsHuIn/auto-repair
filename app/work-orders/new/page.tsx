"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Car = {
    id: number;
    licensePlate: string;
    make: string;
    model: string;
    year: number | null;
};

export default function NewWorkOrderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectCarId = searchParams.get("carId");

    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
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

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/cars");
                const data = await res.json();
                setCars(data);
                if (preselectCarId) {
                    setForm((prev) => ({ ...prev, carId: String(preselectCarId) }));
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [preselectCarId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
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
        };

        if (form.carId) {
            payload.carId = Number(form.carId);
        }

        const res = await fetch("/api/work-orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            alert((error as any).error || "Failed to create work order");
            return;
        }

        const created = await res.json();
        router.push(`/work-orders/${created.id}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading…</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Link href="/work-orders" className="text-blue-600 hover:text-blue-800">
                    ← Back to Work Orders
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">New Work Order</h1>
            <p className="text-gray-600 mb-6">Create a new work order for a vehicle</p>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Complaint</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Completion</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Labor ($)</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Parts ($)</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Price ($)</label>
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
        </div>
    );
}
