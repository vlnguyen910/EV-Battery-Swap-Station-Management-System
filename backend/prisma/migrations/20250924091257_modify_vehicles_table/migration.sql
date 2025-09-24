/*
  Warnings:

  - Made the column `user_id` on table `vehicles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `battery_model` on table `vehicles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `battery_type` on table `vehicles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."vehicles" DROP CONSTRAINT "vehicles_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."vehicles" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "battery_model" SET NOT NULL,
ALTER COLUMN "battery_type" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
