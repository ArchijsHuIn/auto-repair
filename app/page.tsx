"use client";

import { useEffect, useState } from "react";

type Car = {
    id: number;
    licensePlate: string;
    year: number;
    make: string;
    model: string;
    createdAt: string;
};

export default function HomePage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [form, setForm] = useState({
        licensePlate: "",
        year: "",
        make: "",
        model: "",
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
                year: Number(form.year),
                make: form.make,
                model: form.model,
            }),
        });

        if (!res.ok) {
            console.error("Failed to create car");
            return;
        }

        setForm({ licensePlate: "", year: "", make: "", model: "" });
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
                    placeholder="License plate"
                    className="border px-2 py-1 w-full"
                />
                <input
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="Year"
                    className="border px-2 py-1 w-full"
                />
                <input
                    name="make"
                    value={form.make}
                    onChange={handleChange}
                    placeholder="Make"
                    className="border px-2 py-1 w-full"
                />
                <input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Model"
                    className="border px-2 py-1 w-full"
                />

                <button type="submit" className="border px-4 py-1 mt-2">
                    Add car
                </button>
            </form>

            <ul className="space-y-2">
                {cars.map((car) => (
                    <li key={car.id} className="border px-3 py-2">
                        <div>
                            <strong>{car.licensePlate}</strong> – {car.year} {car.make}{" "}
                            {car.model}
                        </div>
                        <div className="text-xs text-gray-500">id: {car.id}</div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
