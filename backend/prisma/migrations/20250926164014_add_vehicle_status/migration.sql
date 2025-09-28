/*
  Warnings:

  - You are about to alter the column `latitude` on the `SwappingStation` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,8)`.
  - You are about to alter the column `longitude` on the `SwappingStation` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(11,8)`.
  - A unique constraint covering the columns `[battery_id]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."VehicleStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "public"."SwappingStation" ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(10,8),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(11,8);

-- AlterTable
ALTER TABLE "public"."vehicles" ADD COLUMN     "status" "public"."VehicleStatus" NOT NULL;

-- CreateTable
CREATE TABLE "public"."batteries" (
    "battery_id" SERIAL NOT NULL,
    "vehicle_id" INTEGER,
    "station_id" INTEGER,
    "model" VARCHAR(100) NOT NULL,
    "capacity" DOUBLE PRECISION NOT NULL,
    "current_charge" DOUBLE PRECISION NOT NULL,
    "soh" DOUBLE PRECISION NOT NULL,
    "last_maintenance" TIMESTAMP(3),
    "vehicleVehicle_id" INTEGER,

    CONSTRAINT "batteries_pkey" PRIMARY KEY ("battery_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batteries_vehicle_id_key" ON "public"."batteries"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_battery_id_key" ON "public"."vehicles"("battery_id");

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_battery_id_fkey" FOREIGN KEY ("battery_id") REFERENCES "public"."batteries"("battery_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."batteries" ADD CONSTRAINT "batteries_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "public"."SwappingStation"("station_id") ON DELETE SET NULL ON UPDATE CASCADE;
