/*
  Warnings:

  - You are about to drop the column `last_maintenance` on the `batteries` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleVehicle_id` on the `batteries` table. All the data in the column will be lost.
  - You are about to alter the column `capacity` on the `batteries` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `current_charge` on the `batteries` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - You are about to alter the column `soh` on the `batteries` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.
  - Added the required column `status` to the `batteries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `batteries` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."BatteryStatus" AS ENUM ('full', 'charging', 'booked', 'defective');

-- AlterTable
ALTER TABLE "public"."batteries" DROP COLUMN "last_maintenance",
DROP COLUMN "vehicleVehicle_id",
ADD COLUMN     "status" "public"."BatteryStatus" NOT NULL,
ADD COLUMN     "type" VARCHAR(50) NOT NULL,
ALTER COLUMN "capacity" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "current_charge" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "soh" SET DATA TYPE DECIMAL(5,2);
