"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { translateWorkOrderStatus, translatePaymentStatus, translateWorkOrderItemType } from "@/lib/translations";

type WorkItem = {
    id: number;
    type: string;
    description: string;
    quantity: string;
    unitPrice: string;
    total: string;
};

type Car = {
    id: number;
    licensePlate: string;
    make: string;
    model: string;
    year: number | null;
    ownerName: string;
    ownerPhone: string;
};

type WorkOrder = {
    id: number;
    carId: number;
    status: string;
    title: string;
    customerComplaint: string | null;
    internalNotes: string | null;
    estimatedCompletion: string | null;
    paymentStatus: string;
    paymentMethod: string | null;
    totalLabor: string | null;
    totalParts: string | null;
    totalPrice: string | null;
    createdAt: string;
    completedAt: string | null;
    car: Car;
    items: WorkItem[];
};

export default function WorkOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [showItemForm, setShowItemForm] = useState(false);
    const [editingItem, setEditingItem] = useState<WorkItem | null>(null);
    const [itemForm, setItemForm] = useState({
        type: "PART",
        description: "",
        quantity: "1",
        unitPrice: "0",
    });

    // Edit states for customer complaint and internal notes
    const [editingComplaint, setEditingComplaint] = useState(false);
    const [complaintDraft, setComplaintDraft] = useState("");
    const [savingComplaint, setSavingComplaint] = useState(false);
    const [editingNotes, setEditingNotes] = useState(false);
    const [notesDraft, setNotesDraft] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);

    const [editingTitle, setEditingTitle] = useState(false);
    const [titleDraft, setTitleDraft] = useState("");
    const [savingTitle, setSavingTitle] = useState(false);

    useEffect(() => {
        fetchWorkOrder();
    }, [orderId]);

    const fetchWorkOrder = async () => {
        try {
            const res = await fetch(`/api/work-orders/${orderId}`);
            if (!res.ok) {
                throw new Error("Darba uzdevums nav atrasts");
            }
            const data = await res.json();
            setWorkOrder(data);
        } catch (error) {
            console.error("Kļūda ielādējot darba uzdevumu:", error);
            alert("Darba uzdevums nav atrasts");
            router.push("/work-orders");
        } finally {
            setLoading(false);
        }
    };

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setItemForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const quantity = parseFloat(itemForm.quantity);
        const unitPrice = parseFloat(itemForm.unitPrice);
        const total = quantity * unitPrice;

        const payload = {
            type: itemForm.type,
            description: itemForm.description,
            quantity,
            unitPrice,
            total,
        };

        try {
            const url = editingItem
                ? `/api/work-orders/${orderId}/items/${editingItem.id}`
                : `/api/work-orders/${orderId}/items`;
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Failed to save item");
            }

            setItemForm({ type: "PART", description: "", quantity: "1", unitPrice: "0" });
            setShowItemForm(false);
            setEditingItem(null);
            fetchWorkOrder();
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Failed to save item");
        }
    };

    const handleEditItem = (item: WorkItem) => {
        setEditingItem(item);
        setItemForm({
            type: item.type,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
        });
        setShowItemForm(true);
    };

    const handleDeleteItem = async (itemId: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`/api/work-orders/${orderId}/items/${itemId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete item");
            }

            fetchWorkOrder();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item");
        }
    };

    const startEditComplaint = () => {
        if (!workOrder) return;
        setComplaintDraft(workOrder.customerComplaint ?? "");
        setEditingComplaint(true);
    };

    const cancelEditComplaint = () => {
        setEditingComplaint(false);
        setComplaintDraft("");
    };

    const saveComplaint = async () => {
        try {
            setSavingComplaint(true);
            const res = await fetch(`/api/work-orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerComplaint: complaintDraft }),
            });
            if (!res.ok) throw new Error("Failed to update complaint");
            setEditingComplaint(false);
            await fetchWorkOrder();
        } catch (error) {
            console.error("Error updating complaint:", error);
            alert("Neizdevās atjaunināt sūdzību");
        } finally {
            setSavingComplaint(false);
        }
    };

    const startEditNotes = () => {
        if (!workOrder) return;
        setNotesDraft(workOrder.internalNotes ?? "");
        setEditingNotes(true);
    };

    const cancelEditNotes = () => {
        setEditingNotes(false);
        setNotesDraft("");
    };

    const saveNotes = async () => {
        try {
            setSavingNotes(true);
            const res = await fetch(`/api/work-orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ internalNotes: notesDraft }),
            });
            if (!res.ok) throw new Error("Failed to update notes");
            setEditingNotes(false);
            await fetchWorkOrder();
        } catch (error) {
            console.error("Error updating notes:", error);
            alert("Neizdevās atjaunināt piezīmes");
        } finally {
            setSavingNotes(false);
        }
    };

    const startEditTitle = () => {
        if (!workOrder) return;
        setTitleDraft(workOrder.title);
        setEditingTitle(true);
    };

    const cancelEditTitle = () => {
        setEditingTitle(false);
        setTitleDraft("");
    };

    const saveTitle = async () => {
        if (!titleDraft.trim()) {
            alert("Nosaukums nevar būt tukšs");
            return;
        }
        try {
            setSavingTitle(true);
            const res = await fetch(`/api/work-orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: titleDraft }),
            });
            if (!res.ok) throw new Error("Failed to update title");
            setEditingTitle(false);
            await fetchWorkOrder();
        } catch (error) {
            console.error("Error updating title:", error);
            alert("Neizdevās atjaunināt nosaukumu");
        } finally {
            setSavingTitle(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/work-orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }

            fetchWorkOrder();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const handlePaymentUpdate = async (paymentStatus: string) => {
        try {
            const res = await fetch(`/api/work-orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentStatus }),
            });

            if (!res.ok) {
                throw new Error("Failed to update payment status");
            }

            fetchWorkOrder();
        } catch (error) {
            console.error("Error updating payment:", error);
            alert("Failed to update payment status");
        }
    };

    const downloadPDF = async () => {
        try {
            const res = await fetch(`/api/work-orders/${orderId}/pdf`);
            if (!res.ok) {
                throw new Error("Failed to generate PDF");
            }

            const contentDisposition = res.headers.get("Content-Disposition");
            const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
            const filename = filenameMatch ? filenameMatch[1] : `rekins-${orderId}.pdf`;

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert("Failed to generate PDF");
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            NEW: "bg-blue-100 text-blue-800",
            DIAGNOSTIC: "bg-purple-100 text-purple-800",
            WAITING_PARTS: "bg-yellow-100 text-yellow-800",
            IN_PROGRESS: "bg-orange-100 text-orange-800",
            DONE: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getPaymentStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            UNPAID: "bg-red-100 text-red-800",
            PARTIAL: "bg-yellow-100 text-yellow-800",
            PAID: "bg-green-100 text-green-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Ielādē darba uzdevumu...</div>
            </div>
        );
    }

    if (!workOrder) {
        return null;
    }

    const totalFromItems = workOrder.items.reduce((sum, item) => sum + parseFloat(item.total), 0);
    const laborTotal = workOrder.items
        .filter(item => item.type === "LABOR")
        .reduce((sum, item) => sum + parseFloat(item.total), 0);
    const partsTotal = workOrder.items
        .filter(item => item.type === "PART")
        .reduce((sum, item) => sum + parseFloat(item.total), 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-6 flex justify-between items-center">
                <Link href="/work-orders" className="text-blue-600 hover:text-blue-800">
                    ← Atpakaļ uz darba uzdevumiem
                </Link>
                {workOrder.status === "DONE" && (
                    <button
                        onClick={downloadPDF}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
                    >
                        📄 Lejupielādēt PDF rēķinu
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 mr-4">
                        <div className="flex items-center justify-between mb-2">
                            {!editingTitle ? (
                                <>
                                    <h1 className="text-4xl font-bold text-gray-800">{workOrder.title}</h1>
                                    <button
                                        type="button"
                                        onClick={startEditTitle}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                    >
                                        Rediģēt
                                    </button>
                                </>
                            ) : null}
                        </div>
                        {editingTitle ? (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={titleDraft}
                                    onChange={(e) => setTitleDraft(e.target.value)}
                                    className="text-4xl font-bold text-gray-800 border border-blue-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 bg-white"
                                    autoFocus
                                />
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={saveTitle}
                                        disabled={savingTitle}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg"
                                    >
                                        {savingTitle ? "Saglabā..." : "Saglabāt"}
                                    </button>
                                    <button
                                        onClick={cancelEditTitle}
                                        disabled={savingTitle}
                                        className="px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-100 font-semibold"
                                    >
                                        Atcelt
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600">Darba uzdevums #{workOrder.id}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(workOrder.status)}`}>
                            {translateWorkOrderStatus(workOrder.status)}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPaymentStatusColor(workOrder.paymentStatus)}`}>
                            {translatePaymentStatus(workOrder.paymentStatus)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">Transportlīdzeklis</div>
                        <Link href={`/cars/${workOrder.car.id}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                            {workOrder.car.licensePlate}
                        </Link>
                        <div className="text-gray-700">
                            {workOrder.car.year} {workOrder.car.make} {workOrder.car.model}
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">Klients</div>
                        <div className="text-lg font-semibold text-gray-800">{workOrder.car.ownerName}</div>
                        <div className="text-gray-700">{workOrder.car.ownerPhone}</div>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-blue-800">Klienta sūdzība:</div>
                        {!editingComplaint ? (
                            <button
                                type="button"
                                onClick={startEditComplaint}
                                className="text-blue-700 hover:text-blue-900 text-sm font-semibold"
                            >
                                Rediģēt
                            </button>
                        ) : null}
                    </div>
                    {editingComplaint ? (
                        <div>
                            <textarea
                                value={complaintDraft}
                                onChange={(e) => setComplaintDraft(e.target.value)}
                                rows={3}
                                placeholder="Aprakstiet klienta sūdzību..."
                                className="border border-blue-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            <div className="mt-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={saveComplaint}
                                    disabled={savingComplaint}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg"
                                >
                                    {savingComplaint ? "Saglabā..." : "Saglabāt"}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEditComplaint}
                                    disabled={savingComplaint}
                                    className="px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-100"
                                >
                                    Atcelt
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 min-h-5">
                            {workOrder.customerComplaint ?? <span className="text-gray-400">Nav norādīts</span>}
                        </p>
                    )}
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-yellow-800">Iekšējās piezīmes:</div>
                        {!editingNotes ? (
                            <button
                                type="button"
                                onClick={startEditNotes}
                                className="text-yellow-700 hover:text-yellow-900 text-sm font-semibold"
                            >
                                Rediģēt
                            </button>
                        ) : null}
                    </div>
                    {editingNotes ? (
                        <div>
                            <textarea
                                value={notesDraft}
                                onChange={(e) => setNotesDraft(e.target.value)}
                                rows={3}
                                placeholder="Iekšējās piezīmes..."
                                className="border border-yellow-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-500 bg-white"
                            />
                            <div className="mt-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={saveNotes}
                                    disabled={savingNotes}
                                    className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg"
                                >
                                    {savingNotes ? "Saglabā..." : "Saglabāt"}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEditNotes}
                                    disabled={savingNotes}
                                    className="px-4 py-2 rounded-lg border border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                                >
                                    Atcelt
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 min-h-5">
                            {workOrder.internalNotes ?? <span className="text-gray-400">Nav norādīts</span>}
                        </p>
                    )}
                </div>

                <div className="flex gap-4 mb-6">
                    <div>
                        <span className="text-sm text-gray-600">Izveidots:</span>
                        <span className="ml-2 text-gray-800">{new Date(workOrder.createdAt).toLocaleString()}</span>
                    </div>
                    {workOrder.estimatedCompletion && (
                        <div>
                            <span className="text-sm text-gray-600">Plānotais pabeigšanas laiks:</span>
                            <span className="ml-2 text-gray-800">{new Date(workOrder.estimatedCompletion).toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 mb-4">
                    <select
                        value={workOrder.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="NEW">Jauns</option>
                        <option value="DIAGNOSTIC">Diagnostika</option>
                        <option value="WAITING_PARTS">Gaidām detaļas</option>
                        <option value="IN_PROGRESS">Procesā</option>
                        <option value="DONE">Pabeigts</option>
                        <option value="CANCELLED">Atcelts</option>
                    </select>

                    <select
                        value={workOrder.paymentStatus}
                        onChange={(e) => handlePaymentUpdate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                    >
                        <option value="UNPAID">Neapmaksāts</option>
                        <option value="PARTIAL">Daļēji apmaksāts</option>
                        <option value="PAID">Apmaksāts</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Darba izejmateriāli</h2>
                    <button
                        onClick={() => {
                            setShowItemForm(!showItemForm);
                            setEditingItem(null);
                            setItemForm({ type: "PART", description: "", quantity: "1", unitPrice: "0" });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors"
                    >
                        {showItemForm ? "Atcelt" : "+ Pievienot izejmateriālu"}
                    </button>
                </div>

                {showItemForm && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-blue-100">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            {editingItem ? "Rediģēt pozīciju" : "Pievienot jaunu pozīciju"}
                        </h3>
                        <form onSubmit={handleItemSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tips <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    value={itemForm.type}
                                    onChange={handleItemChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="PART">Detaļa</option>
                                    <option value="LABOR">Darbs</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Apraksts <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={itemForm.description}
                                    onChange={handleItemChange}
                                    required
                                    rows={2}
                                    placeholder="piem., Eļļas filtrs, Bremžu kluči, Darba stundas..."
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Daudzums <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="quantity"
                                    type="number"
                                    step="0.01"
                                    value={itemForm.quantity}
                                    onChange={handleItemChange}
                                    required
                                    min="0"
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vienības cena (€) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="unitPrice"
                                    type="number"
                                    step="0.01"
                                    value={itemForm.unitPrice}
                                    onChange={handleItemChange}
                                    required
                                    min="0"
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <div className="text-right mb-2">
                                    <span className="text-sm text-gray-600">Kopā: </span>
                                    <span className="text-lg font-bold text-blue-600">
                                        €{(parseFloat(itemForm.quantity || "0") * parseFloat(itemForm.unitPrice || "0")).toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
                                >
                                    {editingItem ? "Atjaunināt" : "Pievienot"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {workOrder.items.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Vēl nav pievienotu pozīciju.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tips</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Apraksts</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Daudz.</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Vienības cena</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Kopā</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Darbības</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {workOrder.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                item.type === "LABOR" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                            }`}>
                                                {translateWorkOrderItemType(item.type)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">{item.description}</td>
                                        <td className="px-4 py-3 text-right text-gray-800">{parseFloat(item.quantity).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right text-gray-800">€{parseFloat(item.unitPrice).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-800">€{parseFloat(item.total).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleEditItem(item)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Rediģēt
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Dzēst
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-100 font-semibold">
                                <tr>
                                    <td colSpan={4} className="px-4 py-3 text-right text-gray-700">Darba starpsumma:</td>
                                    <td className="px-4 py-3 text-right text-gray-800">€{laborTotal.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="px-4 py-3 text-right text-gray-700">Detaļu starpsumma:</td>
                                    <td className="px-4 py-3 text-right text-gray-800">€{partsTotal.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                                <tr className="text-lg">
                                    <td colSpan={4} className="px-4 py-3 text-right text-gray-800">Kopējā summa:</td>
                                    <td className="px-4 py-3 text-right text-blue-600">€{totalFromItems.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
