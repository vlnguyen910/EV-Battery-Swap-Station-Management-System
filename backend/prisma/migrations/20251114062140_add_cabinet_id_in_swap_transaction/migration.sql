/*
  Warnings:

  - Made the column `battery_taken_id` on table `swap_transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."swap_transactions" DROP CONSTRAINT "swap_transactions_battery_taken_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."swap_transactions" DROP CONSTRAINT "swap_transactions_cabinet_id_fkey";

-- AlterTable
ALTER TABLE "public"."swap_transactions" ALTER COLUMN "battery_taken_id" SET NOT NULL,
ALTER COLUMN "cabinet_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."swap_transactions" ADD CONSTRAINT "swap_transactions_cabinet_id_fkey" FOREIGN KEY ("cabinet_id") REFERENCES "public"."cabinets"("cabinet_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."swap_transactions" ADD CONSTRAINT "swap_transactions_battery_taken_id_fkey" FOREIGN KEY ("battery_taken_id") REFERENCES "public"."batteries"("battery_id") ON DELETE RESTRICT ON UPDATE CASCADE;
