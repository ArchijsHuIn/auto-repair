"use client";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

type Car = {
    id: number;
    licensePlate: string;
    make: string;
    model: string;
    year: number | null;
};

type Appointment = {
    id: number;
    carId: number;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    car: Car;
};

type CalendarEvent = {
    id: number;
    title: string;
    start: Date;
    end: Date;
    resource: Appointment;
};

export default function CalendarPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
    const [form, setForm] = useState({
        carLicensePlate: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
    });

    useEffect(() => {
        fetchAppointments();
        fetchCars();
    }, []);

    const fetchAppointments = async () => {
        const res = await fetch("/api/appointments");
        const data = await res.json();
        setAppointments(data);
    };

    const fetchCars = async () => {
        const res = await fetch("/api/cars");
        const data = await res.json();
        setCars(data);
    };

    const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
        setSelectedSlot({ start, end });
        setForm({
            carLicensePlate: "",
            title: "",
            description: "",
            startTime: format(start, "yyyy-MM-dd'T'HH:mm"),
            endTime: format(end, "yyyy-MM-dd'T'HH:mm"),
        });
        setShowForm(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                carLicensePlate: form.carLicensePlate,
                title: form.title,
                description: form.description || null,
                startTime: new Date(form.startTime).toISOString(),
                endTime: new Date(form.endTime).toISOString(),
            }),
        });

        if (!res.ok) {
            alert("Failed to create appointment");
            return;
        }

        setForm({ carLicensePlate: "", title: "", description: "", startTime: "", endTime: "" });
        setShowForm(false);
        setSelectedSlot(null);
        fetchAppointments();
    };

    const events: CalendarEvent[] = appointments.map((apt) => ({
        id: apt.id,
        title: `${apt.car.licensePlate} - ${apt.title}`,
        start: new Date(apt.startTime),
        end: new Date(apt.endTime),
        resource: apt,
    }));

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Calendar & Scheduling</h1>
                <p className="text-gray-600">Manage appointments and schedule work</p>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-blue-100">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Appointment</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Vehicle <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="carLicensePlate"
                                value={form.carLicensePlate}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select a vehicle --</option>
                                {cars.map((car) => (
                                    <option key={car.id} value={car.licensePlate}>
                                        {car.licensePlate} - {car.year} {car.make} {car.model}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g., Oil change, Inspection"
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="startTime"
                                type="datetime-local"
                                value={form.startTime}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="endTime"
                                type="datetime-local"
                                value={form.endTime}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Additional notes..."
                                rows={3}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
                            >
                                Create Appointment
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedSlot(null);
                                }}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6" style={{ height: "700px" }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    views={["month", "week", "day", "agenda"]}
                    defaultView="week"
                    step={30}
                    showMultiDayTimes
                />
            </div>
        </div>
    );
}
