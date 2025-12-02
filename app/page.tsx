"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    const [showForm, setShowForm] = useState(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setShowForm(false);
        fetchCars();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Vehicle Registry</h1>
                <p className="text-gray-600">Manage and track all registered vehicles</p>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <div className="text-lg text-gray-700">
                    Total Vehicles: <span className="font-bold text-blue-600">{cars.length}</span>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
                >
                    <span className="text-xl">+</span>
                    {showForm ? "Cancel" : "Register New Vehicle"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-blue-100">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Register New Vehicle</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                License Plate <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="licensePlate"
                                value={form.licensePlate}
                                onChange={handleChange}
                                placeholder="ABC-1234"
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                VIN
                            </label>
                            <input
                                name="vin"
                                value={form.vin}
                                onChange={handleChange}
                                placeholder="17 character VIN"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year
                            </label>
                            <input
                                name="year"
                                type="number"
                                value={form.year}
                                onChange={handleChange}
                                placeholder="2024"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                placeholder="Toyota"
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                placeholder="Camry"
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mileage
                            </label>
                            <input
                                name="mileage"
                                type="number"
                                value={form.mileage}
                                onChange={handleChange}
                                placeholder="50000"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                placeholder="(555) 123-4567"
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Additional information..."
                                rows={3}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button 
                                type="submit" 
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
                            >
                                Register Vehicle
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">No vehicles registered yet.</p>
                        <p className="text-gray-400 mt-2">Click "Register New Vehicle" to get started.</p>
                    </div>
                ) : (
                    cars.map((car) => (
                        <div key={car.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-gray-200">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3">
                                <div className="text-xl font-bold">{car.licensePlate}</div>
                                <div className="text-sm opacity-90">{car.year || "N/A"} {car.make} {car.model}</div>
                            </div>

                            <div className="p-4 space-y-3">
                                <div className="flex items-center text-gray-700">
                                    <span className="font-medium mr-2">📞</span>
                                    <span>{car.ownerPhone}</span>
                                </div>

                                {car.mileage && (
                                    <div className="flex items-center text-gray-700">
                                        <span className="font-medium mr-2">🛣️</span>
                                        <span>{car.mileage.toLocaleString()} miles</span>
                                    </div>
                                )}

                                {car.vin && (
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="font-medium mr-2">VIN:</span>
                                        <span className="truncate">{car.vin}</span>
                                    </div>
                                )}

                                {car.notes && (
                                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 italic">
                                        "{car.notes}"
                                    </div>
                                )}

                                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <div className="text-xs text-gray-400">
                                        ID: {car.id}
                                    </div>
                                    <Link 
                                        href={`/work-orders?carId=${car.id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                    >
                                        View Orders →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
