/*
  Warnings:

  - Added the required column `actual` to the `order_status` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `order_status` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatusEnum" AS ENUM ('PENDING_PAYMENT', 'RECEIVED', 'IN_PREPARATION', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "order_status" ADD COLUMN     "actual" BOOLEAN NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatusEnum" NOT NULL;

-- DropEnum
DROP TYPE "OrderStatus";
