/*
  Warnings:

  - You are about to drop the column `price` on the `Car` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Car_price_idx";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "price";
