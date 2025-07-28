/*
  Warnings:

  - You are about to drop the column `price` on the `Car` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Car_price_idx";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "price",
ADD COLUMN     "maxPrice" DECIMAL(10,2),
ADD COLUMN     "minPrice" DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "Car_minPrice_maxPrice_idx" ON "Car"("minPrice", "maxPrice");
