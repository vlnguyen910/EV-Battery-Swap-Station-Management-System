-- CreateTable
CREATE TABLE "public"."vehicles" (
    "vehicle_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "battery_id" INTEGER,
    "vin" VARCHAR(50) NOT NULL,
    "battery_model" VARCHAR(50),
    "battery_type" VARCHAR(50),

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("vehicle_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vin_key" ON "public"."vehicles"("vin");

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
