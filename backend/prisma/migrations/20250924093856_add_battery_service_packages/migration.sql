-- CreateTable
CREATE TABLE "public"."battery_service_packages" (
    "package_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "base_distance" INTEGER NOT NULL,
    "base_price" DECIMAL(12,2) NOT NULL,
    "swap_count" INTEGER NOT NULL,
    "penalty_fee" INTEGER NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "description" VARCHAR(255),
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "battery_service_packages_pkey" PRIMARY KEY ("package_id")
);
