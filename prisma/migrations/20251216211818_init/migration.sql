-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('NEW', 'DIAGNOSTIC', 'WAITING_PARTS', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "WorkOrderItemType" AS ENUM ('LABOR', 'PART');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MECHANIC', 'RECEPTIONIST');

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "licensePlate" VARCHAR(20) NOT NULL,
    "vin" VARCHAR(30),
    "year" INTEGER,
    "make" VARCHAR(50) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "mileage" INTEGER,
    "ownerName" VARCHAR(100) NOT NULL DEFAULT 'Unknown',
    "ownerPhone" VARCHAR(30) NOT NULL,
    "notes" TEXT,
    "color" VARCHAR(50) NOT NULL DEFAULT 'Not specified',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work_Done" (
    "id" SERIAL NOT NULL,
    "carId" INTEGER NOT NULL,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'NEW',
    "title" VARCHAR(255) NOT NULL,
    "customerComplaint" TEXT,
    "internalNotes" TEXT,
    "estimatedCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paymentMethod" "PaymentMethod",
    "paidAt" TIMESTAMP(3),
    "totalLabor" DECIMAL(10,2),
    "totalParts" DECIMAL(10,2),
    "totalPrice" DECIMAL(10,2),

    CONSTRAINT "Work_Done_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work_Item_Used" (
    "id" SERIAL NOT NULL,
    "workOrderId" INTEGER NOT NULL,
    "type" "WorkOrderItemType" NOT NULL DEFAULT 'LABOR',
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Work_Item_Used_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Car_ownerPhone_idx" ON "Car"("ownerPhone");

-- CreateIndex
CREATE INDEX "Car_ownerName_idx" ON "Car"("ownerName");

-- CreateIndex
CREATE UNIQUE INDEX "Car_licensePlate_key" ON "Car"("licensePlate");

-- CreateIndex
CREATE INDEX "Work_Done_carId_idx" ON "Work_Done"("carId");

-- CreateIndex
CREATE INDEX "Work_Done_status_idx" ON "Work_Done"("status");

-- CreateIndex
CREATE INDEX "Work_Done_createdAt_idx" ON "Work_Done"("createdAt");

-- CreateIndex
CREATE INDEX "Work_Item_Used_workOrderId_idx" ON "Work_Item_Used"("workOrderId");

-- AddForeignKey
ALTER TABLE "Work_Done" ADD CONSTRAINT "Work_Done_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Work_Item_Used" ADD CONSTRAINT "Work_Item_Used_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "Work_Done"("id") ON DELETE CASCADE ON UPDATE CASCADE;
