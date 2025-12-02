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
    color: string;
    ownerName: string;
    ownerPhone: string;
    _count: {
        workOrders: number;
    };
};

type Customer = {
    ownerName: string;
    ownerPhone: string;
    cars: Car[];
    totalWorkOrders: number;
};

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch("/api/customers");
            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.ownerPhone.includes(searchTerm) ||
        customer.cars.some(car => 
            car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading customers...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Customers</h1>
                <p className="text-gray-600">Manage customer information and vehicle history</p>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, phone, license plate, or vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="mb-4 text-lg text-gray-700">
                Total Customers: <span className="font-bold text-blue-600">{filteredCustomers.length}</span>
            </div>

            <div className="space-y-6">
                {filteredCustomers.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">No customers found.</p>
                    </div>
                ) : (
                    filteredCustomers.map((customer, idx) => (
                        <div
                            key={`${customer.ownerPhone}-${idx}`}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{customer.ownerName}</h3>
                                    <p className="text-gray-600 mt-1">📞 {customer.ownerPhone}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">Total Work Orders</div>
                                    <div className="text-3xl font-bold text-blue-600">{customer.totalWorkOrders}</div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                                    Vehicles ({customer.cars.length})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {customer.cars.map((car) => (
                                        <Link
                                            key={car.id}
                                            href={`/cars/${car.id}`}
                                            className="block bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg hover:shadow-md transition-all duration-200 border border-blue-100 hover:border-blue-300"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-bold text-lg text-gray-800">
                                                    {car.licensePlate}
                                                </div>
                                                {car._count.workOrders > 0 && (
                                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                        {car._count.workOrders} jobs
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-gray-700">
                                                {car.year} {car.make} {car.model}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {car.color}
                                            </div>
                                            {car.mileage && (
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {car.mileage.toLocaleString()} miles
                                                </div>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
