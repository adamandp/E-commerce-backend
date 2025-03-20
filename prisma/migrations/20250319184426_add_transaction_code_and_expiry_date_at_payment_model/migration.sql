/*
  Warnings:

  - Added the required column `expiryDate` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionCode` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "expiryDate" TEXT NOT NULL,
ADD COLUMN     "transactionCode" TEXT NOT NULL;
