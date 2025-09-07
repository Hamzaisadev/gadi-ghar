-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "dealershipId" TEXT;

-- AlterTable
ALTER TABLE "DealershipInfo" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Car_dealershipId_idx" ON "Car"("dealershipId");

-- CreateIndex
CREATE INDEX "DealershipInfo_isActive_idx" ON "DealershipInfo"("isActive");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "DealershipInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
