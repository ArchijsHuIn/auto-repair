import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jsPDF from "jspdf";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const orderId = parseInt(id);

        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Invalid work order ID" },
                { status: 400 }
            );
        }

        const workOrder = await prisma.work_Done.findUnique({
            where: { id: orderId },
            include: {
                car: true,
                items: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!workOrder) {
            return NextResponse.json(
                { error: "Work order not found" },
                { status: 404 }
            );
        }

        // Generate PDF
        const doc = new jsPDF();

        // Header
        doc.setFontSize(24);
        doc.setFont(undefined, "bold");
        doc.text("INVOICE", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.setFont(undefined, "normal");
        doc.text("Auto Repair Shop", 105, 30, { align: "center" });

        // Invoice details
        doc.setFontSize(10);
        doc.text(`Invoice #: ${workOrder.id}`, 20, 50);
        doc.text(`Date: ${new Date(workOrder.createdAt).toLocaleDateString()}`, 20, 56);
        doc.text(`Status: ${workOrder.status}`, 20, 62);

        // Customer info
        doc.setFont(undefined, "bold");
        doc.text("Bill To:", 20, 75);
        doc.setFont(undefined, "normal");
        doc.text(workOrder.car.ownerName, 20, 81);
        doc.text(workOrder.car.ownerPhone, 20, 87);

        // Vehicle info
        doc.setFont(undefined, "bold");
        doc.text("Vehicle:", 120, 75);
        doc.setFont(undefined, "normal");
        doc.text(workOrder.car.licensePlate, 120, 81);
        doc.text(`${workOrder.car.year || ""} ${workOrder.car.make} ${workOrder.car.model}`, 120, 87);

        // Work description
        doc.setFont(undefined, "bold");
        doc.text("Work Description:", 20, 100);
        doc.setFont(undefined, "normal");
        doc.text(workOrder.title, 20, 106);

        if (workOrder.customerComplaint) {
            doc.setFontSize(9);
            const complaint = doc.splitTextToSize(workOrder.customerComplaint, 170);
            doc.text(complaint, 20, 112);
        }

        // Items table
        let yPos = 130;
        doc.setFont(undefined, "bold");
        doc.setFontSize(10);
        doc.text("Type", 20, yPos);
        doc.text("Description", 45, yPos);
        doc.text("Qty", 130, yPos);
        doc.text("Unit Price", 150, yPos);
        doc.text("Total", 180, yPos);

        doc.line(20, yPos + 2, 190, yPos + 2);
        yPos += 8;

        doc.setFont(undefined, "normal");
        doc.setFontSize(9);

        let laborTotal = 0;
        let partsTotal = 0;

        workOrder.items.forEach((item) => {
            const total = parseFloat(item.total.toString());
            if (item.type === "LABOR") {
                laborTotal += total;
            } else {
                partsTotal += total;
            }

            doc.text(item.type, 20, yPos);
            const desc = doc.splitTextToSize(item.description, 80);
            doc.text(desc, 45, yPos);
            doc.text(parseFloat(item.quantity.toString()).toFixed(2), 130, yPos);
            doc.text(`$${parseFloat(item.unitPrice.toString()).toFixed(2)}`, 150, yPos);
            doc.text(`$${total.toFixed(2)}`, 180, yPos);

            yPos += desc.length * 5 + 2;

            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
        });

        // Totals
        yPos += 5;
        doc.line(20, yPos, 190, yPos);
        yPos += 8;

        doc.setFont(undefined, "normal");
        doc.text("Labor Subtotal:", 130, yPos);
        doc.text(`$${laborTotal.toFixed(2)}`, 180, yPos);
        yPos += 6;

        doc.text("Parts Subtotal:", 130, yPos);
        doc.text(`$${partsTotal.toFixed(2)}`, 180, yPos);
        yPos += 8;

        doc.setFont(undefined, "bold");
        doc.setFontSize(12);
        doc.text("TOTAL:", 130, yPos);
        doc.text(`$${(laborTotal + partsTotal).toFixed(2)}`, 180, yPos);

        // Payment status
        yPos += 10;
        doc.setFontSize(10);
        doc.text(`Payment Status: ${workOrder.paymentStatus}`, 20, yPos);
        if (workOrder.paymentMethod) {
            doc.text(`Payment Method: ${workOrder.paymentMethod}`, 20, yPos + 6);
        }

        // Footer
        doc.setFont(undefined, "normal");
        doc.setFontSize(9);
        doc.text("Thank you for your business!", 105, 280, { align: "center" });

        // Generate PDF buffer
        const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="invoice-${orderId}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Error generating PDF:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
