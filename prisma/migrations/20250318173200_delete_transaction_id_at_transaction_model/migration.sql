/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "addressId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "transactionId";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
