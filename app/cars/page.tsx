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
    color: string;
    createdAt: string;
    updatedAt: string;
};

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    // Search filters
    const [searchTerm, setSearchTerm] = useState("");
    const [makeFilter, setMakeFilter] = useState("");
    const [modelFilter, setModelFilter] = useState("");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");
    const [mileageFrom, setMileageFrom] = useState("");
    const [mileageTo, setMileageTo] = useState("");
    const [colorFilter, setColorFilter] = useState("");

    useEffect(() => {
        fetchCars();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [cars, searchTerm, makeFilter, modelFilter, yearFrom, yearTo, mileageFrom, mileageTo, colorFilter]);

    const fetchCars = async () => {
        try {
            const res = await fetch("/api/cars");
            const data = await res.json();
            setCars(data);
            setFilteredCars(data);
        } catch (error) {
            console.error("Failed to fetch cars:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...cars];

        // General search (license plate, VIN, phone, notes)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(car =>
                car.licensePlate.toLowerCase().includes(term) ||
                car.vin?.toLowerCase().includes(term) ||
                car.ownerPhone.toLowerCase().includes(term) ||
                car.notes?.toLowerCase().includes(term)
            );
        }

        // Make filter
        if (makeFilter) {
            filtered = filtered.filter(car =>
                car.make.toLowerCase().includes(makeFilter.toLowerCase())
            );
        }

        // Model filter
        if (modelFilter) {
            filtered = filtered.filter(car =>
                car.model.toLowerCase().includes(modelFilter.toLowerCase())
            );
        }

        // Year range
        if (yearFrom) {
            filtered = filtered.filter(car =>
                car.year && car.year >= parseInt(yearFrom)
            );
        }
        if (yearTo) {
            filtered = filtered.filter(car =>
                car.year && car.year <= parseInt(yearTo)
            );
        }

        // Mileage range
        if (mileageFrom) {
            filtered = filtered.filter(car =>
                car.mileage && car.mileage >= parseInt(mileageFrom)
            );
        }
        if (mileageTo) {
            filtered = filtered.filter(car =>
                car.mileage && car.mileage <= parseInt(mileageTo)
            );
        }

        // Color filter
        if (colorFilter) {
            filtered = filtered.filter(car =>
                car.color.toLowerCase().includes(colorFilter.toLowerCase())
            );
        }

        setFilteredCars(filtered);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setMakeFilter("");
        setModelFilter("");
        setYearFrom("");
        setYearTo("");
        setMileageFrom("");
        setMileageTo("");
        setColorFilter("");
    };

    const uniqueMakes = Array.from(new Set(cars.map(car => car.make))).sort();
    const uniqueModels = Array.from(new Set(
        cars.filter(car => !makeFilter || car.make === makeFilter).map(car => car.model)
    )).sort();
    const uniqueColors = Array.from(new Set(cars.map(car => car.color))).sort();

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading vehicles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Search Vehicles</h1>
                    <p className="text-gray-600">Find vehicles by any metric</p>
                </div>
                <Link
                    href="/cars/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow-md transition-colors"
                >
                    + Register Vehicle
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Clear All
                    </button>
                </div>

                {/* General Search */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        General Search (License Plate, VIN, Phone, Notes)
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Make */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                        <select
                            value={makeFilter}
                            onChange={(e) => setMakeFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Makes</option>
                            {uniqueMakes.map(make => (
                                <option key={make} value={make}>{make}</option>
                            ))}
                        </select>
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                        <select
                            value={modelFilter}
                            onChange={(e) => setModelFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Models</option>
                            {uniqueModels.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <select
                            value={colorFilter}
                            onChange={(e) => setColorFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Colors</option>
                            {uniqueColors.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>

                    {/* Year From */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year From</label>
                        <input
                            type="number"
                            value={yearFrom}
                            onChange={(e) => setYearFrom(e.target.value)}
                            placeholder="1990"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Year To */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year To</label>
                        <input
                            type="number"
                            value={yearTo}
                            onChange={(e) => setYearTo(e.target.value)}
                            placeholder="2025"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Mileage From */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mileage From</label>
                        <input
                            type="number"
                            value={mileageFrom}
                            onChange={(e) => setMileageFrom(e.target.value)}
                            placeholder="0"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Mileage To */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mileage To</label>
                        <input
                            type="number"
                            value={mileageTo}
                            onChange={(e) => setMileageTo(e.target.value)}
                            placeholder="200000"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    Showing <span className="font-bold text-blue-600">{filteredCars.length}</span> of {cars.length} vehicles
                </div>
            </div>

            {/* Results */}
            {filteredCars.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No vehicles match your search criteria.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    License Plate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vehicle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Color
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Year
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mileage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Owner Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    VIN
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCars.map((car) => (
                                <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{car.licensePlate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{car.make} {car.model}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {car.color}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {car.year || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {car.mileage ? car.mileage.toLocaleString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {car.ownerPhone}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {car.vin || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Link
                                            href={`/cars/${car.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Open Overview
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
