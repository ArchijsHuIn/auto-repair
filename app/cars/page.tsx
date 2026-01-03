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
                    <p className="mt-4 text-gray-600">Ielādē transportlīdzekļus...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Meklēt transportlīdzekļus</h1>
                    <p className="text-gray-600">Atrodiet transportlīdzekļus pēc jebkura kritērija</p>
                </div>
                <Link
                    href="/cars/new"
                    className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow-md transition-colors"
                >
                    + Reģistrēt transportlīdzekli
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-8 border border-gray-200">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Filtri</h2>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Notīrīt visu
                    </button>
                </div>

                {/* General Search */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vispārējā meklēšana (numura zīme, VIN, tālrunis, piezīmes)
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Meklēt..."
                        className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Make */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
                        <select
                            value={makeFilter}
                            onChange={(e) => setMakeFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        >
                            <option value="">Visas markas</option>
                            {uniqueMakes.map(make => (
                                <option key={make} value={make}>{make}</option>
                            ))}
                        </select>
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Modelis</label>
                        <select
                            value={modelFilter}
                            onChange={(e) => setModelFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        >
                            <option value="">Visi modeļi</option>
                            {uniqueModels.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Krāsa</label>
                        <select
                            value={colorFilter}
                            onChange={(e) => setColorFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        >
                            <option value="">Visas krāsas</option>
                            {uniqueColors.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
                        {/* Year From */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gads no</label>
                            <input
                                type="number"
                                value={yearFrom}
                                onChange={(e) => setYearFrom(e.target.value)}
                                placeholder="1990"
                                className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                            />
                        </div>

                        {/* Year To */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gads līdz</label>
                            <input
                                type="number"
                                value={yearTo}
                                onChange={(e) => setYearTo(e.target.value)}
                                placeholder="2025"
                                className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
                        {/* Mileage From */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nobraukums no</label>
                            <input
                                type="number"
                                value={mileageFrom}
                                onChange={(e) => setMileageFrom(e.target.value)}
                                placeholder="0"
                                className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                            />
                        </div>

                        {/* Mileage To */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nobraukums līdz</label>
                            <input
                                type="number"
                                value={mileageTo}
                                onChange={(e) => setMileageTo(e.target.value)}
                                placeholder="200k"
                                className="border border-gray-300 rounded-lg px-4 py-3 md:py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    Rāda <span className="font-bold text-blue-600">{filteredCars.length}</span> no {cars.length} transportlīdzekļiem
                </div>
            </div>

            {/* Results */}
            {filteredCars.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">Nevienam transportlīdzeklim neatbilst meklēšanas kritēriji.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Notīrīt filtrus
                    </button>
                </div>
            ) : (
                <>
                    {/* Mobile View: Card List */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filteredCars.map((car) => (
                            <Link
                                key={car.id}
                                href={`/cars/${car.id}`}
                                className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-blue-500 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="text-lg font-bold text-gray-900">{car.licensePlate}</div>
                                        <div className="text-gray-700">{car.make} {car.model}</div>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {car.color}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">Gads:</span> {car.year || "Nav"}
                                    </div>
                                    <div>
                                        <span className="font-medium">Nobraukums:</span> {car.mileage ? car.mileage.toLocaleString() : "Nav"}
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium">Tālrunis:</span> {car.ownerPhone}
                                    </div>
                                </div>
                                <div className="mt-3 text-blue-600 font-medium text-sm">
                                    Atvērt pārskatu →
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Numura zīme
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Auto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Krāsa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gads
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nobraukums
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Īpašnieka tālrunis
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        VIN
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Darbības
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
                                            {car.year || "Nav"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {car.mileage ? car.mileage.toLocaleString() : "Nav"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {car.ownerPhone}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {car.vin || "Nav"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Link
                                                href={`/cars/${car.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Atvērt pārskatu
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
