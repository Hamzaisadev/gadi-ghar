/*
  Warnings:

  - You are about to drop the column `documents` on the `DealershipApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DealershipApplication" DROP COLUMN "documents",
ADD COLUMN     "logo" TEXT;

-- AlterTable
ALTER TABLE "DealershipInfo" ADD COLUMN     "logo" TEXT;
