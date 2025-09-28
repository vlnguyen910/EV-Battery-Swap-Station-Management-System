-- CreateEnum
CREATE TYPE "public"."StationStatus" AS ENUM ('active', 'inactive', 'maintenance');

-- CreateTable
CREATE TABLE "public"."changing_stations" (
    "station_id" SERIAL NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "public"."StationStatus" NOT NULL,

    CONSTRAINT "changing_stations_pkey" PRIMARY KEY ("station_id")
);
