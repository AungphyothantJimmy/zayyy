/*
  Warnings:

  - Added the required column `shippingCity` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingName` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPhone` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingTownship` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders"
ADD COLUMN     "shippingCity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingInstructions" TEXT,
ADD COLUMN     "shippingName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingPhone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingTownship" TEXT NOT NULL DEFAULT '',
DROP COLUMN "shippingAddress";
