"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
};

export default function EditCarPage() {
    const params = useParams();
    const router = useRouter();
    const carId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        licensePlate: "",
        vin: "",
        year: "",
        make: "",
        model: "",
        mileage: "",
        ownerName: "",
        ownerPhone: "",
        color: "",
        notes: "",
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`/api/cars/${carId}`);
                if (!res.ok) throw new Error("Car not found");
                const car: Car = await res.json();
                setForm({
                    licensePlate: car.licensePlate || "",
                    vin: car.vin || "",
                    year: car.year ? String(car.year) : "",
                    make: car.make || "",
                    model: car.model || "",
                    mileage: car.mileage ? String(car.mileage) : "",
                    ownerName: car.ownerName || "",
                    ownerPhone: car.ownerPhone || "",
                    color: car.color || "",
                    notes: car.notes || "",
                });
            } catch (e) {
                console.error(e);
                alert("Neizdevās ielādēt auto");
                router.push(`/cars/${carId}`);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [carId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/cars/${carId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    licensePlate: form.licensePlate.trim(),
                    vin: form.vin.trim() || null,
                    year: form.year ? Number(form.year) : null,
                    make: form.make.trim(),
                    model: form.model.trim(),
                    mileage: form.mileage ? Number(form.mileage) : null,
                    ownerPhone: form.ownerPhone.trim(),
                    notes: form.notes.trim() || null,
                    ...(form.ownerName.trim() ? { ownerName: form.ownerName.trim() } : {}),
                    ...(form.color.trim() ? { color: form.color.trim() } : {}),
                }),
            });

            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                alert(error.error || "Neizdevās atjaunināt auto");
                return;
            }

            router.push(`/cars/${carId}`);
        } catch (e) {
            console.error(e);
            alert("Neizdevās atjaunināt auto");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Ielādē...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-6">
                <Link href={`/cars/${carId}`} className="text-blue-600 hover:text-blue-800">
                    ← Atpakaļ uz auto
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">Rediģēt auto</h1>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valsts numura zīme <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="licensePlate"
                            value={form.licensePlate}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">VIN numurs</label>
                        <input
                            name="vin"
                            value={form.vin}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Izlaiduma gads</label>
                        <input
                            name="year"
                            type="number"
                            value={form.year}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marka <span className="text-red-500">*</span></label>
                        <input
                            name="make"
                            value={form.make}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Modelis <span className="text-red-500">*</span></label>
                        <input
                            name="model"
                            value={form.model}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nobraukums</label>
                        <input
                            name="mileage"
                            type="number"
                            value={form.mileage}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Īpašnieka vārds</label>
                        <input
                            name="ownerName"
                            value={form.ownerName}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Īpašnieka tālrunis <span className="text-red-500">*</span></label>
                        <input
                            name="ownerPhone"
                            value={form.ownerPhone}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Krāsa</label>
                        <input
                            name="color"
                            value={form.color}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Piezīmes</label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={4}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                        <Link
                            href={`/cars/${carId}`}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Atcelt
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg shadow-md"
                        >
                            {submitting ? "Saglabā..." : "Saglabāt"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
