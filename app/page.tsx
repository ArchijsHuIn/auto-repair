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
    const [loading, setLoading] = useState(true);

    const fetchCars = async () => {
        const res = await fetch("/api/cars?hasOpenWork=true");
        const data = await res.json();
        setCars(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCars();
    }, []);

    // Registration is available via /cars/new, not on homepage

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Aktuālās automašīnas</h1>
                <p className="text-gray-600">Tikai automobīļi, kuriem nav pabeigta kāds no darbiem</p>
            </div>

            {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : cars.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-lg">No active vehicles right now.</p>
                    <p className="text-gray-400 mt-2">Register a car and create a work order to see it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <Link key={car.id} href={`/cars/${car.id}`} className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-gray-200">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3">
                                <div className="text-xl font-bold">{car.licensePlate}</div>
                                <div className="text-sm opacity-90">{car.year || "N/A"} {car.make} {car.model}</div>
                            </div>
                            <div className="p-4">
                                <div className="text-gray-700 flex items-center gap-2">
                                    <span className="font-medium">📞</span>
                                    <span>{car.ownerPhone}</span>
                                </div>
                                <div className="mt-3 text-blue-600 font-medium">Apskatīt auto →</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
