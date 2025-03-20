/*
  Warnings:

  - Made the column `paymentDate` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transactionId` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "paymentDate" SET NOT NULL,
ALTER COLUMN "transactionId" SET NOT NULL,
ALTER COLUMN "transactionCode" DROP NOT NULL;
