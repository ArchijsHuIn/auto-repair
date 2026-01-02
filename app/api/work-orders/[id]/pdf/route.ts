import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jsPDF from "jspdf";
import { RobotoRegularBase64, RobotoBoldBase64 } from "@/lib/fonts";
import { translateWorkOrderStatus, translatePaymentStatus, translatePaymentMethod, translateWorkOrderItemType } from "@/lib/translations";

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

        // Add Latvian font
        doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegularBase64);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.addFileToVFS("Roboto-Bold.ttf", RobotoBoldBase64);
        doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
        doc.setFont("Roboto");

        // Header
        doc.setFontSize(24);
        doc.setFont("Roboto", "bold");
        doc.text("RĒĶINS", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.setFont("Roboto", "normal");
        doc.text("Autoserviss", 105, 30, { align: "center" });

        // Invoice details
        doc.setFontSize(10);
        doc.text(`Rēķina #: ${workOrder.id}`, 20, 50);
        doc.text(`Datums: ${new Date(workOrder.createdAt).toLocaleDateString("lv-LV")}`, 20, 56);
        doc.text(`Statuss: ${translateWorkOrderStatus(workOrder.status)}`, 20, 62);

        // Customer info
        doc.setFont("Roboto", "bold");
        doc.text("Klients:", 20, 75);
        doc.setFont("Roboto", "normal");
        doc.text(workOrder.car.ownerName, 20, 81);
        doc.text(workOrder.car.ownerPhone, 20, 87);

        // Vehicle info
        doc.setFont("Roboto", "bold");
        doc.text("Transportlīdzeklis:", 120, 75);
        doc.setFont("Roboto", "normal");
        doc.text(workOrder.car.licensePlate, 120, 81);
        doc.text(`${workOrder.car.year || ""} ${workOrder.car.make} ${workOrder.car.model}`, 120, 87);

        // Work description
        doc.setFont("Roboto", "bold");
        doc.text("Darba apraksts:", 20, 100);
        doc.setFont("Roboto", "normal");
        doc.text(workOrder.title, 20, 106);

        if (workOrder.customerComplaint) {
            doc.setFontSize(9);
            const complaint = doc.splitTextToSize(workOrder.customerComplaint, 170);
            doc.text(complaint, 20, 112);
        }

        // Items table
        let yPos = 130;
        doc.setFont("Roboto", "bold");
        doc.setFontSize(10);
        doc.text("Veids", 20, yPos);
        doc.text("Apraksts", 45, yPos);
        doc.text("Skaits", 130, yPos);
        doc.text("Cena", 150, yPos);
        doc.text("Kopā", 180, yPos);

        doc.line(20, yPos + 2, 190, yPos + 2);
        yPos += 8;

        doc.setFont("Roboto", "normal");
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

            doc.text(translateWorkOrderItemType(item.type).toUpperCase(), 20, yPos);
            const desc = doc.splitTextToSize(item.description, 80);
            doc.text(desc, 45, yPos);
            doc.text(parseFloat(item.quantity.toString()).toFixed(2), 130, yPos);
            doc.text(`€${parseFloat(item.unitPrice.toString()).toFixed(2)}`, 150, yPos);
            doc.text(`€${total.toFixed(2)}`, 180, yPos);

            yPos += desc.length * 5 + 2;

            if (yPos > 250) {
                doc.addPage();
                doc.setFont("Roboto", "normal");
                yPos = 20;
            }
        });

        // Totals
        yPos += 5;
        doc.line(20, yPos, 190, yPos);
        yPos += 8;

        doc.setFont("Roboto", "normal");
        doc.text("Darbs kopā:", 130, yPos);
        doc.text(`€${laborTotal.toFixed(2)}`, 180, yPos);
        yPos += 6;

        doc.text("Detaļas kopā:", 130, yPos);
        doc.text(`€${partsTotal.toFixed(2)}`, 180, yPos);
        yPos += 8;

        doc.setFont("Roboto", "bold");
        doc.setFontSize(12);
        doc.text("KOPĀ:", 130, yPos);
        doc.text(`€${(laborTotal + partsTotal).toFixed(2)}`, 180, yPos);

        // Payment status
        yPos += 10;
        doc.setFontSize(10);
        doc.text(`Maksājuma statuss: ${translatePaymentStatus(workOrder.paymentStatus)}`, 20, yPos);
        if (workOrder.paymentMethod) {
            doc.text(`Maksājuma veids: ${translatePaymentMethod(workOrder.paymentMethod)}`, 20, yPos + 6);
        }

        // Footer
        doc.setFont("Roboto", "normal");
        doc.setFontSize(9);
        doc.text("Paldies par uzticību!", 105, 280, { align: "center" });

        // Generate PDF buffer
        const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="rekins-${orderId}_${new Date(workOrder.createdAt).toLocaleDateString("lv-LV").replace(/\./g, "-")}.pdf"`,
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
