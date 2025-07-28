/*
  Warnings:

  - Made the column `maxPrice` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minPrice` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "maxPrice" SET NOT NULL,
ALTER COLUMN "minPrice" SET NOT NULL;
