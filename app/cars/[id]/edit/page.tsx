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
    ownerName?: string;
    ownerPhone: string;
    color?: string;
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
        const fetchCar = async () => {
            try {
                const res = await fetch(`/api/cars/${carId}`);
                if (!res.ok) throw new Error("Failed to load car");
                const data: Car = await res.json();
                setForm({
                    licensePlate: data.licensePlate || "",
                    vin: data.vin || "",
                    year: data.year ? String(data.year) : "",
                    make: data.make || "",
                    model: data.model || "",
                    mileage: data.mileage ? String(data.mileage) : "",
                    ownerName: data.ownerName || "",
                    ownerPhone: data.ownerPhone || "",
                    color: data.color || "",
                    notes: data.notes || "",
                });
            } catch (e) {
                console.error(e);
                alert("Car not found");
                router.push("/cars");
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [carId, router]);

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
                method: "PATCH",
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
                    ...(form.ownerName.trim() ? { ownerName: form.ownerName.trim() } : { ownerName: "" }),
                    ...(form.color.trim() ? { color: form.color.trim() } : { color: "" }),
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.error || "Failed to update car");
                return;
            }

            const updated: Car = await res.json();
            router.push(`/cars/${updated.id}`);
        } catch (e) {
            console.error(e);
            alert("Failed to update car");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Vehicle</h1>
                    <p className="text-gray-600">Update vehicle details</p>
                </div>
                <Link href={`/cars/${carId}`} className="text-blue-600 hover:text-blue-800">Cancel</Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            License Plate <span className="text-red-500">*</span>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                        <input
                            name="vin"
                            value={form.vin}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                            name="year"
                            type="number"
                            value={form.year}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Make <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="make"
                            value={form.make}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="model"
                            value={form.model}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                        <input
                            name="mileage"
                            type="number"
                            value={form.mileage}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                        <input
                            name="ownerName"
                            value={form.ownerName}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Owner Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="ownerPhone"
                            value={form.ownerPhone}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                            name="color"
                            value={form.color}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={3}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                        <Link
                            href={`/cars/${carId}`}
                            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
