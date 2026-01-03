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
                <div className="text-center">Ielādē…</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Link href="/work-orders" className="text-blue-600 hover:text-blue-800">
                    ← Atpakaļ uz darba uzdevumiem
                </Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Jauns darba uzdevums</h1>
            <p className="text-gray-600 mb-6">Izveidot jaunu darba uzdevumu transportlīdzeklim</p>

            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Izvēlieties transportlīdzekli <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="carId"
                            value={form.carId}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        >
                            <option value="">-- Izvēlieties transportlīdzekli --</option>
                            {cars.map((car) => (
                                <option key={car.id} value={car.id}>
                                    {car.licensePlate} - {car.year} {car.make} {car.model}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Statuss <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        >
                            <option value="NEW">Jauns</option>
                            <option value="DIAGNOSTIC">Diagnostika</option>
                            <option value="WAITING_PARTS">Gaida detaļas</option>
                            <option value="IN_PROGRESS">Procesā</option>
                            <option value="DONE">Pabeigts</option>
                            <option value="CANCELLED">Atcelts</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nosaukums <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Īss darba apraksts"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Klienta sūdzība</label>
                        <textarea
                            name="customerComplaint"
                            value={form.customerComplaint}
                            onChange={handleChange}
                            placeholder="Ko ziņoja klients..."
                            rows={3}
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Iekšējās piezīmes</label>
                        <textarea
                            name="internalNotes"
                            value={form.internalNotes}
                            onChange={handleChange}
                            placeholder="Piezīmes mehāniķiem (nav redzamas klientam)..."
                            rows={3}
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plānotais pabeigšanas laiks</label>
                        <input
                            name="estimatedCompletion"
                            type="datetime-local"
                            value={form.estimatedCompletion}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Apmaksas statuss <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="paymentStatus"
                            value={form.paymentStatus}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        >
                            <option value="UNPAID">Neapmaksāts</option>
                            <option value="PARTIAL">Daļēji apmaksāts</option>
                            <option value="PAID">Apmaksāts</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apmaksas veids</label>
                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        >
                            <option value="">-- Izvēlieties veidu --</option>
                            <option value="CASH">Skaidrā naudā</option>
                            <option value="CARD">Karte</option>
                            <option value="TRANSFER">Pārskaitījums</option>
                            <option value="OTHER">Cits</option>
                        </select>
                    </div>

                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium text-gray-700 mb-1">Darbs kopā (€)</label>*/}
                    {/*    <input*/}
                    {/*        name="totalLabor"*/}
                    {/*        type="number"*/}
                    {/*        step="0.01"*/}
                    {/*        value={form.totalLabor}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        placeholder="0.00"*/}
                    {/*        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium text-gray-700 mb-1">Rezerves daļas kopā (€)</label>*/}
                    {/*    <input*/}
                    {/*        name="totalParts"*/}
                    {/*        type="number"*/}
                    {/*        step="0.01"*/}
                    {/*        value={form.totalParts}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        placeholder="0.00"*/}
                    {/*        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium text-gray-700 mb-1">Kopējā cena (€)</label>*/}
                    {/*    <input*/}
                    {/*        name="totalPrice"*/}
                    {/*        type="number"*/}
                    {/*        step="0.01"*/}
                    {/*        value={form.totalPrice}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        placeholder="0.00"*/}
                    {/*        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-4">
                        <Link
                            href="/work-orders"
                            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg border border-gray-300 transition-colors"
                        >
                            Atcelt
                        </Link>
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
                        >
                            Izveidot darba uzdevumu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
