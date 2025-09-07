-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('INDIVIDUAL', 'PARTNERSHIP', 'CORPORATION', 'FRANCHISE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'REQUIRES_CHANGES');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'DEALERSHIP_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- DropIndex
DROP INDEX "Car_bodyType_idx";

-- DropIndex
DROP INDEX "Car_featured_idx";

-- DropIndex
DROP INDEX "Car_fuelType_idx";

-- DropIndex
DROP INDEX "Car_minPrice_maxPrice_idx";

-- DropIndex
DROP INDEX "Car_status_idx";

-- DropIndex
DROP INDEX "Car_year_idx";

-- DropIndex
DROP INDEX "TestDriveBooking_bookingDate_idx";

-- DropIndex
DROP INDEX "UserSavedCar_carId_idx";

-- DropIndex
DROP INDEX "UserSavedCar_userId_idx";

-- AlterTable
ALTER TABLE "DealershipInfo" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dealershipId" TEXT;

-- CreateTable
CREATE TABLE "DealershipApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dealershipName" TEXT NOT NULL,
    "businessLicense" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "businessPhone" TEXT NOT NULL,
    "businessEmail" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "businessType" "BusinessType" NOT NULL,
    "yearsInBusiness" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "documents" TEXT[],
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealershipApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DealershipApplication_userId_idx" ON "DealershipApplication"("userId");

-- CreateIndex
CREATE INDEX "DealershipApplication_status_idx" ON "DealershipApplication"("status");

-- CreateIndex
CREATE INDEX "DealershipApplication_reviewedBy_idx" ON "DealershipApplication"("reviewedBy");

-- CreateIndex
CREATE INDEX "DealershipInfo_isApproved_idx" ON "DealershipInfo"("isApproved");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "DealershipInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealershipInfo" ADD CONSTRAINT "DealershipInfo_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealershipApplication" ADD CONSTRAINT "DealershipApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealershipApplication" ADD CONSTRAINT "DealershipApplication_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
