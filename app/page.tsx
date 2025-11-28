"use client";

import { useEffect, useState } from "react";

type Car = {
    id: number;
    licensePlate: string;
    vin: string | null;
    year: number | null;
    make: string;
    model: string;
    mileage: number | null;
    ownerPhone: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
};

export default function HomePage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [form, setForm] = useState({
        licensePlate: "",
        vin: "",
        year: "",
        make: "",
        model: "",
        mileage: "",
        ownerPhone: "",
        notes: "",
    });

    const fetchCars = async () => {
        const res = await fetch("/api/cars");
        const data = await res.json();
        setCars(data);
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/cars", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                licensePlate: form.licensePlate,
                vin: form.vin || null,
                year: form.year ? Number(form.year) : null,
                make: form.make,
                model: form.model,
                mileage: form.mileage ? Number(form.mileage) : null,
                ownerPhone: form.ownerPhone,
                notes: form.notes || null,
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Failed to create car:", error);
            alert(error.error || "Failed to create car");
            return;
        }

        setForm({ 
            licensePlate: "", 
            vin: "", 
            year: "", 
            make: "", 
            model: "", 
            mileage: "", 
            ownerPhone: "", 
            notes: "" 
        });
        fetchCars();
    };

    return (
        <main className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Cars</h1>

            <form onSubmit={handleSubmit} className="space-y-2 mb-8">
                <input
                    name="licensePlate"
                    value={form.licensePlate}
                    onChange={handleChange}
                    placeholder="License plate *"
                    required
                    className="border px-2 py-1 w-full"
                />
                <input
                    name="vin"
                    value={form.vin}
                    onChange={handleChange}
                    placeholder="VIN (optional)"
                    className="border px-2 py-1 w-full"
                />
                <input
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="Year (optional)"
                    className="border px-2 py-1 w-full"
                />
                <input
                    name="make"
                    value={form.make}
                    onChange={handleChange}
                    placeholder="Make *"
                    required
                    className="border px-2 py-1 w-full"
                />
                <input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Model *"
                    required
                    className="border px-2 py-1 w-full"
                />
                <input
                    name="mileage"
                    type="number"
                    value={form.mileage}
                    onChange={handleChange}
                    placeholder="Mileage (optional)"
                    className="border px-2 py-1 w-full"
                />
                <input
                    name="ownerPhone"
                    value={form.ownerPhone}
                    onChange={handleChange}
                    placeholder="Owner phone *"
                    required
                    className="border px-2 py-1 w-full"
                />
                <input
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Notes (optional)"
                    className="border px-2 py-1 w-full"
                />

                <button type="submit" className="border px-4 py-1 mt-2 bg-blue-500 text-white hover:bg-blue-600">
                    Add car
                </button>
            </form>

            <ul className="space-y-2">
                {cars.map((car) => (
                    <li key={car.id} className="border px-3 py-2 rounded">
                        <div>
                            <strong>{car.licensePlate}</strong> – {car.year || "N/A"} {car.make}{" "}
                            {car.model}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            Owner: {car.ownerPhone}
                            {car.mileage && ` • Mileage: ${car.mileage.toLocaleString()}`}
                            {car.vin && ` • VIN: ${car.vin}`}
                        </div>
                        {car.notes && (
                            <div className="text-sm text-gray-500 mt-1 italic">
                                Notes: {car.notes}
                            </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                            ID: {car.id} • Added: {new Date(car.createdAt).toLocaleDateString()}
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
