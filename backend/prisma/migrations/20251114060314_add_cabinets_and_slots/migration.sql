/*
  Warnings:

  - A unique constraint covering the columns `[slot_id]` on the table `batteries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial_number]` on the table `batteries` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serial_number` to the `batteries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cabinet_id` to the `swap_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CabinetStatus" AS ENUM ('active', 'inactive', 'maintenance');

-- AlterEnum
ALTER TYPE "public"."SwapTransactionStatus" ADD VALUE 'pending';

-- DropForeignKey
ALTER TABLE "public"."swap_transactions" DROP CONSTRAINT "swap_transactions_battery_taken_id_fkey";

-- AlterTable
ALTER TABLE "public"."batteries" ADD COLUMN     "cabinet_id" INTEGER,
ADD COLUMN     "serial_number" VARCHAR(100) NOT NULL,
ADD COLUMN     "slot_id" INTEGER,
ALTER COLUMN "current_charge" SET DEFAULT 0,
ALTER COLUMN "soh" SET DEFAULT 100;

-- AlterTable
ALTER TABLE "public"."swap_transactions" ADD COLUMN     "cabinet_id" INTEGER NOT NULL,
ALTER COLUMN "battery_taken_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."cabinets" (
    "cabinet_id" SERIAL NOT NULL,
    "station_id" INTEGER NOT NULL,
    "cabinet_name" VARCHAR(100) NOT NULL,
    "total_slots" INTEGER NOT NULL,
    "status" "public"."CabinetStatus" NOT NULL,

    CONSTRAINT "cabinets_pkey" PRIMARY KEY ("cabinet_id")
);

-- CreateTable
CREATE TABLE "public"."slots" (
    "slot_id" SERIAL NOT NULL,
    "cabinet_id" INTEGER NOT NULL,
    "slot_number" INTEGER NOT NULL,
    "is_occupied" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "slots_pkey" PRIMARY KEY ("slot_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "slots_cabinet_id_slot_number_key" ON "public"."slots"("cabinet_id", "slot_number");

-- CreateIndex
CREATE UNIQUE INDEX "batteries_slot_id_key" ON "public"."batteries"("slot_id");

-- CreateIndex
CREATE UNIQUE INDEX "batteries_serial_number_key" ON "public"."batteries"("serial_number");

-- AddForeignKey
ALTER TABLE "public"."batteries" ADD CONSTRAINT "batteries_cabinet_id_fkey" FOREIGN KEY ("cabinet_id") REFERENCES "public"."cabinets"("cabinet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."batteries" ADD CONSTRAINT "batteries_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "public"."slots"("slot_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cabinets" ADD CONSTRAINT "cabinets_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "public"."stations"("station_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."slots" ADD CONSTRAINT "slots_cabinet_id_fkey" FOREIGN KEY ("cabinet_id") REFERENCES "public"."cabinets"("cabinet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."swap_transactions" ADD CONSTRAINT "swap_transactions_battery_taken_id_fkey" FOREIGN KEY ("battery_taken_id") REFERENCES "public"."batteries"("battery_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."swap_transactions" ADD CONSTRAINT "swap_transactions_cabinet_id_fkey" FOREIGN KEY ("cabinet_id") REFERENCES "public"."cabinets"("cabinet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
