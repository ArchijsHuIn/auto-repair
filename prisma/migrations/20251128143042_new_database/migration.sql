/*
  Warnings:

  - You are about to alter the column `licensePlate` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `make` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `model` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Added the required column `ownerPhone` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('NEW', 'DIAGNOSTIC', 'WAITING_PARTS', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "WorkOrderItemType" AS ENUM ('LABOR', 'PART');

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "mileage" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "ownerPhone" VARCHAR(30) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vin" VARCHAR(30),
ALTER COLUMN "licensePlate" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "make" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "model" SET DATA TYPE VARCHAR(50);

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
CREATE INDEX "Work_Done_carId_idx" ON "Work_Done"("carId");

-- CreateIndex
CREATE INDEX "Work_Done_status_idx" ON "Work_Done"("status");

-- CreateIndex
CREATE INDEX "Work_Done_createdAt_idx" ON "Work_Done"("createdAt");

-- CreateIndex
CREATE INDEX "Work_Item_Used_workOrderId_idx" ON "Work_Item_Used"("workOrderId");

-- CreateIndex
CREATE INDEX "Car_ownerPhone_idx" ON "Car"("ownerPhone");

-- AddForeignKey
ALTER TABLE "Work_Done" ADD CONSTRAINT "Work_Done_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Work_Item_Used" ADD CONSTRAINT "Work_Item_Used_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "Work_Done"("id") ON DELETE CASCADE ON UPDATE CASCADE;
