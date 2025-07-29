-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "price" DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "Car_price_idx" ON "Car"("price");
