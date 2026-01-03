"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCarPage() {
    const router = useRouter();
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
            const res = await fetch("/api/cars", {
                method: "POST",
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
                    // Optional defaults in API: ownerName/color only sent if provided
                    ...(form.ownerName.trim() ? { ownerName: form.ownerName.trim() } : {}),
                    ...(form.color.trim() ? { color: form.color.trim() } : {}),
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.error || "Failed to create car");
                return;
            }

            const created = await res.json();
            router.push(`/cars/${created.id}`);
        } catch (e) {
            console.error(e);
            alert("Failed to create car");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Jauna transportlīdzekļa reģistrēšana</h1>
                <p className="text-gray-600">Pievieno transportlīdzekli servisa reģistram</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-100">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valsts numura zīme <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="licensePlate"
                            value={form.licensePlate}
                            onChange={handleChange}
                            placeholder="AB-1234"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            VIN numurs
                        </label>
                        <input
                            name="vin"
                            value={form.vin}
                            onChange={handleChange}
                            placeholder=""
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Izlaiduma gads
                        </label>
                        <input
                            name="year"
                            type="number"
                            value={form.year}
                            onChange={handleChange}
                            placeholder="2000"
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Marka <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="make"
                            value={form.make}
                            onChange={handleChange}
                            placeholder="Toyota"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Modelis <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="model"
                            value={form.model}
                            onChange={handleChange}
                            placeholder="Camry"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nobraukums (km)
                        </label>
                        <input
                            name="mileage"
                            type="number"
                            value={form.mileage}
                            onChange={handleChange}
                            placeholder=""
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Īpašnieka vārds
                        </label>
                        <input
                            name="ownerName"
                            value={form.ownerName}
                            onChange={handleChange}
                            placeholder=""
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Īpašnieka tālruņa numurs <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="ownerPhone"
                            value={form.ownerPhone}
                            onChange={handleChange}
                            placeholder="+371 21234567"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Auto krāsa
                        </label>
                        <input
                            name="color"
                            value={form.color}
                            onChange={handleChange}
                            placeholder="Melna"
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Piezīmes
                        </label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Papildus informācija par auto..."
                            rows={3}
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 text-base"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
                        >
                            {submitting ? "Reģistrē..." : "Reģistrēt transportlīdzekli"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
