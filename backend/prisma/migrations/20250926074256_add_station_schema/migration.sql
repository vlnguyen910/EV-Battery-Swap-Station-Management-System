-- CreateEnum
CREATE TYPE "public"."StationStatus" AS ENUM ('active', 'inactive', 'maintenance');

-- CreateTable
CREATE TABLE "public"."SwappingStation" (
    "station_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "status" "public"."StationStatus" NOT NULL,

    CONSTRAINT "SwappingStation_pkey" PRIMARY KEY ("station_id")
);
