"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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

    useEffect(() => {
        fetchWorkOrder();
    }, [orderId]);

    const fetchWorkOrder = async () => {
        try {
            const res = await fetch(`/api/work-orders/${orderId}`);
            if (!res.ok) {
                throw new Error("Work order not found");
            }
            const data = await res.json();
            setWorkOrder(data);
        } catch (error) {
            console.error("Error fetching work order:", error);
            alert("Work order not found");
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

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-${orderId}.pdf`;
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
                <div className="text-center">Loading work order...</div>
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
                    ← Back to Work Orders
                </Link>
                {workOrder.status === "DONE" && (
                    <button
                        onClick={downloadPDF}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
                    >
                        📄 Download PDF Invoice
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">{workOrder.title}</h1>
                        <p className="text-gray-600">Work Order #{workOrder.id}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(workOrder.status)}`}>
                            {workOrder.status.replace(/_/g, " ")}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPaymentStatusColor(workOrder.paymentStatus)}`}>
                            {workOrder.paymentStatus}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">Vehicle</div>
                        <Link href={`/cars/${workOrder.car.id}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                            {workOrder.car.licensePlate}
                        </Link>
                        <div className="text-gray-700">
                            {workOrder.car.year} {workOrder.car.make} {workOrder.car.model}
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">Customer</div>
                        <div className="text-lg font-semibold text-gray-800">{workOrder.car.ownerName}</div>
                        <div className="text-gray-700">{workOrder.car.ownerPhone}</div>
                    </div>
                </div>

                {workOrder.customerComplaint && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="text-sm font-medium text-blue-800 mb-2">Customer Complaint:</div>
                        <p className="text-gray-700">{workOrder.customerComplaint}</p>
                    </div>
                )}

                {workOrder.internalNotes && (
                    <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                        <div className="text-sm font-medium text-yellow-800 mb-2">Internal Notes:</div>
                        <p className="text-gray-700">{workOrder.internalNotes}</p>
                    </div>
                )}

                <div className="flex gap-4 mb-6">
                    <div>
                        <span className="text-sm text-gray-600">Created:</span>
                        <span className="ml-2 text-gray-800">{new Date(workOrder.createdAt).toLocaleString()}</span>
                    </div>
                    {workOrder.estimatedCompletion && (
                        <div>
                            <span className="text-sm text-gray-600">Est. Completion:</span>
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
                        <option value="NEW">New</option>
                        <option value="DIAGNOSTIC">Diagnostic</option>
                        <option value="WAITING_PARTS">Waiting Parts</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    <select
                        value={workOrder.paymentStatus}
                        onChange={(e) => handlePaymentUpdate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                    >
                        <option value="UNPAID">Unpaid</option>
                        <option value="PARTIAL">Partial</option>
                        <option value="PAID">Paid</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Work Items</h2>
                    <button
                        onClick={() => {
                            setShowItemForm(!showItemForm);
                            setEditingItem(null);
                            setItemForm({ type: "PART", description: "", quantity: "1", unitPrice: "0" });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors"
                    >
                        {showItemForm ? "Cancel" : "+ Add Item"}
                    </button>
                </div>

                {showItemForm && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-blue-100">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            {editingItem ? "Edit Item" : "Add New Item"}
                        </h3>
                        <form onSubmit={handleItemSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    value={itemForm.type}
                                    onChange={handleItemChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="PART">Part</option>
                                    <option value="LABOR">Labor</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={itemForm.description}
                                    onChange={handleItemChange}
                                    required
                                    rows={2}
                                    placeholder="e.g., Oil filter, Brake pads, Labor hours..."
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity <span className="text-red-500">*</span>
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
                                    Unit Price ($) <span className="text-red-500">*</span>
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
                                    <span className="text-sm text-gray-600">Total: </span>
                                    <span className="text-lg font-bold text-blue-600">
                                        ${(parseFloat(itemForm.quantity || "0") * parseFloat(itemForm.unitPrice || "0")).toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
                                >
                                    {editingItem ? "Update Item" : "Add Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {workOrder.items.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No items added yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Qty</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Unit Price</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {workOrder.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                item.type === "LABOR" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                            }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">{item.description}</td>
                                        <td className="px-4 py-3 text-right text-gray-800">{parseFloat(item.quantity).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right text-gray-800">${parseFloat(item.unitPrice).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-800">${parseFloat(item.total).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleEditItem(item)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-100 font-semibold">
                                <tr>
                                    <td colSpan={4} className="px-4 py-3 text-right text-gray-700">Labor Subtotal:</td>
                                    <td className="px-4 py-3 text-right text-gray-800">${laborTotal.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="px-4 py-3 text-right text-gray-700">Parts Subtotal:</td>
                                    <td className="px-4 py-3 text-right text-gray-800">${partsTotal.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                                <tr className="text-lg">
                                    <td colSpan={4} className="px-4 py-3 text-right text-gray-800">Grand Total:</td>
                                    <td className="px-4 py-3 text-right text-blue-600">${totalFromItems.toFixed(2)}</td>
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
